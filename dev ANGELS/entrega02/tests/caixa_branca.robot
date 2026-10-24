*** Settings ***
Documentation     Testes de caixa branca do backend Volleyball Angels.
...               Exercitam diretamente SystemBackend.py, banco SQLite, transações,
...               exceções internas, RBAC, assiduidade, estoque e notificações.
Library           ${CURDIR}/SystemBackend.py
Library           Collections
Suite Setup       Reset Database
Test Setup        Reset Database
Suite Teardown    Close Backend
Test Tags         caixa-branca    backend

*** Variables ***
${SENHA}          Senha@123
${DOCUMENTO}      atestado_medico.pdf

*** Test Cases ***
Caso 01 - Validacao de Criptografia de Senha
    [Documentation]    O cadastro deve chamar o hasher e persistir apenas o hash.
    [Tags]    seguranca    senha
    ${resultado}=    Register Member    Ana Silva    ana.silva@angels.test    ${SENHA}
    ...    telefone=41999990001    sexo=feminino
    Should Be Equal As Strings    ${resultado}[cargo]    membro
    Should Be True    ${resultado}[hash_calls] == 1
    ${senha_no_banco}=    Query Scalar    SELECT senha FROM usuarios WHERE email = ?    ana.silva@angels.test
    Should Not Be Equal    ${senha_no_banco}    ${SENHA}
    ${prefixo}=    Get Password Hash Prefix
    Should Start With    ${senha_no_banco}    ${prefixo}
    ${confere}=    Verify Password    ${SENHA}    ${senha_no_banco}
    Should Be True    ${confere}
    ${protegida}=    Assert Password Is Protected    ana.silva@angels.test    ${SENHA}
    Should Be True    ${protegida}
    ${algoritmo}=    Get Password Algorithm    ana.silva@angels.test
    Should Match Regexp    ${algoritmo}    ^(bcrypt|scrypt|pbkdf2_sha256)$

Caso 02 - Controle de Acesso RBAC na Exclusao de Evento
    [Documentation]    Membro nao pode excluir evento; Admin e Presidente podem.
    [Tags]    rbac    eventos
    ${admin}=    Create User    Admin QA    admin.qa@angels.test    ${SENHA}    cargo=Administrador
    ${membro}=    Create User    Membro QA    membro.qa@angels.test    ${SENHA}    cargo=Membro
    ${presidente}=    Create User    Presidente QA    presidente.qa@angels.test    ${SENHA}    cargo=Presidente
    ${evento}=    Create Event    ${admin}[user_id]    Evento RBAC    2026-11-01 10:00
    ...    Ginasio    duracao=02:00    descricao=Evento de teste
    Run Keyword And Expect Error    PermissionDeniedError: *
    ...    Delete Event    ${membro}[user_id]    ${evento}[event_id]
    ${existe}=    Event Exists    ${evento}[event_id]
    Should Be True    ${existe}
    ${excluido_admin}=    Delete Event    ${admin}[user_id]    ${evento}[event_id]
    Should Be True    ${excluido_admin}[deleted]
    ${evento2}=    Create Event    ${presidente}[user_id]    Evento Presidente    2026-11-02 10:00
    ...    Ginasio
    ${excluido_presidente}=    Delete Event    ${presidente}[user_id]    ${evento2}[event_id]
    Should Be True    ${excluido_presidente}[deleted]

Caso 03 - Calculo de Assiduidade do Jogador
    [Documentation]    Duas presencas em tres treinos deve retornar 66.6%.
    [Tags]    presenca    assiduidade
    ${aluno}=    Register Member    Aluno Presenca    aluno.presenca@angels.test    ${SENHA}
    ${t1}=    Create Training    2026-10-01 18:00    Ginasio    duracao=01:30    tipo=Coletivo
    ${t2}=    Create Training    2026-10-03 18:00    Ginasio    duracao=01:30    tipo=Coletivo
    ${t3}=    Create Training    2026-10-05 18:00    Ginasio    duracao=01:30    tipo=Coletivo
    Record Attendance    ${t1}[treino_id]    ${aluno}[user_id]    presente
    Record Attendance    ${t2}[treino_id]    ${aluno}[user_id]    presente
    Record Attendance    ${t3}[treino_id]    ${aluno}[user_id]    falta
    ${percentual}=    Calculate Attendance Percentage    ${aluno}[user_id]
    Should Be Equal As Numbers    ${percentual}    66.6
    ${relatorio}=    Attendance Report    ${aluno}[user_id]
    Should Be Equal As Integers    ${relatorio}[total]    3
    Should Be Equal As Integers    ${relatorio}[present]    2
    Should Be Equal As Integers    ${relatorio}[absent]    1
    Should Be Equal As Numbers    ${relatorio}[percentage]    66.6

Caso 04 - Decremento Transacional de Estoque
    [Documentation]    Estoque 5 menos pedido de 2 deve resultar em 3 no banco.
    [Tags]    estoque    pedido
    ${membro}=    Register Member    Comprador QA    comprador.qa@angels.test    ${SENHA}
    ${produto}=    Create Product    Camisa Oficial    89.90    5
    ...    descricao=Camisa do clube    categoria=Vestuario
    ${item}=    Create Dictionary    produto_id=${produto}[product_id]    quantidade=2
    ${itens}=    Create List    ${item}
    ${pedido}=    Process Order    ${membro}[user_id]    ${itens}
    Should Be Equal As Integers    ${pedido}[total_cents]    17980
    ${estoque_no_banco}=    Query Scalar    SELECT estoque FROM produtos WHERE id = ?
    ...    ${produto}[product_id]
    Should Be Equal As Integers    ${estoque_no_banco}    3
    ${itens_no_banco}=    Query Scalar    SELECT COUNT(*) FROM pedido_itens WHERE pedido_id = ?
    ...    ${pedido}[order_id]
    Should Be Equal As Integers    ${itens_no_banco}    1

Caso 05 - Bloqueio de Venda sem Estoque
    [Documentation]    Produto com estoque zero deve lancar OutOfStockError e rollback.
    [Tags]    estoque    excecao
    ${membro}=    Register Member    Comprador Falha    comprador.falha@angels.test    ${SENHA}
    ${produto}=    Create Product    Produto Esgotado    15.00    0
    ${item}=    Create Dictionary    produto_id=${produto}[product_id]    quantidade=1
    ${itens}=    Create List    ${item}
    Run Keyword And Expect Error    OutOfStockError: *
    ...    Process Order    ${membro}[user_id]    ${itens}
    ${estoque}=    Query Scalar    SELECT estoque FROM produtos WHERE id = ?    ${produto}[product_id]
    Should Be Equal As Integers    ${estoque}    0
    ${pedidos}=    Query Scalar    SELECT COUNT(*) FROM pedidos
    Should Be Equal As Integers    ${pedidos}    0
    ${itens_pedido}=    Query Scalar    SELECT COUNT(*) FROM pedido_itens
    Should Be Equal As Integers    ${itens_pedido}    0

Caso 06 - Calculo Matematico do Carrinho
    [Documentation]    Valida multiplicacao e soma antes de fechar o pedido.
    [Tags]    carrinho    checkout
    ${membro}=    Register Member    Comprador Carrinho    carrinho.qa@angels.test    ${SENHA}
    ${p1}=    Create Product    Produto A    10.50    10
    ${p2}=    Create Product    Produto B    35.00    10
    ${p3}=    Create Product    Produto C    7.25    10
    ${i1}=    Create Dictionary    produto_id=${p1}[product_id]    quantidade=2
    ${i2}=    Create Dictionary    produto_id=${p2}[product_id]    quantidade=1
    ${i3}=    Create Dictionary    produto_id=${p3}[product_id]    quantidade=3
    ${itens}=    Create List    ${i1}    ${i2}    ${i3}
    ${preview}=    Calculate Cart Total    ${itens}
    Should Be Equal As Integers    ${preview}[subtotals_cents][0]    2100
    Should Be Equal As Integers    ${preview}[subtotals_cents][1]    3500
    Should Be Equal As Integers    ${preview}[subtotals_cents][2]    2175
    Should Be Equal As Integers    ${preview}[total_cents]    7775
    Should Be Equal As Strings    ${preview}[total]    77.75
    ${pedidos_antes}=    Query Scalar    SELECT COUNT(*) FROM pedidos
    Should Be Equal As Integers    ${pedidos_antes}    0
    ${pedido}=    Process Order    ${membro}[user_id]    ${itens}
    Should Be Equal As Integers    ${pedido}[total_cents]    7775
    Should Be Equal As Strings    ${pedido}[total]    77.75
    ${total_no_banco}=    Query Scalar    SELECT valor_total_centavos FROM pedidos WHERE id = ?
    ...    ${pedido}[order_id]
    Should Be Equal As Integers    ${total_no_banco}    7775
    ${itens_no_banco}=    Query Scalar    SELECT COUNT(*) FROM pedido_itens WHERE pedido_id = ?
    ...    ${pedido}[order_id]
    Should Be Equal As Integers    ${itens_no_banco}    3

Caso 07 - Justificativa de Falta Exige Documento
    [Documentation]    Sem payload de atestado a presenca nao pode ser atualizada.
    [Tags]    presenca    justificativa
    ${aluno}=    Register Member    Aluno Falta    aluno.falta@angels.test    ${SENHA}
    ${treino}=    Create Training    2026-10-10 18:00    Ginasio
    ${presenca}=    Record Attendance    ${treino}[treino_id]    ${aluno}[user_id]    falta
    Should Be Equal As Strings    ${presenca}[status]    falta
    Run Keyword And Expect Error    AbsenceJustificationError: *
    ...    Justify Absence    ${presenca}[attendance_id]    Atestado medico
    ${status_apos_erro}=    Get Attendance Status    ${presenca}[attendance_id]
    Should Be Equal As Strings    ${status_apos_erro}    falta
    ${status_no_banco}=    Query Scalar    SELECT status FROM presencas WHERE id = ?
    ...    ${presenca}[attendance_id]
    Should Be Equal As Strings    ${status_no_banco}    falta
    ${justificada}=    Justify Absence    ${presenca}[attendance_id]    Atestado medico
    ...    documento=${DOCUMENTO}
    Should Be Equal As Strings    ${justificada}[status]    falta_justificada
    ${status_final}=    Get Attendance Status    ${presenca}[attendance_id]
    Should Be Equal As Strings    ${status_final}    falta_justificada
    ${documento_no_banco}=    Query Scalar    SELECT documento_nome FROM presencas WHERE id = ?
    ...    ${presenca}[attendance_id]
    Should Be Equal As Strings    ${documento_no_banco}    ${DOCUMENTO}

Caso 08 - Tempo de Cadastro Abaixo de 400ms
    [Documentation]    Mede o tempo interno do cadastro incluindo hash e I/O SQLite.
    [Tags]    performance    cadastro
    ${inicio}=    Evaluate    __import__('time').perf_counter()
    ${resultado}=    Register Member    Usuario Performance    performance.qa@angels.test    ${SENHA}
    ${fim}=    Evaluate    __import__('time').perf_counter()
    ${tempo_externo_ms}=    Evaluate    (${fim} - ${inicio}) * 1000
    Should Be True    ${resultado}[elapsed_ms] < 400
    ...    msg=Tempo interno do cadastro excedeu 400ms: ${resultado}[elapsed_ms]
    Should Be True    ${tempo_externo_ms} < 400
    ...    msg=Tempo externo do cadastro excedeu 400ms: ${tempo_externo_ms}
    Log    Tempo interno=${resultado}[elapsed_ms]ms | externo=${tempo_externo_ms}ms    console=yes

Caso 09 - Hierarquia de Cargos no Rebaixamento
    [Documentation]    Somente Presidente rebaixa Coordenador para Membro.
    [Tags]    rbac    cargos
    ${presidente}=    Create User    Presidente Cargo    presidente.cargo@angels.test    ${SENHA}
    ...    cargo=Presidente
    ${admin}=    Create User    Admin Cargo    admin.cargo@angels.test    ${SENHA}    cargo=Administrador
    ${vice}=    Create User    Vice Cargo    vice.cargo@angels.test    ${SENHA}    cargo=Vice-Presidente
    ${coordenador}=    Create User    Coordenador Cargo    coordenador.cargo@angels.test    ${SENHA}
    ...    cargo=Coordenador
    Run Keyword And Expect Error    PermissionDeniedError: *
    ...    Demote Member    ${admin}[user_id]    ${coordenador}[user_id]
    Run Keyword And Expect Error    PermissionDeniedError: *
    ...    Demote Member    ${vice}[user_id]    ${coordenador}[user_id]
    ${cargo_intacto}=    Get User Role    ${coordenador}[user_id]
    Should Be Equal As Strings    ${cargo_intacto}    coordenador
    ${resultado}=    Demote Member    ${presidente}[user_id]    ${coordenador}[user_id]
    Should Be Equal As Strings    ${resultado}[old_role]    coordenador
    Should Be Equal As Strings    ${resultado}[new_role]    membro
    ${cargo_final}=    Get User Role    ${coordenador}[user_id]
    Should Be Equal As Strings    ${cargo_final}    membro

Caso 10 - Atualizacao de Placar Dispara Notificacao
    [Documentation]    Membros vinculados ao jogo devem receber a notificacao interna.
    [Tags]    jogo    notificacao
    ${m1}=    Register Member    Jogador Um    jogador.um@angels.test    ${SENHA}
    ${m2}=    Register Member    Jogador Dois    jogador.dois@angels.test    ${SENHA}
    ${m3}=    Register Member    Jogador Tres    jogador.tres@angels.test    ${SENHA}
    ${jogo}=    Create Game    Equipe Rivais    2026-10-23 19:00
    ...    data_hora_fim=2026-10-23 21:00    local=Ginasio    tipo_jogo=Amistoso
    Link Member To Game    ${jogo}[game_id]    ${m1}[user_id]
    Link Member To Game    ${jogo}[game_id]    ${m2}[user_id]
    ${resultado}=    Update Game Score    ${jogo}[game_id]    25    20
    Should Be Equal As Integers    ${resultado}[ponto_clube]    25
    Should Be Equal As Integers    ${resultado}[ponto_adversario]    20
    Should Be Equal As Integers    ${resultado}[notifications_sent]    2
    ${eventos}=    Get Dispatched Notification Events
    ${quantidade_eventos}=    Get Length    ${eventos}
    Should Be Equal As Integers    ${quantidade_eventos}    1
    ${primeiro_evento}=    Get From List    ${eventos}    0
    Should Be Equal As Strings    ${primeiro_evento}[event]    jogo.placar_atualizado
    Should Contain    ${primeiro_evento}[member_ids]    ${m1}[user_id]
    Should Contain    ${primeiro_evento}[member_ids]    ${m2}[user_id]
    ${notificacoes_m1}=    Get Notification Count    ${m1}[user_id]
    ${notificacoes_m2}=    Get Notification Count    ${m2}[user_id]
    ${notificacoes_m3}=    Get Notification Count    ${m3}[user_id]
    Should Be Equal As Integers    ${notificacoes_m1}    1
    Should Be Equal As Integers    ${notificacoes_m2}    1
    Should Be Equal As Integers    ${notificacoes_m3}    0
    ${notificacoes_no_banco}=    Query Scalar    SELECT COUNT(*) FROM notificacoes WHERE jogo_id = ?
    ...    ${jogo}[game_id]
    Should Be Equal As Integers    ${notificacoes_no_banco}    2
    ${placar_no_banco}=    Query One    SELECT ponto_clube, ponto_adversario FROM jogos WHERE id = ?
    ...    ${jogo}[game_id]
    Should Be Equal As Integers    ${placar_no_banco}[ponto_clube]    25
    Should Be Equal As Integers    ${placar_no_banco}[ponto_adversario]    20
