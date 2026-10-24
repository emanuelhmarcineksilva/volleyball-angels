from __future__ import annotations

import base64
import hashlib
import hmac
import math
import os
import secrets
import sqlite3
import time
import unicodedata
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Any, Mapping, Sequence

try:
    import bcrypt as _bcrypt
except Exception:
    _bcrypt = None


def _slug(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value).strip().lower())
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.replace("-", " ").replace("_", " ")
    return " ".join(text.split())


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _to_int(value: Any, field: str = "valor") -> int:
    try:
        number = Decimal(str(value).strip())
    except (InvalidOperation, ValueError, AttributeError) as exc:
        raise ValidationError(f"{field} inválido.") from exc
    if not number.is_finite() or number != number.to_integral_value():
        raise ValidationError(f"{field} deve ser um número inteiro.")
    return int(number)


def _to_cents(value: Any, field: str = "preço") -> int:
    try:
        number = Decimal(str(value).strip().replace(",", "."))
    except (InvalidOperation, ValueError, AttributeError) as exc:
        raise ValidationError(f"{field} inválido.") from exc
    if not number.is_finite():
        raise ValidationError(f"{field} inválido.")
    cents = int((number * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    if cents < 0:
        raise ValidationError(f"{field} não pode ser negativo.")
    return cents


def _format_cents(cents: int) -> str:
    sign = "-" if cents < 0 else ""
    absolute = abs(int(cents))
    return f"{sign}{absolute // 100}.{absolute % 100:02d}"


def _normalize_role(role: Any) -> str:
    key = _slug(role)
    return ROLE_ALIASES.get(key, key.replace(" ", "_"))


def _normalize_status(status: Any) -> str:
    key = _slug(status).replace(" ", "_")
    return ATTENDANCE_ALIASES.get(key, key)


ROLE_ALIASES = {
    "presidente": "presidente",
    "president": "presidente",
    "vice": "vice_presidente",
    "vice presidente": "vice_presidente",
    "vice president": "vice_presidente",
    "administrador": "administrador",
    "administrator": "administrador",
    "admin": "administrador",
    "adm": "administrador",
    "coordenador": "coordenador",
    "coordenador time": "coordenador",
    "coordenador de time": "coordenador",
    "coordinator": "coordenador",
    "membro": "membro",
    "member": "membro",
    "jogador": "jogador",
    "player": "jogador",
    "usuario": "usuario",
    "user": "usuario",
    "visitante": "visitante",
    "visitor": "visitante",
}

ROLE_ORDER = {
    "visitante": 10,
    "usuario": 20,
    "jogador": 30,
    "membro": 40,
    "coordenador": 50,
    "administrador": 60,
    "vice_presidente": 70,
    "presidente": 80,
}

PUBLIC_ROLES = {"usuario", "membro", "jogador"}
EVENT_MANAGER_ROLES = {"administrador", "presidente"}
PRESENT_STATUSES = {"presente", "atrasado"}
ATTENDANCE_ALIASES = {
    "presente": "presente",
    "present": "presente",
    "p": "presente",
    "atrasado": "atrasado",
    "late": "atrasado",
    "falta": "falta",
    "ausente": "falta",
    "absent": "falta",
    "falta justificada": "falta_justificada",
    "justificada": "falta_justificada",
    "justified": "falta_justificada",
}


class SystemBackendError(Exception):
    status_code = 500
    code = "INTERNAL_ERROR"

    def __init__(
        self,
        message: str,
        *,
        code: str | None = None,
        details: Mapping[str, Any] | None = None,
        status_code: int | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code or self.__class__.code
        self.details = dict(details or {})
        self.status_code = status_code or self.__class__.status_code


class PermissionDeniedError(SystemBackendError):
    status_code = 403
    code = "FORBIDDEN"


class AuthenticationError(SystemBackendError):
    status_code = 401
    code = "UNAUTHENTICATED"


class NotFoundError(SystemBackendError):
    status_code = 404
    code = "NOT_FOUND"


class ProductNotFoundError(NotFoundError):
    code = "PRODUCT_NOT_FOUND"


class ValidationError(SystemBackendError):
    status_code = 422
    code = "VALIDATION_ERROR"


class AbsenceJustificationError(ValidationError):
    code = "ABSENCE_JUSTIFICATION_REQUIRED"


class OutOfStockError(SystemBackendError):
    status_code = 409
    code = "OUT_OF_STOCK"


class PasswordSecurityError(SystemBackendError):
    status_code = 500
    code = "PASSWORD_NOT_HASHED"


class DuplicateEmailError(SystemBackendError):
    status_code = 409
    code = "DUPLICATE_EMAIL"


class PasswordHasher:
    SCRYPT_N = 2**13
    SCRYPT_R = 8
    SCRYPT_P = 1

    def __init__(self, rounds: int | None = None) -> None:
        configured = rounds if rounds is not None else os.environ.get("ANGELS_BCRYPT_ROUNDS", "9")
        self.rounds = int(configured)
        self.hash_calls = 0

    @property
    def algorithm(self) -> str:
        return "bcrypt" if _bcrypt is not None else "scrypt"

    @property
    def hash_prefix(self) -> str:
        return "$2b$" if _bcrypt is not None else "scrypt$"

    def hash_password(self, password: str) -> str:
        self.hash_calls += 1
        raw = str(password).encode("utf-8")
        if _bcrypt is not None:
            return _bcrypt.hashpw(raw, _bcrypt.gensalt(rounds=self.rounds)).decode("ascii")
        salt = secrets.token_hex(16)
        digest = hashlib.scrypt(
            raw,
            salt=salt.encode("ascii"),
            n=self.SCRYPT_N,
            r=self.SCRYPT_R,
            p=self.SCRYPT_P,
            dklen=32,
        )
        encoded = base64.b64encode(digest).decode("ascii")
        return f"scrypt${self.SCRYPT_N}${self.SCRYPT_R}${self.SCRYPT_P}${salt}${encoded}"

    def verify_password(self, password: str, stored_hash: str) -> bool:
        if stored_hash is None:
            return False
        stored = str(stored_hash)
        raw = str(password).encode("utf-8")
        if stored.startswith(("$2a$", "$2b$", "$2y$")):
            if _bcrypt is None:
                return False
            try:
                return bool(_bcrypt.checkpw(raw, stored.encode("ascii")))
            except (ValueError, TypeError):
                return False
        if stored.startswith("scrypt$"):
            try:
                _, n_value, r_value, p_value, salt, digest = stored.split("$", 5)
                calculated = hashlib.scrypt(
                    raw,
                    salt=salt.encode("ascii"),
                    n=int(n_value),
                    r=int(r_value),
                    p=int(p_value),
                    dklen=32,
                )
                return hmac.compare_digest(
                    base64.b64encode(calculated).decode("ascii"),
                    digest,
                )
            except (ValueError, TypeError):
                return False
        if stored.startswith("pbkdf2_sha256$"):
            try:
                _, iterations, salt, digest = stored.split("$", 3)
                calculated = hashlib.pbkdf2_hmac(
                    "sha256",
                    raw,
                    salt.encode("ascii"),
                    int(iterations),
                )
                return hmac.compare_digest(
                    base64.b64encode(calculated).decode("ascii"),
                    digest,
                )
            except (ValueError, TypeError):
                return False
        return False

    @staticmethod
    def is_hashed(value: str) -> bool:
        return str(value).startswith(("$2a$", "$2b$", "$2y$", "scrypt$", "pbkdf2_sha256$"))


SCHEMA = """
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    telefone TEXT NOT NULL DEFAULT '',
    sexo TEXT NOT NULL DEFAULT '',
    cargo TEXT NOT NULL,
    newsletter INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_hora TEXT NOT NULL,
    local TEXT NOT NULL,
    duracao TEXT NOT NULL DEFAULT '01:00',
    descricao TEXT NOT NULL DEFAULT '',
    criado_por INTEGER,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS treinos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_hora TEXT NOT NULL,
    local TEXT NOT NULL,
    duracao TEXT NOT NULL DEFAULT '01:00',
    tipo TEXT NOT NULL DEFAULT 'Coletivo',
    criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS presencas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treino_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('presente', 'atrasado', 'falta', 'falta_justificada')),
    justificativa TEXT,
    documento_nome TEXT,
    documento_payload TEXT,
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL,
    UNIQUE (treino_id, usuario_id),
    FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    preco_centavos INTEGER NOT NULL CHECK (preco_centavos >= 0),
    estoque INTEGER NOT NULL CHECK (estoque >= 0),
    categoria TEXT NOT NULL DEFAULT 'Geral',
    criado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_pedido TEXT NOT NULL,
    valor_total_centavos INTEGER NOT NULL CHECK (valor_total_centavos >= 0),
    forma_pagamento TEXT NOT NULL,
    situacao TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS pedido_itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    nome_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario_centavos INTEGER NOT NULL CHECK (preco_unitario_centavos >= 0),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adversario TEXT NOT NULL,
    data_hora_inicio TEXT NOT NULL,
    data_hora_fim TEXT,
    local TEXT NOT NULL DEFAULT '',
    tipo_jogo TEXT NOT NULL DEFAULT 'Amistoso',
    ponto_clube INTEGER NOT NULL DEFAULT 0 CHECK (ponto_clube >= 0),
    ponto_adversario INTEGER NOT NULL DEFAULT 0 CHECK (ponto_adversario >= 0),
    status TEXT NOT NULL DEFAULT 'em_andamento',
    observacoes TEXT NOT NULL DEFAULT '',
    criado_em TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jogo_membros (
    jogo_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    PRIMARY KEY (jogo_id, usuario_id),
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notificacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    jogo_id INTEGER,
    tipo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE
);
"""


class SystemBackend:
    def __init__(self, db_path: str = ":memory:", password_hasher: PasswordHasher | None = None) -> None:
        self.db_path = db_path
        self.password_hasher = password_hasher or PasswordHasher()
        self.notification_events: list[dict[str, Any]] = []
        self._conn: sqlite3.Connection | None = None
        self._connect()
        self._create_schema()

    def _connect(self) -> None:
        if self._conn is not None:
            self._conn.close()
        self._conn = sqlite3.connect(
            self.db_path,
            isolation_level=None,
            check_same_thread=False,
        )
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA foreign_keys = ON")
        self._conn.execute("PRAGMA busy_timeout = 5000")

    def _create_schema(self) -> None:
        self._conn.executescript(SCHEMA)

    def close(self) -> None:
        if self._conn is not None:
            self._conn.close()
            self._conn = None

    def close_backend(self) -> None:
        self.close()

    def reset_database(self) -> bool:
        self.close()
        if self.db_path != ":memory:" and os.path.exists(self.db_path):
            os.remove(self.db_path)
        self._connect()
        self._create_schema()
        self.password_hasher.hash_calls = 0
        self.notification_events = []
        return True

    def _params(self, params: Any = None) -> tuple[Any, ...]:
        if params is None:
            return ()
        if isinstance(params, (list, tuple)):
            return tuple(params)
        return (params,)

    def query_scalar(self, sql: str, params: Any = None) -> Any:
        row = self._conn.execute(sql, self._params(params)).fetchone()
        return None if row is None else row[0]

    def query_one(self, sql: str, params: Any = None) -> dict[str, Any] | None:
        row = self._conn.execute(sql, self._params(params)).fetchone()
        return None if row is None else dict(row)

    def query_all(self, sql: str, params: Any = None) -> list[dict[str, Any]]:
        rows = self._conn.execute(sql, self._params(params)).fetchall()
        return [dict(row) for row in rows]

    def table_count(self, table: str) -> int:
        allowed = {
            "usuarios",
            "eventos",
            "treinos",
            "presencas",
            "produtos",
            "pedidos",
            "pedido_itens",
            "jogos",
            "jogo_membros",
            "notificacoes",
        }
        if table not in allowed:
            raise ValidationError(f"Tabela não permitida: {table}")
        return int(self.query_scalar(f"SELECT COUNT(*) FROM {table}") or 0)

    def _validate_password_storage(self, plain_password: str, stored_password: str) -> bool:
        if not stored_password or stored_password == plain_password:
            raise PasswordSecurityError("A senha não foi armazenada como hash.")
        if not self.password_hasher.verify_password(plain_password, stored_password):
            raise PasswordSecurityError("O hash armazenado não confere com a senha cadastrada.")
        return True

    def create_user(
        self,
        nome: str,
        email: str,
        senha: str,
        telefone: str = "",
        sexo: str = "",
        cargo: str = "Membro",
        newsletter: Any = False,
    ) -> dict[str, Any]:
        return self._create_user(
            nome,
            email,
            senha,
            telefone,
            sexo,
            cargo,
            newsletter,
            allow_privileged=True,
        )

    def register_member(
        self,
        nome: str,
        email: str,
        senha: str,
        telefone: str = "",
        sexo: str = "",
    ) -> dict[str, Any]:
        return self._create_user(
            nome,
            email,
            senha,
            telefone,
            sexo,
            "Membro",
            False,
            allow_privileged=False,
        )

    def register_user(
        self,
        nome: str,
        email: str,
        senha: str,
        telefone: str = "",
        sexo: str = "",
        cargo: str = "Membro",
        newsletter: Any = False,
    ) -> dict[str, Any]:
        return self._create_user(
            nome,
            email,
            senha,
            telefone,
            sexo,
            cargo,
            newsletter,
            allow_privileged=False,
        )

    def _create_user(
        self,
        nome: str,
        email: str,
        senha: str,
        telefone: str,
        sexo: str,
        cargo: str,
        newsletter: Any,
        *,
        allow_privileged: bool,
    ) -> dict[str, Any]:
        start = time.perf_counter()
        calls_before = self.password_hasher.hash_calls
        clean_name = str(nome or "").strip()
        clean_email = str(email or "").strip().lower()
        if not clean_name:
            raise ValidationError("Nome é obrigatório.")
        if not clean_email or "@" not in clean_email:
            raise ValidationError("E-mail inválido.")
        if not isinstance(senha, str) or len(senha) < 6:
            raise ValidationError("A senha deve ter pelo menos 6 caracteres.")
        role = _normalize_role(cargo or "Membro")
        if role not in ROLE_ORDER:
            raise ValidationError(f"Cargo inválido: {cargo}")
        if not allow_privileged and role not in PUBLIC_ROLES:
            raise PermissionDeniedError(
                "O cadastro público não permite criar contas com este cargo.",
                details={"cargo_solicitado": role},
            )
        if self.query_scalar("SELECT 1 FROM usuarios WHERE email = ?", clean_email) is not None:
            raise DuplicateEmailError(f"Já existe um usuário com o e-mail {clean_email}.")

        stored_hash = self.password_hasher.hash_password(senha)
        self._conn.execute("BEGIN IMMEDIATE")
        try:
            cursor = self._conn.execute(
                """
                INSERT INTO usuarios (nome, email, senha, telefone, sexo, cargo, newsletter, criado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    clean_name,
                    clean_email,
                    stored_hash,
                    str(telefone or ""),
                    str(sexo or ""),
                    role,
                    int(bool(newsletter)),
                    _now(),
                ),
            )
            user_id = int(cursor.lastrowid)
            stored_in_db = self._conn.execute(
                "SELECT senha FROM usuarios WHERE id = ?",
                (user_id,),
            ).fetchone()[0]
            self._validate_password_storage(senha, stored_in_db)
            self._conn.execute("COMMIT")
        except sqlite3.IntegrityError as exc:
            self._conn.execute("ROLLBACK")
            raise DuplicateEmailError(f"Já existe um usuário com o e-mail {clean_email}.") from exc
        except Exception:
            self._conn.execute("ROLLBACK")
            raise

        elapsed_ms = (time.perf_counter() - start) * 1000
        return {
            "user_id": user_id,
            "nome": clean_name,
            "email": clean_email,
            "cargo": role,
            "hash_calls": self.password_hasher.hash_calls - calls_before,
            "hash_calls_total": self.password_hasher.hash_calls,
            "elapsed_ms": elapsed_ms,
        }

    def get_password_hash(self, email: str) -> str | None:
        return self.query_scalar(
            "SELECT senha FROM usuarios WHERE email = ?",
            str(email).strip().lower(),
        )

    def get_stored_password(self, email: str) -> str | None:
        return self.get_password_hash(email)

    def get_password_hash_prefix(self) -> str:
        return self.password_hasher.hash_prefix

    def get_password_algorithm(self, email: str | None = None) -> str:
        if email is None:
            return self.password_hasher.algorithm
        stored = self.get_password_hash(email)
        if stored is None:
            raise NotFoundError(f"Usuário não encontrado: {email}")
        if str(stored).startswith(("$2a$", "$2b$", "$2y$")):
            return "bcrypt"
        if str(stored).startswith("scrypt$"):
            return "scrypt"
        if str(stored).startswith("pbkdf2_sha256$"):
            return "pbkdf2_sha256"
        return "unknown"

    def verify_password(self, plain_password: str, stored_hash: str) -> bool:
        return self.password_hasher.verify_password(plain_password, stored_hash)

    def get_hash_call_count(self) -> int:
        return self.password_hasher.hash_calls

    def assert_password_is_protected(self, email: str, plain_password: str) -> bool:
        stored = self.get_password_hash(email)
        if stored is None:
            raise NotFoundError(f"Usuário não encontrado: {email}")
        return self._validate_password_storage(plain_password, stored)

    def _user_row(self, user_id: Any) -> dict[str, Any]:
        user = self.query_one("SELECT * FROM usuarios WHERE id = ?", _to_int(user_id, "usuário"))
        if user is None:
            raise NotFoundError(f"Usuário não encontrado: {user_id}")
        return user

    def get_user(self, user_id: Any) -> dict[str, Any]:
        return self._user_row(user_id)

    def get_user_role(self, user_id: Any) -> str:
        return self._user_row(user_id)["cargo"]

    def create_event(
        self,
        actor_id: Any,
        nome: str,
        data_hora: str,
        local: str,
        duracao: str = "01:00",
        descricao: str = "",
    ) -> dict[str, Any]:
        actor = self._user_row(actor_id)
        if actor["cargo"] not in EVENT_MANAGER_ROLES:
            raise PermissionDeniedError(
                "Apenas Administrador ou Presidente podem gerenciar eventos.",
                details={"cargo": actor["cargo"]},
            )
        if not str(nome or "").strip():
            raise ValidationError("Nome do evento é obrigatório.")
        cursor = self._conn.execute(
            """
            INSERT INTO eventos (nome, data_hora, local, duracao, descricao, criado_por, criado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(nome).strip(),
                str(data_hora),
                str(local),
                str(duracao),
                str(descricao),
                int(actor["id"]),
                _now(),
            ),
        )
        return {
            "event_id": int(cursor.lastrowid),
            "nome": str(nome).strip(),
            "criado_por": int(actor["id"]),
        }

    def _event_row(self, event_id: Any) -> dict[str, Any]:
        event = self.query_one("SELECT * FROM eventos WHERE id = ?", _to_int(event_id, "evento"))
        if event is None:
            raise NotFoundError(f"Evento não encontrado: {event_id}")
        return event

    def get_event(self, event_id: Any) -> dict[str, Any] | None:
        return self.query_one("SELECT * FROM eventos WHERE id = ?", _to_int(event_id, "evento"))

    def event_exists(self, event_id: Any) -> bool:
        return self.get_event(event_id) is not None

    def update_event(self, actor_id: Any, event_id: Any, **changes: Any) -> dict[str, Any]:
        actor = self._user_row(actor_id)
        if actor["cargo"] not in EVENT_MANAGER_ROLES:
            raise PermissionDeniedError(
                "Apenas Administrador ou Presidente podem gerenciar eventos.",
                details={"cargo": actor["cargo"]},
            )
        event = self._event_row(event_id)
        allowed = {"nome", "data_hora", "local", "duracao", "descricao"}
        fields = {key: value for key, value in changes.items() if key in allowed}
        if not fields:
            return dict(event)
        assignments = ", ".join(f"{key} = ?" for key in fields)
        self._conn.execute(
            f"UPDATE eventos SET {assignments} WHERE id = ?",
            (*fields.values(), int(event["id"])),
        )
        return self._event_row(event["id"])

    def delete_event(self, actor_id: Any, event_id: Any) -> dict[str, Any]:
        actor = self._user_row(actor_id)
        if actor["cargo"] not in EVENT_MANAGER_ROLES:
            raise PermissionDeniedError(
                "Apenas Administrador ou Presidente podem excluir eventos.",
                details={"cargo": actor["cargo"], "status": 403},
            )
        event = self._event_row(event_id)
        cursor = self._conn.execute("DELETE FROM eventos WHERE id = ?", (int(event["id"]),))
        if cursor.rowcount != 1:
            raise NotFoundError(f"Evento não encontrado: {event_id}")
        return {"deleted": True, "event_id": int(event["id"]), "nome": event["nome"]}

    def delete_event_as(self, actor_id: Any, event_id: Any) -> dict[str, Any]:
        return self.delete_event(actor_id, event_id)

    def create_training(
        self,
        data_hora: str,
        local: str = "Ginásio",
        duracao: str = "01:00",
        tipo: str = "Coletivo",
    ) -> dict[str, Any]:
        cursor = self._conn.execute(
            """
            INSERT INTO treinos (data_hora, local, duracao, tipo, criado_em)
            VALUES (?, ?, ?, ?, ?)
            """,
            (str(data_hora), str(local), str(duracao), str(tipo), _now()),
        )
        return {"treino_id": int(cursor.lastrowid), "data_hora": str(data_hora)}

    def _training_row(self, treino_id: Any) -> dict[str, Any]:
        training = self.query_one("SELECT * FROM treinos WHERE id = ?", _to_int(treino_id, "treino"))
        if training is None:
            raise NotFoundError(f"Treino não encontrado: {treino_id}")
        return training

    def record_attendance(
        self,
        treino_id: Any,
        usuario_id: Any,
        status: str = "presente",
        justificativa: str | None = None,
        documento: Any = None,
    ) -> dict[str, Any]:
        training = self._training_row(treino_id)
        user = self._user_row(usuario_id)
        normalized = _normalize_status(status)
        if normalized not in {"presente", "atrasado", "falta", "falta_justificada"}:
            raise ValidationError(f"Status de presença inválido: {status}")
        document_name, document_payload = self._parse_document(documento)
        if normalized == "falta_justificada":
            if not justificativa or not str(justificativa).strip():
                raise AbsenceJustificationError("Justificativa formal é obrigatória para falta justificada.")
            if document_payload is None:
                raise AbsenceJustificationError("O upload do documento é obrigatório para falta justificada.")
        self._conn.execute(
            """
            INSERT INTO presencas
                (treino_id, usuario_id, status, justificativa, documento_nome, documento_payload, criado_em, atualizado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (treino_id, usuario_id) DO UPDATE SET
                status = excluded.status,
                justificativa = excluded.justificativa,
                documento_nome = excluded.documento_nome,
                documento_payload = excluded.documento_payload,
                atualizado_em = excluded.atualizado_em
            """,
            (
                int(training["id"]),
                int(user["id"]),
                normalized,
                str(justificativa).strip() if justificativa else None,
                document_name,
                document_payload,
                _now(),
                _now(),
            ),
        )
        attendance_id = int(
            self.query_scalar(
                "SELECT id FROM presencas WHERE treino_id = ? AND usuario_id = ?",
                [int(training["id"]), int(user["id"])],
            )
        )
        return {
            "attendance_id": attendance_id,
            "treino_id": int(training["id"]),
            "usuario_id": int(user["id"]),
            "status": normalized,
        }

    def _parse_document(self, documento: Any) -> tuple[str | None, str | None]:
        if documento is None:
            return None, None
        if isinstance(documento, Mapping):
            name = (
                documento.get("nome")
                or documento.get("filename")
                or documento.get("name")
                or "atestado"
            )
            payload = (
                documento.get("conteudo")
                or documento.get("content")
                or documento.get("payload")
                or documento.get("data")
            )
            if payload is None or (isinstance(payload, (str, bytes, bytearray)) and not payload):
                return None, None
            if isinstance(payload, (bytes, bytearray)):
                payload = bytes(payload).hex()
            return str(name), str(payload)
        if isinstance(documento, (bytes, bytearray)):
            if len(documento) == 0:
                return None, None
            return "atestado", bytes(documento).hex()
        text = str(documento).strip()
        if not text:
            return None, None
        if os.path.sep in text:
            return os.path.basename(text), text
        return text, text

    def _attendance_row(self, attendance_id: Any) -> dict[str, Any]:
        attendance = self.query_one(
            "SELECT * FROM presencas WHERE id = ?",
            _to_int(attendance_id, "presença"),
        )
        if attendance is None:
            raise NotFoundError(f"Presença não encontrada: {attendance_id}")
        return attendance

    def get_attendance(self, attendance_id: Any) -> dict[str, Any]:
        return self._attendance_row(attendance_id)

    def get_attendance_status(self, attendance_id: Any) -> str:
        return self._attendance_row(attendance_id)["status"]

    def justify_absence(
        self,
        attendance_id: Any,
        justificativa: str,
        documento: Any = None,
    ) -> dict[str, Any]:
        attendance = self._attendance_row(attendance_id)
        if attendance["status"] not in {"falta", "falta_justificada"}:
            raise ValidationError("Somente uma falta pode ser justificada.")
        if not justificativa or not str(justificativa).strip():
            raise AbsenceJustificationError("Justificativa formal é obrigatória.")
        document_name, document_payload = self._parse_document(documento)
        if document_payload is None:
            raise AbsenceJustificationError(
                "O upload do documento (atestado) é obrigatório para justificar a falta."
            )
        self._conn.execute(
            """
            UPDATE presencas
               SET status = 'falta_justificada',
                   justificativa = ?,
                   documento_nome = ?,
                   documento_payload = ?,
                   atualizado_em = ?
             WHERE id = ?
            """,
            (
                str(justificativa).strip(),
                document_name,
                document_payload,
                _now(),
                int(attendance["id"]),
            ),
        )
        updated = self._attendance_row(attendance["id"])
        return {
            "attendance_id": int(updated["id"]),
            "status": updated["status"],
            "justificativa": updated["justificativa"],
            "documento_nome": updated["documento_nome"],
        }

    def attendance_report(self, usuario_id: Any) -> dict[str, Any]:
        user = self._user_row(usuario_id)
        rows = self.query_all(
            "SELECT status FROM presencas WHERE usuario_id = ? ORDER BY id",
            int(user["id"]),
        )
        total = len(rows)
        present = sum(1 for row in rows if row["status"] in PRESENT_STATUSES)
        absent = total - present
        justified = sum(1 for row in rows if row["status"] == "falta_justificada")
        percentage = 0.0 if total == 0 else math.floor((present / total) * 1000) / 10
        return {
            "usuario_id": int(user["id"]),
            "total": total,
            "present": present,
            "absent": absent,
            "justified": justified,
            "percentage": percentage,
        }

    def calculate_attendance_percentage(self, usuario_id: Any) -> float:
        return float(self.attendance_report(usuario_id)["percentage"])

    def create_product(
        self,
        nome: str,
        preco: Any,
        estoque: Any,
        descricao: str = "",
        categoria: str = "Geral",
    ) -> dict[str, Any]:
        if not str(nome or "").strip():
            raise ValidationError("Nome do produto é obrigatório.")
        price_cents = _to_cents(preco)
        stock = _to_int(estoque, "estoque")
        if stock < 0:
            raise ValidationError("Estoque não pode ser negativo.")
        cursor = self._conn.execute(
            """
            INSERT INTO produtos (nome, descricao, preco_centavos, estoque, categoria, criado_em)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                str(nome).strip(),
                str(descricao),
                price_cents,
                stock,
                str(categoria),
                _now(),
            ),
        )
        return {
            "product_id": int(cursor.lastrowid),
            "nome": str(nome).strip(),
            "preco_cents": price_cents,
            "preco": _format_cents(price_cents),
            "estoque": stock,
        }

    def _product_row(self, product_id: Any, conn: sqlite3.Connection | None = None) -> dict[str, Any]:
        connection = conn or self._conn
        row = connection.execute(
            "SELECT * FROM produtos WHERE id = ?",
            (_to_int(product_id, "produto"),),
        ).fetchone()
        if row is None:
            raise ProductNotFoundError(f"Produto não encontrado: {product_id}")
        return dict(row)

    def get_product(self, product_id: Any) -> dict[str, Any] | None:
        return self.query_one("SELECT * FROM produtos WHERE id = ?", _to_int(product_id, "produto"))

    def get_product_stock(self, product_id: Any) -> int:
        stock = self.query_scalar(
            "SELECT estoque FROM produtos WHERE id = ?",
            _to_int(product_id, "produto"),
        )
        if stock is None:
            raise ProductNotFoundError(f"Produto não encontrado: {product_id}")
        return int(stock)

    def get_product_price(self, product_id: Any) -> str:
        product = self._product_row(product_id)
        return _format_cents(int(product["preco_centavos"]))

    def _price_cart(self, conn: sqlite3.Connection, items: Any) -> dict[str, Any]:
        if isinstance(items, Mapping):
            items = [items]
        if not isinstance(items, Sequence) or isinstance(items, (str, bytes, bytearray)):
            raise ValidationError("Itens do carrinho inválidos.")
        if len(items) == 0:
            raise ValidationError("O carrinho está vazio.")
        line_items: list[dict[str, Any]] = []
        total_cents = 0
        for raw in items:
            if not isinstance(raw, Mapping):
                raise ValidationError("Cada item do carrinho deve ser um objeto.")
            product_id = raw.get("produto_id", raw.get("product_id", raw.get("id")))
            quantity = raw.get("quantidade", raw.get("quantity"))
            if product_id is None or quantity is None:
                raise ValidationError("Cada item precisa de produto_id e quantidade.")
            product_id_int = _to_int(product_id, "produto")
            quantity_int = _to_int(quantity, "quantidade")
            if product_id_int <= 0 or quantity_int <= 0:
                raise ValidationError("Produto e quantidade devem ser maiores que zero.")
            product = self._product_row(product_id_int, conn)
            if int(product["estoque"]) < quantity_int:
                raise OutOfStockError(
                    f'Estoque insuficiente de "{product["nome"]}". '
                    f'Disponível: {product["estoque"]}, solicitado: {quantity_int}.',
                    details={
                        "produto_id": int(product["id"]),
                        "estoque": int(product["estoque"]),
                        "solicitado": quantity_int,
                    },
                )
            unit_cents = int(product["preco_centavos"])
            subtotal_cents = unit_cents * quantity_int
            total_cents += subtotal_cents
            line_items.append(
                {
                    "produto_id": int(product["id"]),
                    "nome": product["nome"],
                    "quantidade": quantity_int,
                    "preco_unitario_cents": unit_cents,
                    "preco_unitario": _format_cents(unit_cents),
                    "subtotal_cents": subtotal_cents,
                    "subtotal": _format_cents(subtotal_cents),
                }
            )
        return {
            "items": line_items,
            "line_items": line_items,
            "subtotals_cents": [item["subtotal_cents"] for item in line_items],
            "total_cents": total_cents,
            "total": _format_cents(total_cents),
        }

    def preview_cart(self, items: Any) -> dict[str, Any]:
        return self._price_cart(self._conn, items)

    def calculate_cart_total(self, items: Any) -> dict[str, Any]:
        return self.preview_cart(items)

    def preview_checkout(self, items: Any) -> dict[str, Any]:
        return self.preview_cart(items)

    def _normalize_payment(self, forma_pagamento: Any) -> str:
        key = _slug(forma_pagamento)
        allowed = {
            "pix": "PIX",
            "cartao de credito": "Cartao de credito",
            "cartao de debito": "Cartao de debito",
            "dinheiro": "Dinheiro",
        }
        if key not in allowed:
            raise ValidationError("Forma de pagamento inválida.")
        return allowed[key]

    def process_order(
        self,
        usuario_id: Any,
        items: Any,
        forma_pagamento: str = "PIX",
    ) -> dict[str, Any]:
        user = self._user_row(usuario_id)
        payment = self._normalize_payment(forma_pagamento)
        self._conn.execute("BEGIN IMMEDIATE")
        try:
            priced = self._price_cart(self._conn, items)
            order_cursor = self._conn.execute(
                """
                INSERT INTO pedidos
                    (usuario_id, data_pedido, valor_total_centavos, forma_pagamento, situacao)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    int(user["id"]),
                    _now(),
                    int(priced["total_cents"]),
                    payment,
                    "Aguardando pagamento",
                ),
            )
            order_id = int(order_cursor.lastrowid)
            final_items: list[dict[str, Any]] = []
            stock_after: dict[int, int] = {}
            for line in priced["items"]:
                self._conn.execute(
                    """
                    INSERT INTO pedido_itens
                        (pedido_id, produto_id, nome_produto, quantidade, preco_unitario_centavos)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        order_id,
                        line["produto_id"],
                        line["nome"],
                        line["quantidade"],
                        line["preco_unitario_cents"],
                    ),
                )
                updated = self._conn.execute(
                    """
                    UPDATE produtos
                       SET estoque = estoque - ?
                     WHERE id = ? AND estoque >= ?
                    """,
                    (line["quantidade"], line["produto_id"], line["quantidade"]),
                )
                if updated.rowcount != 1:
                    raise OutOfStockError(
                        f'Estoque insuficiente de "{line["nome"]}".',
                        details={"produto_id": line["produto_id"]},
                    )
                remaining = int(
                    self._conn.execute(
                        "SELECT estoque FROM produtos WHERE id = ?",
                        (line["produto_id"],),
                    ).fetchone()[0]
                )
                stock_after[line["produto_id"]] = remaining
                final_items.append({**line, "estoque_restante": remaining})
            self._conn.execute("COMMIT")
        except Exception:
            self._conn.execute("ROLLBACK")
            raise
        return {
            "order_id": order_id,
            "usuario_id": int(user["id"]),
            "total_cents": int(priced["total_cents"]),
            "total": priced["total"],
            "forma_pagamento": payment,
            "situacao": "Aguardando pagamento",
            "items": final_items,
            "stock_after": stock_after,
        }

    def checkout(
        self,
        usuario_id: Any,
        items: Any,
        forma_pagamento: str = "PIX",
    ) -> dict[str, Any]:
        return self.process_order(usuario_id, items, forma_pagamento)

    def get_order_count(self) -> int:
        return self.table_count("pedidos")

    def get_order(self, order_id: Any) -> dict[str, Any] | None:
        return self.query_one("SELECT * FROM pedidos WHERE id = ?", _to_int(order_id, "pedido"))

    def get_order_items(self, order_id: Any) -> list[dict[str, Any]]:
        return self.query_all(
            "SELECT * FROM pedido_itens WHERE pedido_id = ? ORDER BY id",
            _to_int(order_id, "pedido"),
        )

    def change_role(self, actor_id: Any, target_id: Any, new_role: str) -> dict[str, Any]:
        actor = self._user_row(actor_id)
        target = self._user_row(target_id)
        normalized = _normalize_role(new_role)
        if normalized not in ROLE_ORDER:
            raise ValidationError(f"Cargo inválido: {new_role}")
        if target["cargo"] == "coordenador" and actor["cargo"] != "presidente":
            raise PermissionDeniedError(
                "Apenas o Presidente pode alterar o cargo de um Coordenador.",
                details={"cargo_ator": actor["cargo"], "cargo_alvo": target["cargo"]},
            )
        if normalized in {"presidente", "vice_presidente"} and actor["cargo"] != "presidente":
            raise PermissionDeniedError(
                "Apenas o Presidente pode nomear Presidente ou Vice-Presidente.",
                details={"cargo_ator": actor["cargo"]},
            )
        self._conn.execute(
            "UPDATE usuarios SET cargo = ? WHERE id = ?",
            (normalized, int(target["id"])),
        )
        return {
            "user_id": int(target["id"]),
            "old_role": target["cargo"],
            "new_role": normalized,
        }

    def demote_member(
        self,
        actor_id: Any,
        target_id: Any,
        new_role: str = "Membro",
    ) -> dict[str, Any]:
        return self.change_role(actor_id, target_id, new_role)

    def create_game(
        self,
        adversario: str,
        data_hora_inicio: str,
        data_hora_fim: str | None = None,
        local: str = "Ginásio",
        tipo_jogo: str = "Amistoso",
        observacoes: str = "",
        status: str = "em_andamento",
    ) -> dict[str, Any]:
        if not str(adversario or "").strip():
            raise ValidationError("Adversário é obrigatório.")
        now = _now()
        cursor = self._conn.execute(
            """
            INSERT INTO jogos
                (adversario, data_hora_inicio, data_hora_fim, local, tipo_jogo,
                 ponto_clube, ponto_adversario, status, observacoes, criado_em, atualizado_em)
            VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?)
            """,
            (
                str(adversario).strip(),
                str(data_hora_inicio),
                None if data_hora_fim is None else str(data_hora_fim),
                str(local),
                str(tipo_jogo),
                str(status),
                str(observacoes),
                now,
                now,
            ),
        )
        return {
            "game_id": int(cursor.lastrowid),
            "adversario": str(adversario).strip(),
            "status": str(status),
        }

    def _game_row(self, game_id: Any) -> dict[str, Any]:
        game = self.query_one("SELECT * FROM jogos WHERE id = ?", _to_int(game_id, "jogo"))
        if game is None:
            raise NotFoundError(f"Jogo não encontrado: {game_id}")
        return game

    def link_member_to_game(self, game_id: Any, usuario_id: Any) -> dict[str, Any]:
        game = self._game_row(game_id)
        user = self._user_row(usuario_id)
        self._conn.execute(
            "INSERT OR IGNORE INTO jogo_membros (jogo_id, usuario_id) VALUES (?, ?)",
            (int(game["id"]), int(user["id"])),
        )
        return {"game_id": int(game["id"]), "usuario_id": int(user["id"])}

    def update_score(
        self,
        game_id: Any,
        ponto_clube: Any,
        ponto_adversario: Any,
    ) -> dict[str, Any]:
        game = self._game_row(game_id)
        club_points = _to_int(ponto_clube, "ponto do clube")
        opponent_points = _to_int(ponto_adversario, "ponto do adversário")
        if club_points < 0 or opponent_points < 0:
            raise ValidationError("A pontuação não pode ser negativa.")
        members = self.query_all(
            "SELECT usuario_id FROM jogo_membros WHERE jogo_id = ? ORDER BY usuario_id",
            int(game["id"]),
        )
        member_ids = [int(row["usuario_id"]) for row in members]
        message = (
            f'Placar atualizado: Angels {club_points} x {opponent_points} {game["adversario"]}'
        )
        notifications: list[dict[str, Any]] = []
        self._conn.execute("BEGIN IMMEDIATE")
        try:
            self._conn.execute(
                """
                UPDATE jogos
                   SET ponto_clube = ?,
                       ponto_adversario = ?,
                       status = 'em_andamento',
                       atualizado_em = ?
                 WHERE id = ?
                """,
                (club_points, opponent_points, _now(), int(game["id"])),
            )
            for member_id in member_ids:
                cursor = self._conn.execute(
                    """
                    INSERT INTO notificacoes
                        (usuario_id, jogo_id, tipo, mensagem, lida, criado_em)
                    VALUES (?, ?, ?, ?, 0, ?)
                    """,
                    (
                        member_id,
                        int(game["id"]),
                        "jogo.placar_atualizado",
                        message,
                        _now(),
                    ),
                )
                notifications.append(
                    {
                        "notification_id": int(cursor.lastrowid),
                        "usuario_id": member_id,
                        "game_id": int(game["id"]),
                        "message": message,
                    }
                )
            self._conn.execute("COMMIT")
        except Exception:
            self._conn.execute("ROLLBACK")
            raise
        event = {
            "event": "jogo.placar_atualizado",
            "game_id": int(game["id"]),
            "ponto_clube": club_points,
            "ponto_adversario": opponent_points,
            "member_ids": member_ids,
            "notifications": notifications,
            "message": message,
        }
        self.notification_events.append(event)
        return {
            "game_id": int(game["id"]),
            "ponto_clube": club_points,
            "ponto_adversario": opponent_points,
            "notifications_sent": len(notifications),
            "member_ids": member_ids,
            "notifications": notifications,
            "event": event,
        }

    def update_game_score(
        self,
        game_id: Any,
        ponto_clube: Any,
        ponto_adversario: Any,
    ) -> dict[str, Any]:
        return self.update_score(game_id, ponto_clube, ponto_adversario)

    def get_game(self, game_id: Any) -> dict[str, Any] | None:
        return self.query_one("SELECT * FROM jogos WHERE id = ?", _to_int(game_id, "jogo"))

    def get_notifications(
        self,
        usuario_id: Any = None,
        jogo_id: Any = None,
    ) -> list[dict[str, Any]]:
        clauses: list[str] = []
        params: list[Any] = []
        if usuario_id is not None:
            clauses.append("usuario_id = ?")
            params.append(_to_int(usuario_id, "usuário"))
        if jogo_id is not None:
            clauses.append("jogo_id = ?")
            params.append(_to_int(jogo_id, "jogo"))
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return self.query_all(
            f"SELECT * FROM notificacoes {where} ORDER BY id",
            params if params else None,
        )

    def get_notification_count(
        self,
        usuario_id: Any = None,
        jogo_id: Any = None,
    ) -> int:
        return len(self.get_notifications(usuario_id, jogo_id))

    def count_notifications_for_game(self, jogo_id: Any) -> int:
        return self.get_notification_count(jogo_id=jogo_id)

    def get_dispatched_notification_events(self) -> list[dict[str, Any]]:
        return list(self.notification_events)
