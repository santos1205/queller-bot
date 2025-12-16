// event-cards.js - Grafos de seleção e uso de cartas de evento
// Transpilado de: Queller/graphs/event-cards.jl (173 linhas Julia)
// Total: 4 grafos, ~50 nós

// ============================================================================
// CONSTANTES DE TEXTO
// ============================================================================

const CARD_ARMY_MUSTER_PLAYABLE = `
Uma carta com tipo exército ou mobilização é *jogável*.
`;

const CARD_CHARACTER_PLAYABLE = `
Uma carta com tipo personagem é *jogável*.
`;

const PLAY_CARD_ARMY_MUSTER = `
Jogar uma carta *jogável* com tipo mobilização ou exército.

Prioridade:
1. Ordem Crescente de Iniciativa
2. Aleatório
`;

const PLAY_CARD_CHARACTER = `
Jogar uma carta *jogável* com tipo personagem.

Prioridade:
1. Ordem Crescente de Iniciativa
2. Aleatório
`;

const HOLDING_LESS_4_CARDS = `
Segurando menos de 4 cartas.
`;

const DRAW_STRATEGY_CARD = `
Comprar uma carta de estratégia.
`;

const DRAW_CHARACTER_CARD = `
Comprar uma carta de personagem.
`;

const ANY_CARD_PLAYABLE = `
Uma carta é *jogável*.
`;

const PLAY_ANY_CARD = `
Jogar uma carta *jogável*.

Prioridade:
1. Ordem crescente de iniciativa
2. Aleatório
`;

const HOLDING_MORE_6_CARDS = `
Segurando mais de 6 cartas.
`;

const DISCARD_ARMY_MUSTER = `
Descartar até 6 cartas.

Prioridade:
1. Não é uma carta com tipo exército ou mobilização
2. Não usa o termo "Sociedade revelada"
3. Não coloca uma peça
4. Ordem crescente de iniciativa
5. Aleatório
`;

const DISCARD_CHARACTER = `
Descartar até 6 cartas.

Prioridade:
1. Não é uma carta com tipo personagem
2. Não usa o termo "Sociedade revelada"
3. Não coloca uma peça
4. Ordem crescente de iniciativa
5. Aleatório
`;

const FELLOWSHIP_REVEALED_PLAYABLE = `
Uma carta "Sociedade revelada" é *jogável*.
`;

const PLAY_FELLOWSHIP_REVEALED = `
Jogar uma carta *jogável* "Sociedade revelada".

Prioridade:
1. Ordem crescente de iniciativa
2. Aleatório
`;

const CORRUPTION_HUNT_PLAYABLE = `
Uma carta que adiciona corrupção ou adiciona uma peça de caçada é *jogável*.
`;

const PLAY_CORRUPTION_HUNT = `
Jogar uma carta *jogável* que adiciona corrupção ou adiciona uma peça de caçada.

Prioridade:
1. Ordem crescente de iniciativa
2. Aleatório
`;

const SELECT_CARD_EFFECT = `
Selecionar efeito de carta para resolver.

1. Seleção de região para mobilização
2. Seleção de exército para movimento ou ataque
3. Mover servo ou Nazgûl
4. Alocação de caçada
5. Sem efeito, retornar ao menu da Fase 5
`;

const SELECT_MINION_TO_MOVE = `
Selecionar o que mover.

1. O Rei Bruxo
2. O Boca de Sauron
3. Os Nazgûl
4. Nada
`;

const HUNT_ALLOCATION_MILI = `
Selecionar um dado de personagem ou evento aleatoriamente, rolar um d6. Em um 4+, adicioná-lo à reserva de caçada. Fazer isso para cada dado que é possível adicionar à reserva de caçada.
`;

const HUNT_ALLOCATION_CORR = `
Selecionar um dado de exército, mobilização, mobilização/exército ou evento aleatoriamente, rolar um d6. Em um 4+, adicioná-lo à reserva de caçada. Fazer isso para cada dado que é possível adicionar à reserva de caçada.
`;

// ============================================================================
// GRAFO 1: event_cards_preferred (11 nós)
// Cartas preferenciais baseadas em estratégia (Militar vs Corrupção)
// ============================================================================

const eventCardsPreferred = {
    name: 'event_cards_preferred',
    startNode: 'ep_start',
    nodes: [
        { id: 'ep_start', type: 'Start', next: 'ep_1_strat' },
        
        { id: 'ep_1_strat', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'ep_1_mili', nextCorrupcao: 'ep_1_corr' },
        
        { id: 'ep_1_mili', type: 'BinaryCondition', message: CARD_ARMY_MUSTER_PLAYABLE, nexts: ['ep_2_yes', 'ep_return'] },
        
        { id: 'ep_1_corr', type: 'BinaryCondition', message: CARD_CHARACTER_PLAYABLE, nexts: ['ep_2_yes', 'ep_return'] },
        
        { id: 'ep_return', type: 'ReturnFromGraph' },
        
        { id: 'ep_2_yes', type: 'UseActiveDie', next: 'ep_2_strat' },
        
        { id: 'ep_2_strat', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'ep_2_mili', nextCorrupcao: 'ep_2_corr' },
        
        { id: 'ep_2_mili', type: 'PerformAction', message: PLAY_CARD_ARMY_MUSTER, nexts: ['ep_2_end'] },
        
        { id: 'ep_2_corr', type: 'PerformAction', message: PLAY_CARD_CHARACTER, nexts: ['ep_2_end'] },
        
        { id: 'ep_2_end', type: 'End' }
    ]
};

// ============================================================================
// GRAFO 2: event_cards_general (16 nós)
// Sistema geral de cartas: comprar, jogar, descartar
// ============================================================================

const eventCardsGeneral = {
    name: 'event_cards_general',
    startNode: 'eg_start',
    nodes: [
        { id: 'eg_start', type: 'Start', next: 'eg_1' },
        
        // Segmento 1: Comprar se < 4 cartas
        { id: 'eg_1', type: 'BinaryCondition', message: HOLDING_LESS_4_CARDS, nexts: ['eg_1_yes', 'eg_2'] },
        
        { id: 'eg_1_yes', type: 'UseActiveDie', next: 'eg_1_strat' },
        
        { id: 'eg_1_strat', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'eg_1_mili', nextCorrupcao: 'eg_1_corr' },
        
        { id: 'eg_1_mili', type: 'PerformAction', message: DRAW_STRATEGY_CARD, nexts: ['eg_1_end'] },
        
        { id: 'eg_1_corr', type: 'PerformAction', message: DRAW_CHARACTER_CARD, nexts: ['eg_1_end'] },
        
        { id: 'eg_1_end', type: 'End' },
        
        // Segmento 2: Jogar carta se jogável
        { id: 'eg_2', type: 'BinaryCondition', message: ANY_CARD_PLAYABLE, nexts: ['eg_2_yes', 'eg_3'] },
        
        { id: 'eg_2_yes', type: 'UseActiveDie', next: 'eg_2_action' },
        
        { id: 'eg_2_action', type: 'PerformAction', message: PLAY_ANY_CARD, nexts: ['eg_2_end'] },
        
        { id: 'eg_2_end', type: 'End' },
        
        // Segmento 3: Comprar e possivelmente descartar
        { id: 'eg_3', type: 'UseActiveDie', next: 'eg_3_strat' },
        
        { id: 'eg_3_strat', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'eg_3_mili', nextCorrupcao: 'eg_3_corr' },
        
        { id: 'eg_3_mili', type: 'PerformAction', message: DRAW_STRATEGY_CARD, nexts: ['eg_3_discard'] },
        
        { id: 'eg_3_corr', type: 'PerformAction', message: DRAW_CHARACTER_CARD, nexts: ['eg_3_discard'] },
        
        { id: 'eg_3_discard', type: 'BinaryCondition', message: HOLDING_MORE_6_CARDS, nexts: ['eg_3_discard_strat', 'eg_3_end'] },
        
        { id: 'eg_3_end', type: 'End' },
        
        { id: 'eg_3_discard_strat', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'eg_3_discard_mili', nextCorrupcao: 'eg_3_discard_corr' },
        
        { id: 'eg_3_discard_mili', type: 'PerformAction', message: DISCARD_ARMY_MUSTER, nexts: ['eg_3_discard_end'] },
        
        { id: 'eg_3_discard_corr', type: 'PerformAction', message: DISCARD_CHARACTER, nexts: ['eg_3_discard_end'] },
        
        { id: 'eg_3_discard_end', type: 'End' }
    ]
};

// ============================================================================
// GRAFO 3: event_cards_corruption (10 nós)
// Cartas específicas para estratégia Corrupção
// ============================================================================

const eventCardsCorruption = {
    name: 'event_cards_corruption',
    startNode: 'ec_start',
    nodes: [
        { id: 'ec_start', type: 'Start', next: 'ec_1' },
        
        // Prioridade 1: Cartas "Sociedade revelada"
        { id: 'ec_1', type: 'BinaryCondition', message: FELLOWSHIP_REVEALED_PLAYABLE, nexts: ['ec_1_yes', 'ec_2'] },
        
        { id: 'ec_1_yes', type: 'UseActiveDie', next: 'ec_1_action' },
        
        { id: 'ec_1_action', type: 'PerformAction', message: PLAY_FELLOWSHIP_REVEALED, nexts: ['ec_1_end'] },
        
        { id: 'ec_1_end', type: 'End' },
        
        // Prioridade 2: Cartas de corrupção/caçada
        { id: 'ec_2', type: 'BinaryCondition', message: CORRUPTION_HUNT_PLAYABLE, nexts: ['ec_2_yes', 'ec_3'] },
        
        { id: 'ec_2_yes', type: 'UseActiveDie', next: 'ec_2_action' },
        
        { id: 'ec_2_action', type: 'PerformAction', message: PLAY_CORRUPTION_HUNT, nexts: ['ec_2_end'] },
        
        { id: 'ec_2_end', type: 'End' },
        
        // Prioridade 3: Comprar se < 4 cartas
        { id: 'ec_3', type: 'BinaryCondition', message: HOLDING_LESS_4_CARDS, nexts: ['ec_3_yes', 'ec_return'] },
        
        { id: 'ec_3_yes', type: 'UseActiveDie', next: 'ec_3_action' },
        
        { id: 'ec_3_action', type: 'PerformAction', message: DRAW_CHARACTER_CARD, nexts: ['ec_3_end'] },
        
        { id: 'ec_3_end', type: 'End' },
        
        { id: 'ec_return', type: 'ReturnFromGraph' }
    ]
};

// ============================================================================
// GRAFO 4: event_cards_resolve_effect (13 nós)
// Resolver efeitos de carta jogada (mobilização, exército, personagem, caçada)
// ============================================================================

const eventCardsResolveEffect = {
    name: 'event_cards_resolve_effect',
    startNode: 'er_start',
    nodes: [
        { id: 'er_start', type: 'Start', next: 'er_select_card_effect_choice' },
        
        // Escolha principal: Que tipo de efeito resolver?
        { id: 'er_select_card_effect_choice', type: 'MultipleChoice', 
          message: SELECT_CARD_EFFECT,
          options: [
              'Seleção de região para mobilização',
              'Seleção de exército para movimento ou ataque',
              'Mover servo ou Nazgûl',
              'Alocação de caçada',
              'Sem efeito, retornar ao menu da Fase 5'
          ],
          nexts: ['er_muster', 'er_army', 'er_char_move', 'er_hunt', 'er_resolve_end'] 
        },
        
        { id: 'er_muster', type: 'JumpToGraph', targetGraph: 'muster_card', returnTo: 'er_resolve_end' },
        
        { id: 'er_army', type: 'JumpToGraph', targetGraph: 'movement_attack_card', returnTo: 'er_resolve_end' },
        
        // Submenu: Mover qual servo/Nazgûl?
        { id: 'er_char_move', type: 'MultipleChoice', 
          message: SELECT_MINION_TO_MOVE,
          options: [
              'O Rei Bruxo',
              'O Boca de Sauron',
              'Os Nazgûl',
              'Nada'
          ],
          nexts: ['er_move_wk', 'er_move_mos', 'er_move_naz', 'er_select_card_effect_choice'] 
        },
        
        { id: 'er_move_wk', type: 'JumpToGraph', targetGraph: 'character_wk_prio', returnTo: 'er_resolve_end' },
        
        { id: 'er_move_mos', type: 'JumpToGraph', targetGraph: 'character_mos_prio', returnTo: 'er_resolve_end' },
        
        { id: 'er_move_naz', type: 'JumpToGraph', targetGraph: 'character_nazgul_prio', returnTo: 'er_resolve_end' },
        
        // Alocação de caçada (diferente para Militar vs Corrupção)
        { id: 'er_hunt', type: 'CheckStrategy', strategy: 'military', nextMilitar: 'er_hunt_mili', nextCorrupcao: 'er_hunt_corr' },
        
        { id: 'er_hunt_mili', type: 'PerformAction', message: HUNT_ALLOCATION_MILI, nexts: ['er_resolve_end'] },
        
        { id: 'er_hunt_corr', type: 'PerformAction', message: HUNT_ALLOCATION_CORR, nexts: ['er_resolve_end'] },
        
        { id: 'er_resolve_end', type: 'End' }
    ]
};

// ============================================================================
// EXPORTAÇÃO
// ============================================================================

// Variáveis globais para carregamento sem ES6 modules
if (typeof window !== 'undefined') {
    window.eventCardsPreferred = eventCardsPreferred;
    window.eventCardsGeneral = eventCardsGeneral;
    window.eventCardsCorruption = eventCardsCorruption;
    window.eventCardsResolveEffect = eventCardsResolveEffect;
}
