// ============================================================================
// MUSTER GRAPHS - Sistema de Recrutamento/Mobilização (5 grafos)
// Transpilado de: Queller/graphs/muster.jl (299 linhas)
// ============================================================================

// Textos constantes
const MINION_PRIO = `Selecionar um servo que pode ser recrutado.

Prioridade:
1. Saruman
2. Rei Bruxo
3. Boca de Sauron`;

const RECRUIT_SARUMAN = `Recrutar Saruman.`;

const RECRUIT_WK = `Recrutar o Rei Bruxo, colocá-lo em uma região válida com um exército.

Prioridade:
1. Exército é *móvel*
2. *Alvo* do exército está em nação em guerra
3. Exército se torna *móvel* se o Rei Bruxo for adicionado
4. Exército dos Povos Livres no *alvo* ou na rota para o *alvo* não contém Gandalf, o Branco
5. Exército dos Povos Livres no *alvo* ou na rota para o *alvo* não contém um hobbit
6. Exército está adjacente a uma *ameaça*
7. Exército que está conduzindo um cerco
8. Exército está adjacente ao seu *alvo*
9. Exército da Sombra de maior *valor*
10. Aleatório`;

const RECRUIT_MOS = `Recrutar Boca de Sauron, colocá-lo em uma região válida com um exército ou fortaleza.

Prioridade:
1. Exército está conduzindo um cerco.
2. Exército é *móvel*
3. Exército se torna *móvel* se Boca de Sauron for adicionado
4. Exército contém Saruman
5. Exército com o maior *valor*
6. Fortaleza mais próxima de exército cujo *alvo* está em uma nação em guerra
7. Fortaleza mais próxima de exército cujo *alvo* está em uma nação ativa
8. Fortaleza mais próxima de exército cujo *alvo* está em uma nação passiva
9. Aleatório`;

const RESERVE_DIE_ACTION = `Set aside the die (and ring if necessary). Use this die as an last action to recruit a minion. Minion selection and placement can be made from the main menu of Phase 5.`;

const POLITICS_ACTION = `Mover uma nação um passo para baixo na trilha política.

Prioridade:
1. Isengard
2. Sauron
3. Sulistas e Orientais`;

const MUSTER_CARD_ACTION = `Jogar uma carta *jogável* de mobilização.

Prioridade:
1. Ordem crescente de iniciativa
2. Aleatório`;

const MUSTER_EXPOSED = `*Focus* priority:
1. Region which creates an *exposed* region
2. Random

Muster:
*Primary*: Elite
*Secondary*: Regular

If unit is unavailable, rotate as:
Elite -> Regular -> Nazgûl -> Elite`;

const MUSTER_FELLOWSHIP = `*Focus* priority:
1. The Fellowship's current region

Muster:
*Primary*: Regular
*Secondary*: Nazgûl

If unit is unavailable, rotate as:
Elite -> Regular -> Nazgûl -> Elite`;

const MUSTER_ARMY = `*Focus* priority:
1. Army is conducting a siege.
2. Army is *mobile*
3. Army becomes mobile if Mouth of Sauron is added
4. Army contains Saruman
5. Army with the highest *value*
6. Random

Muster:
*Primary*: Regular
*Secondary*: Nazgûl

If unit is unavailable, rotate as:
Elite -> Regular -> Nazgûl -> Elite`;

const MUSTER_NAZGUL = `*Focus* priority:
1. Closest to army whose *target* is in a nation at war
2. Closest to army whose *target* is in an active nation.
3. Closest to a *mobile* army
4. Closest to army whose *target* is in a passive nation.
5. Random

Muster:
*Primary*: Nazgûl
*Secondary*: Nazgûl

If unit is unavailable, rotate as:
Elite -> Regular -> Nazgûl -> Elite`;

const MUSTER_ELITE = `*Focus* priority:
1. Closest to army whose *target* is in a nation at war
2. Closest to army whose *target* is in an active nation.
3. Closest to a *mobile* army
4. Closest to army whose *target* is in a passive nation.
5. Random

Muster:
*Primary*: Elite
*Secondary*: Nazgûl

If unit is unavailable, rotate as:
Elite -> Regular -> Nazgûl -> Elite`;

const CARD_EXPOSED = `*Focus* priority:
1. Region which creates an *exposed* region
2. Random

Muster:
*Primary*: Units according to card
*Secondary*: Units according to card`;

const CARD_FELLOWSHIP = `*Focus* priority:
1. The Fellowship's current region

Muster:
*Primary*: Units according to card
*Secondary*: Units according to card`;

const CARD_ARMY = `*Focus* priority:
1. Army is *mobile*
2. Army's *target* is a nation at war
3. Army becomes mobile if the Witch King is added
4. Free Peoples' army at *target* or on the route to *target* does not contain Gandalf the White
5. Army with the highest *value*
6. Random

Muster:
*Primary*: Units according to card
*Secondary*: Units according to card`;

const CARD_FORTRESS = `*Focus* priority:
1. Closest to army whose *target* is in a nation at war
2. Closest to army whose *target* is in an active nation.
3. Closest to a *mobile* army
4. Closest to army whose *target* is in a passive nation.
5. Random

Muster:
*Primary*: Units according to card
*Secondary*: Units according to card`;


// ============================================================================
// GRAFO 1: MUSTER_MINION - Recrutar Servos (27 nós)
// ============================================================================
const musterMinion = {
    name: "muster_minion",
    nodes: [
        { id: "start", type: "Start", next: "m_2_reserved_check" },
        
        { id: "m_2_reserved_check", type: "BinaryCondition", 
          message: "A die has been reserved for recruiting a minion as a last action.",
          nexts: ["m_2_return", "m_2"] },
        
        { id: "m_2_return", type: "ReturnFromGraph" },
        
        { id: "m_2", type: "BinaryCondition",
          message: "Servo pode ser recrutado.",
          nexts: ["m_2_1", "m_2_return"] },
        
        { id: "m_2_1", type: "BinaryCondition",
          message: "Os Povos Livres têm um dado Vontade do Oeste.\nE, Gandalf, o Branco não foi recrutado.\nE, nenhum servo foi recrutado.",
          nexts: ["m_2_1_yes", "m_2_minion_selection"] },
        
        // Branch: Reserve die for later
        { id: "m_2_1_yes", type: "UseActiveDie", nexts: ["m_2_1_reserve"] },
        { id: "m_2_1_reserve", type: "PerformAction", message: RESERVE_DIE_ACTION, nexts: ["m_2_1_return"] },
        { id: "m_2_1_return", type: "ReturnFromGraph" },
        
        // Branch: Select minion now
        { id: "m_2_minion_selection", type: "MultipleChoice", message: MINION_PRIO,
          options: ["Saruman", "Rei Bruxo", "Boca de Sauron"],
          nexts: ["m_2_saruman_die", "m_2_wk_die", "m_2_mos_die"] },
        
        // Saruman path
        { id: "m_2_saruman_die", type: "UseActiveDie", nexts: ["m_2_saruman_placement"] },
        { id: "m_2_saruman_placement", type: "PerformAction", message: RECRUIT_SARUMAN, nexts: ["m_2_saruman_end"] },
        { id: "m_2_saruman_end", type: "End" },
        
        // Witch King path
        { id: "m_2_wk_die", type: "UseActiveDie", nexts: ["m_2_wk_placement"] },
        { id: "m_2_wk_placement", type: "PerformAction", message: RECRUIT_WK, nexts: ["m_2_wk_end"] },
        { id: "m_2_wk_end", type: "End" },
        
        // Mouth of Sauron path
        { id: "m_2_mos_die", type: "UseActiveDie", nexts: ["m_2_mos_placement"] },
        { id: "m_2_mos_placement", type: "PerformAction", message: RECRUIT_MOS, nexts: ["m_2_mos_end"] },
        { id: "m_2_mos_end", type: "End" }
    ]
};


// ============================================================================
// GRAFO 2: MUSTER_MINION_SELECTION - Seleção Final de Servo Reservado (13 nós)
// ============================================================================
const musterMinionSelection = {
    name: "muster_minion_selection",
    nodes: [
        { id: "start", type: "Start", next: "m_2_minion_selection_last" },
        
        { id: "m_2_minion_selection_last", type: "MultipleChoice", message: MINION_PRIO,
          options: ["Saruman", "Rei Bruxo", "Boca de Sauron"],
          nexts: ["m_2_saruman_last", "m_2_wk_last", "m_2_mos_last"] },
        
        // Saruman path (no die needed)
        { id: "m_2_saruman_last", type: "PerformAction", message: RECRUIT_SARUMAN, nexts: ["m_2_saruman_end_last"] },
        { id: "m_2_saruman_end_last", type: "End" },
        
        // Witch King path (no die needed)
        { id: "m_2_wk_last", type: "PerformAction", message: RECRUIT_WK, nexts: ["m_2_wk_end_last"] },
        { id: "m_2_wk_end_last", type: "End" },
        
        // Mouth of Sauron path (no die needed)
        { id: "m_2_mos_last", type: "PerformAction", message: RECRUIT_MOS, nexts: ["m_2_mos_end_last"] },
        { id: "m_2_mos_end_last", type: "End" }
    ]
};


// ============================================================================
// GRAFO 3: MUSTER_POLITICS - Mobilização Política (7 nós)
// ============================================================================
const musterPolitics = {
    name: "muster_politics",
    nodes: [
        { id: "start", type: "Start", next: "m_3" },
        
        { id: "m_3", type: "BinaryCondition",
          message: "Uma nação da Sombra não está em guerra.",
          nexts: ["m_3_yes", "m_3_return"] },
        
        { id: "m_3_return", type: "ReturnFromGraph" },
        
        { id: "m_3_yes", type: "UseActiveDie", nexts: ["m_3_action"] },
        { id: "m_3_action", type: "PerformAction", message: POLITICS_ACTION, nexts: ["m_3_end"] },
        { id: "m_3_end", type: "End" }
    ]
};


// ============================================================================
// GRAFO 4: MUSTER_MUSTER - Mobilização de Tropas (43 nós)
// ============================================================================
const musterMuster = {
    name: "muster_muster",
    nodes: [
        { id: "start", type: "Start", next: "m_4" },
        
        // m_4: Play muster card
        { id: "m_4", type: "BinaryCondition",
          message: "Uma carta que mobiliza é *jogável*.",
          nexts: ["m_4_die", "m_5"] },
        
        { id: "m_4_die", type: "UseActiveDie", nexts: ["m_4_action"] },
        { id: "m_4_action", type: "PerformAction", message: MUSTER_CARD_ACTION, nexts: ["m_4_end"] },
        { id: "m_4_end", type: "End" },
        
        // m_5: Check if muster is possible
        { id: "m_5", type: "BinaryCondition",
          message: "Mobilização é possível.",
          nexts: ["m_6", "m_return"] },
        
        { id: "m_return", type: "ReturnFromGraph" },
        
        // m_6: Create exposed region
        { id: "m_6", type: "BinaryCondition",
          message: "Mobilização pode criar uma região *exposta*.",
          nexts: ["m_6_die", "m_7"] },
        
        { id: "m_6_die", type: "UseActiveDie", nexts: ["m_6_action"] },
        { id: "m_6_action", type: "PerformAction", message: MUSTER_EXPOSED, nexts: ["m_6_end"] },
        { id: "m_6_end", type: "End" },
        
        // m_7: Near Fellowship
        { id: "m_7", type: "BinaryCondition",
          message: "The Fellowship is adjacent to, or in, a region it is possible to muster in.\nAnd, the progress put the Fellowship outside Mordor.\nAnd, no army is adjacent to the Fellowship's current region.",
          nexts: ["m_7_die", "m_8"] },
        
        { id: "m_7_die", type: "UseActiveDie", nexts: ["m_7_action"] },
        { id: "m_7_action", type: "PerformAction", message: MUSTER_FELLOWSHIP, nexts: ["m_7_end"] },
        { id: "m_7_end", type: "End" },
        
        // m_8: In army region
        { id: "m_8", type: "BinaryCondition",
          message: "Muster is possible in a region containing a Shadow army.",
          nexts: ["m_8_die", "m_9"] },
        
        { id: "m_8_die", type: "UseActiveDie", nexts: ["m_8_action"] },
        { id: "m_8_action", type: "PerformAction", message: MUSTER_ARMY, nexts: ["m_8_end"] },
        { id: "m_8_end", type: "End" },
        
        // m_9: Fork for Nazgûl count
        { id: "m_9", type: "BinaryCondition",
          message: "Less than 6 Nazgûl are in play.",
          nexts: ["m_10_yes", "m_10_no"] },
        
        // m_10_yes: Less than 6 Nazgûl - recruit Nazgûl
        { id: "m_10_yes", type: "UseActiveDie", nexts: ["m_10_yes_action"] },
        { id: "m_10_yes_action", type: "PerformAction", message: MUSTER_NAZGUL, nexts: ["m_10_end_yes"] },
        { id: "m_10_end_yes", type: "End" },
        
        // m_10_no: 6 Nazgûl already - recruit Elite
        { id: "m_10_no", type: "UseActiveDie", nexts: ["m_10_no_action"] },
        { id: "m_10_no_action", type: "PerformAction", message: MUSTER_ELITE, nexts: ["m_10_end_no"] },
        { id: "m_10_end_no", type: "End" }
    ]
};


// ============================================================================
// GRAFO 5: MUSTER_CARD - Mobilização por Carta (17 nós)
// ============================================================================
const musterCard = {
    name: "muster_card",
    nodes: [
        { id: "start", type: "Start", next: "m_c_6" },
        
        // m_c_6: Create exposed region
        { id: "m_c_6", type: "BinaryCondition",
          message: "Muster can create an *exposed* region.",
          nexts: ["m_c_6_action", "m_c_7"] },
        
        { id: "m_c_6_action", type: "PerformAction", message: CARD_EXPOSED, nexts: ["m_c_6_end"] },
        { id: "m_c_6_end", type: "End" },
        
        // m_c_7: Near Fellowship
        { id: "m_c_7", type: "BinaryCondition",
          message: "The Fellowship is adjacent to, or in, a region it is possible to muster in.\nAnd, the progress put the Fellowship outside Mordor.\nAnd, no army is adjacent to the Fellowship's current region.",
          nexts: ["m_c_7_action", "m_c_8"] },
        
        { id: "m_c_7_action", type: "PerformAction", message: CARD_FELLOWSHIP, nexts: ["m_c_7_end"] },
        { id: "m_c_7_end", type: "End" },
        
        // m_c_8: In army region
        { id: "m_c_8", type: "BinaryCondition",
          message: "Muster is possible in a region containing a Shadow army.",
          nexts: ["m_c_8_action", "m_c_9"] },
        
        { id: "m_c_8_action", type: "PerformAction", message: CARD_ARMY, nexts: ["m_c_8_end"] },
        { id: "m_c_8_end", type: "End" },
        
        // m_c_9: Default fortress
        { id: "m_c_9", type: "PerformAction", message: CARD_FORTRESS, nexts: ["m_c_9_end"] },
        { id: "m_c_9_end", type: "End" }
    ]
};


// ============================================================================
// REGISTRAR NO ESCOPO GLOBAL
// ============================================================================
if (typeof window !== 'undefined') {
    window.musterMinion = musterMinion;
    window.musterMinionSelection = musterMinionSelection;
    window.musterPolitics = musterPolitics;
    window.musterMuster = musterMuster;
    window.musterCard = musterCard;
}
