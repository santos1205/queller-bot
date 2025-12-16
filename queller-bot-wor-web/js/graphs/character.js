// character.js - Grafos de movimentação de personagens especiais
// Transpilado de: Queller/graphs/character.jl (150 linhas Julia)
// Total: 4 grafos (1 principal consolidado + 3 prio), ~38 nós

// ============================================================================
// CONSTANTES DE TEXTO
// ============================================================================

const AGGRESSIVE_ARMY_ADJACENT = `
Um exército *agressivo* com o Rei Bruxo ou liderança máxima está adjacente ao seu *alvo*.
`;

const ATTACK_ACCORDING_STATEMENT = `
Atacar de acordo com a última declaração. Selecionar exército aleatoriamente se vários puderem realizar tal ataque.
`;

const MOBILE_ARMY_WITH_LEADERSHIP = `
Um exército *móvel* com liderança e um movimento/ataque válido em direção ao *alvo* existe.
`;

const NAZGUL_OR_WK_IN_PLAY = `
Um Nazgûl ou o Rei Bruxo está em jogo.
`;

const MOVE_WK_CONDITION = `
O Rei Bruxo não está em um exército *móvel*, mas é capaz de se juntar ou criar um.
`;

const WK_PRIORITY = `
Mover o Rei Bruxo, colocá-lo em uma região válida com um exército.

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
10. Aleatório
`;

const MOVE_NAZGUL_CONDITION = `
Nenhum Nazgûl está na região da Sociedade, mas eles podem se mover para lá.
Ou, um Nazgûl está em um exército não-*móvel*, mas é capaz de se juntar ou criar um.
`;

const NAZGUL_PRIORITY = `
Reunir todos os Nazgûl e colocá-los um de cada vez.

Prioridade:
1. Um, e apenas um, na região da Sociedade
2. Exército com *valor* de liderança menor que o número de unidades do exército e menor que 5
3. Exército que contém o Rei Bruxo
4. Fortaleza da Sombra sob cerco
5. Exército *móvel*
6. Exército adjacente a *ameaça*
7. Exército cujo *alvo* de nação está ativo
8. Exército que se torna *móvel* se Nazgûl for adicionado
9. Exército que não está sitiando
10. Exército que está adjacente ao seu *alvo*
11. Exército da Sombra de maior *valor*
12. Aleatório
`;

const MOVE_MOS_CONDITION = `
Boca de Sauron não está em um exército *móvel*.
`;

const MOS_PRIORITY = `
Mover Boca de Sauron.

Prioridade:
1. Em direção a exército com *valor* de liderança menor que o número de unidades do exército e 5
2. Em direção a exército *móvel*
3. Em direção a exército adjacente ao seu *alvo*
4. Exército que pode ser alcançado com este dado
5. Em direção ao exército mais próximo
6. Aleatório
`;

// ============================================================================
// GRAFO PRINCIPAL: character_army (consolidado, ~38 nós)
// Combina character_army + character_move + character_which_king
// ============================================================================

const characterArmy = {
    name: 'character_army',
    startNode: 'lc_start',
    nodes: [
        { id: 'lc_start', type: 'Start', next: 'lc_1' },
        
        // === Section 1: Initial attack check (from character_army) ===
        { id: 'lc_1', type: 'BinaryCondition', message: AGGRESSIVE_ARMY_ADJACENT, nexts: ['lc_1_yes', 'lc_2'] },
        { id: 'lc_1_yes', type: 'UseActiveDie', next: 'lc_1_action' },
        { id: 'lc_1_action', type: 'PerformAction', message: ATTACK_ACCORDING_STATEMENT, nexts: ['lc_1_end'] },
        { id: 'lc_1_end', type: 'End' },
        
        { id: 'lc_2', type: 'BinaryCondition', message: MOBILE_ARMY_WITH_LEADERSHIP, nexts: ['lc_2_yes', 'lc_3'] },
        { id: 'lc_2_yes', type: 'JumpToGraph', targetGraph: 'movement_attack_basic', returnTo: 'lc_3' },
        
        // === Section 2: Character existence check (from character_move) ===
        { id: 'lc_3', type: 'BinaryCondition', message: NAZGUL_OR_WK_IN_PLAY, nexts: ['lc_wk', 'lc_3_no'] },
        { id: 'lc_3_no', type: 'JumpToGraph', targetGraph: 'event_cards_preferred', returnTo: 'lc_3_return' },
        { id: 'lc_3_return', type: 'ReturnFromGraph' },
        
        // === Section 3: Character priority cascade (from character_which_king) ===
        // Witch King check
        { id: 'lc_wk', type: 'BinaryCondition', message: MOVE_WK_CONDITION, nexts: ['lc_wk_yes', 'lc_naz_1'] },
        { id: 'lc_wk_yes', type: 'UseActiveDie', next: 'lc_wk_action' },
        { id: 'lc_wk_action', type: 'PerformAction', message: WK_PRIORITY, nexts: ['lc_naz_2'] },
        
        // Nazgûl check 1 (before WK was placed)
        { id: 'lc_naz_1', type: 'BinaryCondition', message: MOVE_NAZGUL_CONDITION, nexts: ['lc_naz_1_yes', 'lc_mos_1'] },
        { id: 'lc_naz_1_yes', type: 'UseActiveDie', next: 'lc_naz_1_action' },
        { id: 'lc_naz_1_action', type: 'PerformAction', message: NAZGUL_PRIORITY, nexts: ['lc_mos_2'] },
        
        // Nazgûl check 2 (after WK was placed)
        { id: 'lc_naz_2', type: 'BinaryCondition', message: MOVE_NAZGUL_CONDITION, nexts: ['lc_naz_2_yes', 'lc_mos_3'] },
        { id: 'lc_naz_2_yes', type: 'UseActiveDie', next: 'lc_naz_2_action' },
        { id: 'lc_naz_2_action', type: 'PerformAction', message: NAZGUL_PRIORITY, nexts: ['lc_mos_4'] },
        
        // Mouth of Sauron checks (4 different entry points)
        { id: 'lc_mos_1', type: 'BinaryCondition', message: MOVE_MOS_CONDITION, nexts: ['lc_mos_1_yes', 'lc_play_card'] },
        { id: 'lc_mos_1_yes', type: 'UseActiveDie', next: 'lc_mos_1_action' },
        { id: 'lc_mos_1_action', type: 'PerformAction', message: MOS_PRIORITY, nexts: ['lc_mos_end_1'] },
        { id: 'lc_mos_end_1', type: 'End' },
        
        { id: 'lc_mos_2', type: 'BinaryCondition', message: MOVE_MOS_CONDITION, nexts: ['lc_mos_2_yes', 'lc_mos_end_2'] },
        { id: 'lc_mos_2_yes', type: 'UseActiveDie', next: 'lc_mos_2_action' },
        { id: 'lc_mos_2_action', type: 'PerformAction', message: MOS_PRIORITY, nexts: ['lc_mos_end_2'] },
        { id: 'lc_mos_end_2', type: 'End' },
        
        { id: 'lc_mos_3', type: 'BinaryCondition', message: MOVE_MOS_CONDITION, nexts: ['lc_mos_3_yes', 'lc_mos_end_3'] },
        { id: 'lc_mos_3_yes', type: 'UseActiveDie', next: 'lc_mos_3_action' },
        { id: 'lc_mos_3_action', type: 'PerformAction', message: MOS_PRIORITY, nexts: ['lc_mos_end_3'] },
        { id: 'lc_mos_end_3', type: 'End' },
        
        { id: 'lc_mos_4', type: 'BinaryCondition', message: MOVE_MOS_CONDITION, nexts: ['lc_mos_4_yes', 'lc_mos_end_4'] },
        { id: 'lc_mos_4_yes', type: 'UseActiveDie', next: 'lc_mos_4_action' },
        { id: 'lc_mos_4_action', type: 'PerformAction', message: MOS_PRIORITY, nexts: ['lc_mos_end_4'] },
        { id: 'lc_mos_end_4', type: 'End' },
        
        // Fallback: play event card
        { id: 'lc_play_card', type: 'JumpToGraph', targetGraph: 'event_cards_preferred', returnTo: 'lc_play_card_return' },
        { id: 'lc_play_card_return', type: 'ReturnFromGraph' }
    ]
};


// ============================================================================
// GRAFO AUXILIAR 1: character_wk_prio (3 nós)
// Prioridades para movimentação do Rei Bruxo quando ativado por carta de evento
// ============================================================================

const characterWkPrio = {
    name: 'character_wk_prio',
    startNode: 'lc_wk_prio_start',
    nodes: [
        { id: 'lc_wk_prio_start', type: 'Start', next: 'lc_wk_prio' },
        { id: 'lc_wk_prio', type: 'PerformAction', message: WK_PRIORITY, nexts: ['lc_wk_prio_end'] },
        { id: 'lc_wk_prio_end', type: 'End' }
    ]
};


// ============================================================================
// GRAFO AUXILIAR 2: character_nazgul_prio (3 nós)
// Prioridades para colocação de Nazgûl quando ativado por carta de evento
// ============================================================================

const characterNazgulPrio = {
    name: 'character_nazgul_prio',
    startNode: 'lc_nazgul_prio_start',
    nodes: [
        { id: 'lc_nazgul_prio_start', type: 'Start', next: 'lc_nazgul_prio' },
        { id: 'lc_nazgul_prio', type: 'PerformAction', message: NAZGUL_PRIORITY, nexts: ['lc_nazgul_prio_end'] },
        { id: 'lc_nazgul_prio_end', type: 'End' }
    ]
};


// ============================================================================
// GRAFO AUXILIAR 3: character_mos_prio (3 nós)
// Prioridades para movimentação de Boca de Sauron quando ativado por carta de evento
// ============================================================================

const characterMosPrio = {
    name: 'character_mos_prio',
    startNode: 'lc_mos_prio_start',
    nodes: [
        { id: 'lc_mos_prio_start', type: 'Start', next: 'lc_mos_prio' },
        { id: 'lc_mos_prio', type: 'PerformAction', message: MOS_PRIORITY, nexts: ['lc_mos_prio_end'] },
        { id: 'lc_mos_prio_end', type: 'End' }
    ]
};
