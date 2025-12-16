/**
 * SELECT ACTION CORRUPTION GRAPH
 * 
 * Orquestrador de ações para estratégia de Corrupção.
 * Prioriza ações baseadas em:
 * 1. Cartas de evento (P/C) se Sociedade exposta/Mordor
 * 2. Movimento de Nazgûl (C)
 * 3. Witch King unir exército (C)
 * 4. Recrutar: Minion (M com anel) > Politics (M)
 * 5. Ataques decisivos (C/A com anel se vitória/Mordor)
 * 6. Ataques em guerra (C/A sem anel)
 * 7. Passar
 * 8. Cartas de evento preferidas (C/P)
 * 9. Ataques/cerco (C/A)
 * 10. Cartas gerais (P)
 * 11. Movimento/ataque corrupção (A)
 * 12. Personagem em exército (C)
 * 13. Recrutar completo (M: minion+politics+muster)
 * 14-19. Repetir com uso de anel permitido
 * 
 * Transpilado de: Queller/graphs/select-action-corr.jl
 * Total: 78 nós, 19 prioridades (a1-a23)
 * Estrutura: 2 fases (sem anel a1-a13, com anel a14-a22)
 */

function createSelectActionCorrGraph() {
    const nodes = {};

    // ========================================
    // INÍCIO E VERIFICAÇÃO DE AMEAÇA
    // ========================================
    
    nodes['select_action_corr'] = {
        id: 'select_action_corr',
        type: 'Start',
        next: 'threat_check'
    };

    nodes['threat_check'] = {
        id: 'threat_check',
        type: 'JumpToGraph',
        graphName: 'threat_exposed',
        returnTo: 'a1'
    };

    // ========================================
    // PRIORIDADE A1: Cartas (C+P) se Sociedade Exposta/Mordor
    // ========================================
    
    nodes['a1'] = {
        id: 'a1',
        type: 'Dummy',
        next: 'a1_1'
    };

    nodes['a1_1'] = {
        id: 'a1_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a1_2', 'a2']
    };

    nodes['a1_2'] = {
        id: 'a1_2',
        type: 'SetActiveDie',
        dieType: 'P',
        mayUseRing: true,
        nexts: ['a1_cond', 'a2']
    };

    nodes['a1_cond'] = {
        id: 'a1_cond',
        type: 'BinaryCondition',
        message: 'The Fellowship is on the Mordor track or is revealed.\nAnd, a character card is held.',
        nexts: ['a1_jump', 'a2']
    };

    nodes['a1_jump'] = {
        id: 'a1_jump',
        type: 'JumpToGraph',
        graphName: 'event_cards_corruption',
        returnTo: 'a2'
    };

    // ========================================
    // PRIORIDADE A2: Movimento de Nazgûl (C)
    // ========================================
    
    nodes['a2'] = {
        id: 'a2',
        type: 'Dummy',
        next: 'a2_1'
    };

    nodes['a2_1'] = {
        id: 'a2_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a2_cond', 'a3']
    };

    nodes['a2_cond'] = {
        id: 'a2_cond',
        type: 'BinaryCondition',
        message: 'The Fellowship is in a region with no Nazgûl and which Nazgûl can move to.',
        nexts: ['a2_jump', 'a3']
    };

    nodes['a2_jump'] = {
        id: 'a2_jump',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a3'
    };

    // ========================================
    // PRIORIDADE A3: Witch King Unir Exército (C)
    // ========================================
    
    nodes['a3'] = {
        id: 'a3',
        type: 'Dummy',
        next: 'a3_1'
    };

    nodes['a3_1'] = {
        id: 'a3_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a3_cond', 'a4']
    };

    nodes['a3_cond'] = {
        id: 'a3_cond',
        type: 'BinaryCondition',
        message: 'The Which King is in play and not in a *mobile* army but is able to create or join one.',
        nexts: ['a3_jump', 'a4']
    };

    nodes['a3_jump'] = {
        id: 'a3_jump',
        type: 'JumpToGraph',
        graphName: 'character_which_king',
        returnTo: 'a4'
    };

    // ========================================
    // PRIORIDADE A4: Recrutar Minion (M com anel)
    // ========================================
    
    nodes['a4'] = {
        id: 'a4',
        type: 'Dummy',
        next: 'a4_1'
    };

    nodes['a4_1'] = {
        id: 'a4_1',
        type: 'SetActiveDie',
        dieType: 'M',
        mayUseRing: true,
        nexts: ['a4_jump', 'a5']
    };

    nodes['a4_jump'] = {
        id: 'a4_jump',
        type: 'JumpToGraph',
        graphName: 'muster_minion',
        returnTo: 'a5'
    };

    // ========================================
    // PRIORIDADE A5: Recrutar Politics (M)
    // ========================================
    
    nodes['a5'] = {
        id: 'a5',
        type: 'Dummy',
        next: 'a5_1'
    };

    nodes['a5_1'] = {
        id: 'a5_1',
        type: 'SetActiveDie',
        dieType: 'M',
        mayUseRing: false,
        nexts: ['a5_jump', 'a6']
    };

    nodes['a5_jump'] = {
        id: 'a5_jump',
        type: 'JumpToGraph',
        graphName: 'muster_politics',
        returnTo: 'a6'
    };

    // ========================================
    // PRIORIDADE A6: Ataques Decisivos (COM ANEL)
    // Se vitória garantida ou Sociedade em Mordor
    // ========================================
    
    nodes['a6'] = {
        id: 'a6',
        type: 'Dummy',
        next: 'a6_1_ring'
    };

    // Branch COM ANEL
    nodes['a6_1_ring'] = {
        id: 'a6_1_ring',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a6_cond_ring', 'a6_2_ring']
    };

    nodes['a6_2_ring'] = {
        id: 'a6_2_ring',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a6_cond_ring', 'a7']
    };

    nodes['a6_cond_ring'] = {
        id: 'a6_cond_ring',
        type: 'BinaryCondition',
        message: 'A *mobile* army is adjacent to its *target*.\nAnd, the *target* gives enough points to win or the Fellowship is on the Mordor track.',
        nexts: ['a6_jump_1_die_ring', 'a6_1_no_ring']
    };

    nodes['a6_jump_1_die_ring'] = {
        id: 'a6_jump_1_die_ring',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a6_jump_1_ring', 'a6_jump_2_die_ring']
    };

    nodes['a6_jump_1_ring'] = {
        id: 'a6_jump_1_ring',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a6_jump_2_die_ring'
    };

    nodes['a6_jump_2_die_ring'] = {
        id: 'a6_jump_2_die_ring',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a6_jump_2_ring', 'a7']
    };

    nodes['a6_jump_2_ring'] = {
        id: 'a6_jump_2_ring',
        type: 'JumpToGraph',
        graphName: 'movement_attack_basic',
        returnTo: 'a7'
    };

    // Branch SEM ANEL
    nodes['a6_1_no_ring'] = {
        id: 'a6_1_no_ring',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a6_cond_no_ring', 'a6_2_no_ring']
    };

    nodes['a6_2_no_ring'] = {
        id: 'a6_2_no_ring',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: false,
        nexts: ['a6_cond_no_ring', 'a7']
    };

    nodes['a6_cond_no_ring'] = {
        id: 'a6_cond_no_ring',
        type: 'BinaryCondition',
        message: 'A *mobile* army is adjacent to its *target*.\nAnd, the *target* is in a nation at war and not under siege.',
        nexts: ['a6_jump_1_die_no_ring', 'a7']
    };

    nodes['a6_jump_1_die_no_ring'] = {
        id: 'a6_jump_1_die_no_ring',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a6_jump_1_no_ring', 'a6_jump_2_die_no_ring']
    };

    nodes['a6_jump_1_no_ring'] = {
        id: 'a6_jump_1_no_ring',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a6_jump_2_die_no_ring'
    };

    nodes['a6_jump_2_die_no_ring'] = {
        id: 'a6_jump_2_die_no_ring',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: false,
        nexts: ['a6_jump_2_no_ring', 'a7']
    };

    nodes['a6_jump_2_no_ring'] = {
        id: 'a6_jump_2_no_ring',
        type: 'JumpToGraph',
        graphName: 'movement_attack_basic',
        returnTo: 'a7'
    };

    // ========================================
    // PRIORIDADE A7: PASSAR
    // ========================================
    
    nodes['a7'] = {
        id: 'a7',
        type: 'Dummy',
        next: 'a7_1'
    };

    nodes['a7_1'] = {
        id: 'a7_1',
        type: 'BinaryCondition',
        message: 'O jogador das Sombras tem permissão para passar.',
        nexts: ['a7_action', 'a8']
    };

    nodes['a7_action'] = {
        id: 'a7_action',
        type: 'PerformAction',
        message: 'Passar',
        nexts: ['a7_end']
    };

    nodes['a7_end'] = {
        id: 'a7_end',
        type: 'End',
        nexts: []
    };

    // ========================================
    // PRIORIDADE A8: Cartas Preferidas (C, P)
    // ========================================
    
    nodes['a8'] = {
        id: 'a8',
        type: 'Dummy',
        next: 'a8_1'
    };

    nodes['a8_1'] = {
        id: 'a8_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a8_jump_1', 'a8_2']
    };

    nodes['a8_jump_1'] = {
        id: 'a8_jump_1',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a8_2'
    };

    nodes['a8_2'] = {
        id: 'a8_2',
        type: 'SetActiveDie',
        dieType: 'P',
        mayUseRing: false,
        nexts: ['a8_jump_2', 'a9']
    };

    nodes['a8_jump_2'] = {
        id: 'a8_jump_2',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a9'
    };

    // ========================================
    // PRIORIDADE A9: Ataques/Cerco (C, A)
    // ========================================
    
    nodes['a9'] = {
        id: 'a9',
        type: 'Dummy',
        next: 'a9_1'
    };

    nodes['a9_1'] = {
        id: 'a9_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a9_cond', 'a9_2']
    };

    nodes['a9_2'] = {
        id: 'a9_2',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: false,
        nexts: ['a9_cond', 'a10']
    };

    nodes['a9_cond'] = {
        id: 'a9_cond',
        type: 'BinaryCondition',
        message: 'A *mobile* army is adjacent to its *target* that is not under siege.',
        nexts: ['a9_jump_1_die', 'a10']
    };

    nodes['a9_jump_1_die'] = {
        id: 'a9_jump_1_die',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a9_jump_1', 'a9_jump_2_die']
    };

    nodes['a9_jump_1'] = {
        id: 'a9_jump_1',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a9_jump_2_die'
    };

    nodes['a9_jump_2_die'] = {
        id: 'a9_jump_2_die',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: false,
        nexts: ['a9_jump_2', 'a10']
    };

    nodes['a9_jump_2'] = {
        id: 'a9_jump_2',
        type: 'JumpToGraph',
        graphName: 'movement_attack_besiege',
        returnTo: 'a9_jump_3'
    };

    nodes['a9_jump_3'] = {
        id: 'a9_jump_3',
        type: 'JumpToGraph',
        graphName: 'movement_attack_corr',
        returnTo: 'a10'
    };

    // ========================================
    // PRIORIDADE A10: Cartas Gerais (P)
    // ========================================
    
    nodes['a10'] = {
        id: 'a10',
        type: 'Dummy',
        next: 'a10_start'
    };

    nodes['a10_start'] = {
        id: 'a10_start',
        type: 'SetActiveDie',
        dieType: 'P',
        mayUseRing: false,
        nexts: ['a10_1', 'a11']
    };

    nodes['a10_1'] = {
        id: 'a10_1',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a10_2'
    };

    nodes['a10_2'] = {
        id: 'a10_2',
        type: 'JumpToGraph',
        graphName: 'event_cards_general',
        returnTo: 'a11'
    };

    // ========================================
    // PRIORIDADE A11: Movimento/Ataque Corrupção (A)
    // ========================================
    
    nodes['a11'] = {
        id: 'a11',
        type: 'Dummy',
        next: 'a11_1'
    };

    nodes['a11_1'] = {
        id: 'a11_1',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: false,
        nexts: ['a11_action', 'a12']
    };

    nodes['a11_action'] = {
        id: 'a11_action',
        type: 'JumpToGraph',
        graphName: 'movement_attack_corr',
        returnTo: 'a12'
    };

    // ========================================
    // PRIORIDADE A12: Personagem em Exército (C)
    // ========================================
    
    nodes['a12'] = {
        id: 'a12',
        type: 'Dummy',
        next: 'a12_start'
    };

    nodes['a12_start'] = {
        id: 'a12_start',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: false,
        nexts: ['a12_1', 'a13']
    };

    nodes['a12_1'] = {
        id: 'a12_1',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a13'
    };

    // ========================================
    // PRIORIDADE A13: Recrutar Completo (M)
    // ========================================
    
    nodes['a13'] = {
        id: 'a13',
        type: 'Dummy',
        next: 'a13_start'
    };

    nodes['a13_start'] = {
        id: 'a13_start',
        type: 'SetActiveDie',
        dieType: 'M',
        mayUseRing: false,
        nexts: ['a13_1', 'a14']
    };

    nodes['a13_1'] = {
        id: 'a13_1',
        type: 'JumpToGraph',
        graphName: 'muster_minion',
        returnTo: 'a13_2'
    };

    nodes['a13_2'] = {
        id: 'a13_2',
        type: 'JumpToGraph',
        graphName: 'muster_politics',
        returnTo: 'a13_3'
    };

    nodes['a13_3'] = {
        id: 'a13_3',
        type: 'JumpToGraph',
        graphName: 'muster_muster',
        returnTo: 'a14'
    };

    // ========================================
    // FASE 2: RETRY COM USO DE ANEL PERMITIDO
    // ========================================

    // ========================================
    // PRIORIDADE A14: Movimento Nazgûl COM ANEL (C)
    // ========================================
    
    nodes['a14'] = {
        id: 'a14',
        type: 'Dummy',
        next: 'a14_1'
    };

    nodes['a14_1'] = {
        id: 'a14_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a14_cond', 'a15']
    };

    nodes['a14_cond'] = {
        id: 'a14_cond',
        type: 'BinaryCondition',
        message: 'The Fellowship is in a region with no Nazgûl which a Nazgûl can move to.',
        nexts: ['a14_jump', 'a15']
    };

    nodes['a14_jump'] = {
        id: 'a14_jump',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a15'
    };

    // ========================================
    // PRIORIDADE A15: Recrutar Politics COM ANEL (M)
    // ========================================
    
    nodes['a15'] = {
        id: 'a15',
        type: 'Dummy',
        next: 'a15_1'
    };

    nodes['a15_1'] = {
        id: 'a15_1',
        type: 'SetActiveDie',
        dieType: 'M',
        mayUseRing: true,
        nexts: ['a15_jump', 'a16']
    };

    nodes['a15_jump'] = {
        id: 'a15_jump',
        type: 'JumpToGraph',
        graphName: 'muster_politics',
        returnTo: 'a16'
    };

    // ========================================
    // PRIORIDADE A16: Ataques em Guerra COM ANEL (C, A)
    // ========================================
    
    nodes['a16'] = {
        id: 'a16',
        type: 'Dummy',
        next: 'a16_1'
    };

    nodes['a16_1'] = {
        id: 'a16_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a16_cond', 'a16_2']
    };

    nodes['a16_2'] = {
        id: 'a16_2',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a16_cond', 'a17']
    };

    nodes['a16_cond'] = {
        id: 'a16_cond',
        type: 'BinaryCondition',
        message: 'A *mobile* army is adjacent to its *target*.\nAnd, the *target* is in a nation at war and not under siege.',
        nexts: ['a16_jump_1_die', 'a17']
    };

    nodes['a16_jump_1_die'] = {
        id: 'a16_jump_1_die',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a16_jump_1', 'a16_jump_2_die']
    };

    nodes['a16_jump_1'] = {
        id: 'a16_jump_1',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a16_jump_2_die'
    };

    nodes['a16_jump_2_die'] = {
        id: 'a16_jump_2_die',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a16_jump_2', 'a17']
    };

    nodes['a16_jump_2'] = {
        id: 'a16_jump_2',
        type: 'JumpToGraph',
        graphName: 'movement_attack_basic',
        returnTo: 'a17'
    };

    // ========================================
    // PRIORIDADE A17: Cartas Preferidas COM ANEL (C, P)
    // ========================================
    
    nodes['a17'] = {
        id: 'a17',
        type: 'Dummy',
        next: 'a17_1'
    };

    nodes['a17_1'] = {
        id: 'a17_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a17_jump_1', 'a17_2']
    };

    nodes['a17_jump_1'] = {
        id: 'a17_jump_1',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a17_2'
    };

    nodes['a17_2'] = {
        id: 'a17_2',
        type: 'SetActiveDie',
        dieType: 'P',
        mayUseRing: true,
        nexts: ['a17_jump_2', 'a18']
    };

    nodes['a17_jump_2'] = {
        id: 'a17_jump_2',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a18'
    };

    // ========================================
    // PRIORIDADE A18: Ataques/Cerco COM ANEL (C, A)
    // ========================================
    
    nodes['a18'] = {
        id: 'a18',
        type: 'Dummy',
        next: 'a18_1'
    };

    nodes['a18_1'] = {
        id: 'a18_1',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a18_cond', 'a18_2']
    };

    nodes['a18_2'] = {
        id: 'a18_2',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a18_cond', 'a19']
    };

    nodes['a18_cond'] = {
        id: 'a18_cond',
        type: 'BinaryCondition',
        message: 'A *mobile* army is adjacent to its *target* that is not under siege.',
        nexts: ['a18_jump_1_die', 'a19']
    };

    nodes['a18_jump_1_die'] = {
        id: 'a18_jump_1_die',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a18_jump_1', 'a18_jump_2_die']
    };

    nodes['a18_jump_1'] = {
        id: 'a18_jump_1',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a18_jump_2_die'
    };

    nodes['a18_jump_2_die'] = {
        id: 'a18_jump_2_die',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a18_jump_2', 'a19']
    };

    nodes['a18_jump_2'] = {
        id: 'a18_jump_2',
        type: 'JumpToGraph',
        graphName: 'movement_attack_besiege',
        returnTo: 'a18_jump_3'
    };

    nodes['a18_jump_3'] = {
        id: 'a18_jump_3',
        type: 'JumpToGraph',
        graphName: 'movement_attack_corr',
        returnTo: 'a19'
    };

    // ========================================
    // PRIORIDADE A19: Cartas Gerais COM ANEL (P)
    // ========================================
    
    nodes['a19'] = {
        id: 'a19',
        type: 'Dummy',
        next: 'a19_start'
    };

    nodes['a19_start'] = {
        id: 'a19_start',
        type: 'SetActiveDie',
        dieType: 'P',
        mayUseRing: true,
        nexts: ['a19_1', 'a20']
    };

    nodes['a19_1'] = {
        id: 'a19_1',
        type: 'JumpToGraph',
        graphName: 'event_cards_preferred',
        returnTo: 'a19_2'
    };

    nodes['a19_2'] = {
        id: 'a19_2',
        type: 'JumpToGraph',
        graphName: 'event_cards_general',
        returnTo: 'a20'
    };

    // ========================================
    // PRIORIDADE A20: Movimento/Ataque Corrupção COM ANEL (A)
    // ========================================
    
    nodes['a20'] = {
        id: 'a20',
        type: 'Dummy',
        next: 'a20_1'
    };

    nodes['a20_1'] = {
        id: 'a20_1',
        type: 'SetActiveDie',
        dieType: 'A',
        mayUseRing: true,
        nexts: ['a20_action', 'a21']
    };

    nodes['a20_action'] = {
        id: 'a20_action',
        type: 'JumpToGraph',
        graphName: 'movement_attack_corr',
        returnTo: 'a21'
    };

    // ========================================
    // PRIORIDADE A21: Personagem em Exército COM ANEL (C)
    // ========================================
    
    nodes['a21'] = {
        id: 'a21',
        type: 'Dummy',
        next: 'a21_start'
    };

    nodes['a21_start'] = {
        id: 'a21_start',
        type: 'SetActiveDie',
        dieType: 'C',
        mayUseRing: true,
        nexts: ['a21_1', 'a22']
    };

    nodes['a21_1'] = {
        id: 'a21_1',
        type: 'JumpToGraph',
        graphName: 'character_army',
        returnTo: 'a22'
    };

    // ========================================
    // PRIORIDADE A22: Recrutar Completo COM ANEL (M)
    // ========================================
    
    nodes['a22'] = {
        id: 'a22',
        type: 'Dummy',
        next: 'a22_start'
    };

    nodes['a22_start'] = {
        id: 'a22_start',
        type: 'SetActiveDie',
        dieType: 'M',
        mayUseRing: true,
        nexts: ['a22_1', 'a23']
    };

    nodes['a22_1'] = {
        id: 'a22_1',
        type: 'JumpToGraph',
        graphName: 'muster_minion',
        returnTo: 'a22_2'
    };

    nodes['a22_2'] = {
        id: 'a22_2',
        type: 'JumpToGraph',
        graphName: 'muster_politics',
        returnTo: 'a22_3'
    };

    nodes['a22_3'] = {
        id: 'a22_3',
        type: 'JumpToGraph',
        graphName: 'muster_muster',
        returnTo: 'a23'
    };

    // ========================================
    // PRIORIDADE A23: Retornar (Nenhuma Ação Encontrada)
    // ========================================
    
    nodes['a23'] = {
        id: 'a23',
        type: 'ReturnFromGraph',
        nexts: []
    };

    return new Graph('select_action_corr', nodes);
}

// ========================================
// EXPORT JSON (para compatibilidade com graph-loader.js)
// ========================================

const selectActionCorr = {
    name: "select_action_corr",
    startNode: "select_action_corr",
    nodes: [
        // START E THREAT CHECK
        { id: "select_action_corr", type: "Start", next: "threat_check" },
        { id: "threat_check", type: "JumpToGraph", targetGraph: "threat_exposed", returnTo: "a1" },
        
        // A1: Cartas (C+P) se Sociedade Exposta/Mordor
        { id: "a1", type: "Dummy", next: "a1_1" },
        { id: "a1_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a1_2", "a2"] },
        { id: "a1_2", type: "SetActiveDie", dieType: "P", mayUseRing: true, nexts: ["a1_cond", "a2"] },
        { id: "a1_cond", type: "BinaryCondition", message: "The Fellowship is on the Mordor track or is revealed.\nAnd, a character card is held.", nexts: ["a1_jump", "a2"] },
        { id: "a1_jump", type: "JumpToGraph", targetGraph: "event_cards_corruption", returnTo: "a2" },
        
        // A2: Movimento Nazgûl (C)
        { id: "a2", type: "Dummy", next: "a2_1" },
        { id: "a2_1", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a2_cond", "a3"] },
        { id: "a2_cond", type: "BinaryCondition", message: "The Fellowship is in a region with no Nazgûl and which Nazgûl can move to.", nexts: ["a2_jump", "a3"] },
        { id: "a2_jump", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a3" },
        
        // A3: Witch King (C)
        { id: "a3", type: "Dummy", next: "a3_1" },
        { id: "a3_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a3_cond", "a4"] },
        { id: "a3_cond", type: "BinaryCondition", message: "The Which King is in play and not in a *mobile* army but is able to create or join one.", nexts: ["a3_jump", "a4"] },
        { id: "a3_jump", type: "JumpToGraph", targetGraph: "character_which_king", returnTo: "a4" },
        
        // A4: Recrutar Minion (M com anel)
        { id: "a4", type: "Dummy", next: "a4_1" },
        { id: "a4_1", type: "SetActiveDie", dieType: "M", mayUseRing: true, nexts: ["a4_jump", "a5"] },
        { id: "a4_jump", type: "JumpToGraph", targetGraph: "muster_minion", returnTo: "a5" },
        
        // A5: Recrutar Politics (M)
        { id: "a5", type: "Dummy", next: "a5_1" },
        { id: "a5_1", type: "SetActiveDie", dieType: "M", mayUseRing: false, nexts: ["a5_jump", "a6"] },
        { id: "a5_jump", type: "JumpToGraph", targetGraph: "muster_politics", returnTo: "a6" },
        
        // A6: Ataques Decisivos (COM ANEL + SEM ANEL) - 14 nós
        { id: "a6", type: "Dummy", next: "a6_1_ring" },
        { id: "a6_1_ring", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a6_cond_ring", "a6_2_ring"] },
        { id: "a6_2_ring", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a6_cond_ring", "a7"] },
        { id: "a6_cond_ring", type: "BinaryCondition", message: "A *mobile* army is adjacent to its *target*.\nAnd, the *target* gives enough points to win or the Fellowship is on the Mordor track.", nexts: ["a6_jump_1_die_ring", "a6_1_no_ring"] },
        { id: "a6_jump_1_die_ring", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a6_jump_1_ring", "a6_jump_2_die_ring"] },
        { id: "a6_jump_1_ring", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a6_jump_2_die_ring" },
        { id: "a6_jump_2_die_ring", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a6_jump_2_ring", "a7"] },
        { id: "a6_jump_2_ring", type: "JumpToGraph", targetGraph: "movement_attack_basic", returnTo: "a7" },
        { id: "a6_1_no_ring", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a6_cond_no_ring", "a6_2_no_ring"] },
        { id: "a6_2_no_ring", type: "SetActiveDie", dieType: "A", mayUseRing: false, nexts: ["a6_cond_no_ring", "a7"] },
        { id: "a6_cond_no_ring", type: "BinaryCondition", message: "A *mobile* army is adjacent to its *target*.\nAnd, the *target* is in a nation at war and not under siege.", nexts: ["a6_jump_1_die_no_ring", "a7"] },
        { id: "a6_jump_1_die_no_ring", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a6_jump_1_no_ring", "a6_jump_2_die_no_ring"] },
        { id: "a6_jump_1_no_ring", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a6_jump_2_die_no_ring" },
        { id: "a6_jump_2_die_no_ring", type: "SetActiveDie", dieType: "A", mayUseRing: false, nexts: ["a6_jump_2_no_ring", "a7"] },
        { id: "a6_jump_2_no_ring", type: "JumpToGraph", targetGraph: "movement_attack_basic", returnTo: "a7" },
        
        // A7: Passar
        { id: "a7", type: "Dummy", next: "a7_1" },
        { id: "a7_1", type: "BinaryCondition", message: "O jogador das Sombras tem permissão para passar.", nexts: ["a7_action", "a8"] },
        { id: "a7_action", type: "PerformAction", message: "Passar", nexts: ["a7_end"] },
        { id: "a7_end", type: "End", nexts: [] },
        
        // A8: Cartas Preferidas (C, P)
        { id: "a8", type: "Dummy", next: "a8_1" },
        { id: "a8_1", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a8_jump_1", "a8_2"] },
        { id: "a8_jump_1", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a8_2" },
        { id: "a8_2", type: "SetActiveDie", dieType: "P", mayUseRing: false, nexts: ["a8_jump_2", "a9"] },
        { id: "a8_jump_2", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a9" },
        
        // A9: Ataques/Cerco (C, A)
        { id: "a9", type: "Dummy", next: "a9_1" },
        { id: "a9_1", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a9_cond", "a9_2"] },
        { id: "a9_2", type: "SetActiveDie", dieType: "A", mayUseRing: false, nexts: ["a9_cond", "a10"] },
        { id: "a9_cond", type: "BinaryCondition", message: "A *mobile* army is adjacent to its *target* that is not under siege.", nexts: ["a9_jump_1_die", "a10"] },
        { id: "a9_jump_1_die", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a9_jump_1", "a9_jump_2_die"] },
        { id: "a9_jump_1", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a9_jump_2_die" },
        { id: "a9_jump_2_die", type: "SetActiveDie", dieType: "A", mayUseRing: false, nexts: ["a9_jump_2", "a10"] },
        { id: "a9_jump_2", type: "JumpToGraph", targetGraph: "movement_attack_besiege", returnTo: "a9_jump_3" },
        { id: "a9_jump_3", type: "JumpToGraph", targetGraph: "movement_attack_corr", returnTo: "a10" },
        
        // A10: Cartas Gerais (P)
        { id: "a10", type: "Dummy", next: "a10_start" },
        { id: "a10_start", type: "SetActiveDie", dieType: "P", mayUseRing: false, nexts: ["a10_1", "a11"] },
        { id: "a10_1", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a10_2" },
        { id: "a10_2", type: "JumpToGraph", targetGraph: "event_cards_general", returnTo: "a11" },
        
        // A11: Movimento/Ataque Corrupção (A)
        { id: "a11", type: "Dummy", next: "a11_1" },
        { id: "a11_1", type: "SetActiveDie", dieType: "A", mayUseRing: false, nexts: ["a11_action", "a12"] },
        { id: "a11_action", type: "JumpToGraph", targetGraph: "movement_attack_corr", returnTo: "a12" },
        
        // A12: Personagem em Exército (C)
        { id: "a12", type: "Dummy", next: "a12_start" },
        { id: "a12_start", type: "SetActiveDie", dieType: "C", mayUseRing: false, nexts: ["a12_1", "a13"] },
        { id: "a12_1", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a13" },
        
        // A13: Recrutar Completo (M)
        { id: "a13", type: "Dummy", next: "a13_start" },
        { id: "a13_start", type: "SetActiveDie", dieType: "M", mayUseRing: false, nexts: ["a13_1", "a14"] },
        { id: "a13_1", type: "JumpToGraph", targetGraph: "muster_minion", returnTo: "a13_2" },
        { id: "a13_2", type: "JumpToGraph", targetGraph: "muster_politics", returnTo: "a13_3" },
        { id: "a13_3", type: "JumpToGraph", targetGraph: "muster_muster", returnTo: "a14" },
        
        // FASE 2: RETRY COM ANEL PERMITIDO
        
        // A14: Movimento Nazgûl COM ANEL (C)
        { id: "a14", type: "Dummy", next: "a14_1" },
        { id: "a14_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a14_cond", "a15"] },
        { id: "a14_cond", type: "BinaryCondition", message: "The Fellowship is in a region with no Nazgûl which a Nazgûl can move to.", nexts: ["a14_jump", "a15"] },
        { id: "a14_jump", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a15" },
        
        // A15: Recrutar Politics COM ANEL (M)
        { id: "a15", type: "Dummy", next: "a15_1" },
        { id: "a15_1", type: "SetActiveDie", dieType: "M", mayUseRing: true, nexts: ["a15_jump", "a16"] },
        { id: "a15_jump", type: "JumpToGraph", targetGraph: "muster_politics", returnTo: "a16" },
        
        // A16: Ataques em Guerra COM ANEL (C, A)
        { id: "a16", type: "Dummy", next: "a16_1" },
        { id: "a16_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a16_cond", "a16_2"] },
        { id: "a16_2", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a16_cond", "a17"] },
        { id: "a16_cond", type: "BinaryCondition", message: "A *mobile* army is adjacent to its *target*.\nAnd, the *target* is in a nation at war and not under siege.", nexts: ["a16_jump_1_die", "a17"] },
        { id: "a16_jump_1_die", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a16_jump_1", "a16_jump_2_die"] },
        { id: "a16_jump_1", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a16_jump_2_die" },
        { id: "a16_jump_2_die", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a16_jump_2", "a17"] },
        { id: "a16_jump_2", type: "JumpToGraph", targetGraph: "movement_attack_basic", returnTo: "a17" },
        
        // A17: Cartas Preferidas COM ANEL (C, P)
        { id: "a17", type: "Dummy", next: "a17_1" },
        { id: "a17_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a17_jump_1", "a17_2"] },
        { id: "a17_jump_1", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a17_2" },
        { id: "a17_2", type: "SetActiveDie", dieType: "P", mayUseRing: true, nexts: ["a17_jump_2", "a18"] },
        { id: "a17_jump_2", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a18" },
        
        // A18: Ataques/Cerco COM ANEL (C, A)
        { id: "a18", type: "Dummy", next: "a18_1" },
        { id: "a18_1", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a18_cond", "a18_2"] },
        { id: "a18_2", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a18_cond", "a19"] },
        { id: "a18_cond", type: "BinaryCondition", message: "A *mobile* army is adjacent to its *target* that is not under siege.", nexts: ["a18_jump_1_die", "a19"] },
        { id: "a18_jump_1_die", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a18_jump_1", "a18_jump_2_die"] },
        { id: "a18_jump_1", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a18_jump_2_die" },
        { id: "a18_jump_2_die", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a18_jump_2", "a19"] },
        { id: "a18_jump_2", type: "JumpToGraph", targetGraph: "movement_attack_besiege", returnTo: "a18_jump_3" },
        { id: "a18_jump_3", type: "JumpToGraph", targetGraph: "movement_attack_corr", returnTo: "a19" },
        
        // A19: Cartas Gerais COM ANEL (P)
        { id: "a19", type: "Dummy", next: "a19_start" },
        { id: "a19_start", type: "SetActiveDie", dieType: "P", mayUseRing: true, nexts: ["a19_1", "a20"] },
        { id: "a19_1", type: "JumpToGraph", targetGraph: "event_cards_preferred", returnTo: "a19_2" },
        { id: "a19_2", type: "JumpToGraph", targetGraph: "event_cards_general", returnTo: "a20" },
        
        // A20: Movimento/Ataque Corrupção COM ANEL (A)
        { id: "a20", type: "Dummy", next: "a20_1" },
        { id: "a20_1", type: "SetActiveDie", dieType: "A", mayUseRing: true, nexts: ["a20_action", "a21"] },
        { id: "a20_action", type: "JumpToGraph", targetGraph: "movement_attack_corr", returnTo: "a21" },
        
        // A21: Personagem em Exército COM ANEL (C)
        { id: "a21", type: "Dummy", next: "a21_start" },
        { id: "a21_start", type: "SetActiveDie", dieType: "C", mayUseRing: true, nexts: ["a21_1", "a22"] },
        { id: "a21_1", type: "JumpToGraph", targetGraph: "character_army", returnTo: "a22" },
        
        // A22: Recrutar Completo COM ANEL (M)
        { id: "a22", type: "Dummy", next: "a22_start" },
        { id: "a22_start", type: "SetActiveDie", dieType: "M", mayUseRing: true, nexts: ["a22_1", "a23"] },
        { id: "a22_1", type: "JumpToGraph", targetGraph: "muster_minion", returnTo: "a22_2" },
        { id: "a22_2", type: "JumpToGraph", targetGraph: "muster_politics", returnTo: "a22_3" },
        { id: "a22_3", type: "JumpToGraph", targetGraph: "muster_muster", returnTo: "a23" },
        
        // A23: Retornar (Nenhuma Ação Encontrada)
        { id: "a23", type: "ReturnFromGraph" }
    ]
};

// Registrar o grafo globalmente
if (typeof window !== 'undefined') {
    window.selectActionCorr = selectActionCorr;
}

