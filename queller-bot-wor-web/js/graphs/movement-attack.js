// movement-attack.js - Grafos de movimento e ataque (4 grafos, 48 nós)
// Transpirado de: Queller/graphs/movement-attack.jl

// ============================================================================
// CONSTANTES DE TEXTO
// ============================================================================

const GENERIC_MOVE = `Mover de acordo com a última declaração. Selecionar exército aleatoriamente se vários puderem realizar tal movimento.`;

const SETTLEMENT_COND = `Um exército pode se mover para um assentamento vazio de uma nação em guerra.`;

const SETTLEMENT_COND_2 = `Um exército pode se mover para um assentamento vazio de uma nação em guerra, sem aumentar a distância para seu *alvo* (o *alvo* pode mudar).`;

const SETTLEMENT_MOVE_UNIT = `Mover 1 unidade para um assentamento vazio de nação em guerra.

Prioridade de exército: Aleatório

Prioridade de unidade:
1. Regular
2. Elite
3. Aleatório`;

const MERGE_COND = `Dois exércitos, onde pelo menos um não é *móvel*, podem se fundir.
E, fundir os exércitos aumentaria o número de exércitos *móveis*.
Ou, o exército fundido teria maior *valor* do que qualquer um dos dois atualmente tem.`;

const MERGE_MOVE = `Fundir dois exércitos.

Prioridade:
1. Fusão diminui maior distância para *alvo* (*alvo* pode mudar)
2. Maior *valor* do exército resultante
3. Move o exército mais distante de seu *alvo*
4. Menor número de unidades deixadas para trás após movimento
5. Região onde exércitos se fundem contém uma fortaleza
6. Aleatório`;

const MOVE_TARGET_COND = `Um exército *móvel* pode se mover ou atacar em direção ao seu *alvo*.`;

const MOVE_TARGET = `Selecionar um exército *móvel* e mover ou atacar em direção ao *alvo*.

Prioridade:
1. Exército está adjacente ao seu *alvo*
2. *Alvo* do exército está em uma nação em guerra
3. Movimento/ataque não ativa uma nação
4. Movimento/ataque não muda uma nação para "em guerra"
5. Exército cujo *alvo* está mais alto na lista de prioridades na definição de *alvo*
6. Exército com maior *valor*
7. Movimento/ataque não bloqueia a rota mais curta de outro exército *móvel* para seu *alvo*
8. Região de destino contém a Sociedade
9. Aleatório`;

const BASIC_MOVE_COND = `Um exército da Sombra está no tabuleiro.`;

const BASIC_MOVE = `Mover um exército.

Prioridade:
1. Movimento não muda uma nação para "em guerra"
2. Fundir dois exércitos para criar o maior *valor* de exército possível
3. *Alvo* do exército é adjacente a um exército da Sombra passivo
4. Movimento termina adjacente a outro exército da Sombra
5. Diminui distância para *alvo* (*alvo* pode mudar)
6. Exército com maior *valor*
7. Aleatório`;

const ONE_MOVE_LEFT = `O Dado de Exército tem um movimento restante.`;

const ATTACK_ADJACENT_PRIO = `Atacar com exército adjacente ao *alvo* não sob cerco.

Prioridade:
1. Exército cujo *alvo* está em uma nação em guerra
2. Exército cujo ataque não colocaria uma nação em guerra.
3. Exército cujo *alvo* está em uma nação ativa
4. Exército de maior *valor*
5. Aleatório`;

const MV2_COND = `Há Olhos na reserva de caçada.
E, nenhum exército está na região da Sociedade
E, a Sociedade não alcança Mordor com o progresso atual.
E, um exército pode se mover para a região da Sociedade sem aumentar a distância para seu *alvo* (o *alvo* pode mudar).`;

const MV6_RETURN_COND = `Um Dado de Exército foi usado com um movimento restante.`;

// ============================================================================
// GRAFO 1: movement_attack_besiege (6 nós)
// Ataque a alvo adjacente não sob cerco
// ============================================================================

const movementAttackBesiege = {
  name: "movement_attack_besiege",
  startNode: "movement_attack_besiege",
  nodes: [
    { id: "movement_attack_besiege", type: "Start", next: "mv_1" },
    { id: "mv_1", type: "BinaryCondition", message: "Um exército *móvel* está adjacente ao *alvo* não sob cerco.", nexts: ["mv_1_yes", "mv_1_return"] },
    { id: "mv_1_return", type: "ReturnFromGraph" },
    { id: "mv_1_yes", type: "UseActiveDie", nexts: ["mv_1_action"] },
    { id: "mv_1_action", type: "PerformAction", message: ATTACK_ADJACENT_PRIO, nexts: ["mv_1_end"] },
    { id: "mv_1_end", type: "End" }
  ]
};

// ============================================================================
// GRAFO 2: movement_attack_corr (28 nós)
// Movimento de corrupção (perseguir Fellowship com Olhos)
// ============================================================================

const movementAttackCorr = {
  name: "movement_attack_corr",
  startNode: "movement_attack_corr",
  nodes: [
    { id: "movement_attack_corr", type: "Start", next: "mv_2" },
    { id: "mv_2", type: "BinaryCondition", message: MV2_COND, nexts: ["mv_2_yes", "mv_3"] },
    { id: "mv_2_yes", type: "UseActiveDie", nexts: ["mv_2_action"] },
    { id: "mv_2_action", type: "PerformAction", message: GENERIC_MOVE, nexts: ["mv_2_army_die_to_move"] },
    { id: "mv_2_army_die_to_move", type: "CheckActiveDie", dieType: "A", nextTrue: "mv_2_movement_remains", nextFalse: "mv_2_end" },
    { id: "mv_2_movement_remains", type: "BinaryCondition", message: ONE_MOVE_LEFT, nexts: ["mv_2", "mv_2_end"] },
    { id: "mv_2_end", type: "End" },
    
    { id: "mv_3", type: "BinaryCondition", message: SETTLEMENT_COND, nexts: ["mv_3_1", "mv_4"] },
    { id: "mv_3_1", type: "BinaryCondition", message: SETTLEMENT_COND_2, nexts: ["mv_3_yes", "mv_3_no"] },
    { id: "mv_3_yes", type: "UseActiveDie", nexts: ["mv_3_yes_action"] },
    { id: "mv_3_yes_action", type: "PerformAction", message: GENERIC_MOVE, nexts: ["mv_3_movement_remains"] },
    { id: "mv_3_no", type: "UseActiveDie", nexts: ["mv_3_no_action"] },
    { id: "mv_3_no_action", type: "PerformAction", message: SETTLEMENT_MOVE_UNIT, nexts: ["mv_3_army_die_to_move"] },
    { id: "mv_3_army_die_to_move", type: "CheckActiveDie", dieType: "A", nextTrue: "mv_3_movement_remains", nextFalse: "mv_3_end" },
    { id: "mv_3_movement_remains", type: "BinaryCondition", message: ONE_MOVE_LEFT, nexts: ["mv_3", "mv_3_end"] },
    { id: "mv_3_end", type: "End" },
    
    { id: "mv_4", type: "BinaryCondition", message: MERGE_COND, nexts: ["mv_4_yes", "mv_4_return"] },
    { id: "mv_4_return", type: "ReturnFromGraph" },
    { id: "mv_4_yes", type: "UseActiveDie", nexts: ["mv_4_action"] },
    { id: "mv_4_action", type: "PerformAction", message: MERGE_MOVE, nexts: ["mv_4_army_die_to_move"] },
    { id: "mv_4_army_die_to_move", type: "CheckActiveDie", dieType: "A", nextTrue: "mv_4_movement_remains", nextFalse: "mv_4_end" },
    { id: "mv_4_movement_remains", type: "BinaryCondition", message: ONE_MOVE_LEFT, nexts: ["mv_4", "mv_4_end"] },
    { id: "mv_4_end", type: "End" }
  ]
};

// ============================================================================
// GRAFO 3: movement_attack_basic (17 nós)
// Movimento básico com várias condições
// ============================================================================

const movementAttackBasic = {
  name: "movement_attack_basic",
  startNode: "movement_attack_basic",
  nodes: [
    { id: "movement_attack_basic", type: "Start", next: "mv_5" },
    { id: "mv_5", type: "BinaryCondition", message: MOVE_TARGET_COND, nexts: ["mv_5_yes", "mv_6"] },
    { id: "mv_5_yes", type: "UseActiveDie", nexts: ["mv_5_action"] },
    { id: "mv_5_action", type: "PerformAction", message: MOVE_TARGET, nexts: ["mv_5_army_die_to_move"] },
    { id: "mv_5_army_die_to_move", type: "CheckActiveDie", dieType: "A", nextTrue: "mv_5_movement_remains", nextFalse: "mv_5_end" },
    { id: "mv_5_movement_remains", type: "BinaryCondition", message: ONE_MOVE_LEFT, nexts: ["mv_5", "mv_5_end"] },
    { id: "mv_5_end", type: "End" },
    
    { id: "mv_6", type: "BinaryCondition", message: BASIC_MOVE_COND, nexts: ["mv_6_yes", "mv_6_return_okay"] },
    { id: "mv_6_return_okay", type: "BinaryCondition", message: MV6_RETURN_COND, nexts: ["mv_6_return_end", "mv_6_return"] },
    { id: "mv_6_return_end", type: "End" },
    { id: "mv_6_return", type: "ReturnFromGraph" },
    { id: "mv_6_yes", type: "UseActiveDie", nexts: ["mv_6_action"] },
    { id: "mv_6_action", type: "PerformAction", message: BASIC_MOVE, nexts: ["mv_6_army_die_to_move"] },
    { id: "mv_6_army_die_to_move", type: "CheckActiveDie", dieType: "A", nextTrue: "mv_6_movement_remains", nextFalse: "mv_6_end" },
    { id: "mv_6_movement_remains", type: "BinaryCondition", message: ONE_MOVE_LEFT, nexts: ["mv_6", "mv_6_end"] },
    { id: "mv_6_end", type: "End" }
  ]
};

// ============================================================================
// GRAFO 4: movement_attack_card (14 nós)
// Movimento ativado por carta de evento (sem loops/checks de dado)
// ============================================================================

const movementAttackCard = {
  name: "movement_attack_card",
  startNode: "movement_attack_card",
  nodes: [
    { id: "movement_attack_card", type: "Start", next: "mv_c_1" },
    { id: "mv_c_1", type: "BinaryCondition", message: SETTLEMENT_COND, nexts: ["mv_c_1_1", "mv_c_2"] },
    { id: "mv_c_1_1", type: "BinaryCondition", message: SETTLEMENT_COND_2, nexts: ["mv_c_1_army", "mv_c_1_unit"] },
    { id: "mv_c_1_army", type: "PerformAction", message: GENERIC_MOVE, nexts: ["mv_c_1_army_end"] },
    { id: "mv_c_1_army_end", type: "End" },
    { id: "mv_c_1_unit", type: "PerformAction", message: SETTLEMENT_MOVE_UNIT, nexts: ["mv_c_1_unit_end"] },
    { id: "mv_c_1_unit_end", type: "End" },
    { id: "mv_c_2", type: "BinaryCondition", message: MERGE_COND, nexts: ["mv_c_2_move", "mv_c_3"] },
    { id: "mv_c_2_move", type: "PerformAction", message: MERGE_MOVE, nexts: ["mv_c_2_end"] },
    { id: "mv_c_2_end", type: "End" },
    { id: "mv_c_3", type: "BinaryCondition", message: MOVE_TARGET_COND, nexts: ["mv_c_3_move", "mv_c_4_move"] },
    { id: "mv_c_3_move", type: "PerformAction", message: MOVE_TARGET, nexts: ["mv_c_3_end"] },
    { id: "mv_c_3_end", type: "End" },
    { id: "mv_c_4_move", type: "PerformAction", message: BASIC_MOVE, nexts: ["mv_c_4_end"] },
    { id: "mv_c_4_end", type: "End" }
  ]
};

// ============================================================================
// EXPORTAR GRAFOS
// ============================================================================

if (typeof window !== 'undefined') {
  window.movementAttackBesiege = movementAttackBesiege;
  window.movementAttackCorr = movementAttackCorr;
  window.movementAttackBasic = movementAttackBasic;
  window.movementAttackCard = movementAttackCard;
}
