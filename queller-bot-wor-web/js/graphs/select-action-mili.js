/**
 * SELECT ACTION MILI - Seleção de Ações (Estratégia Militar)
 * 
 * Transpilado de: Queller/graphs/select-action-mili.jl
 * 
 * Este grafo define a priorização de ações para a estratégia Militar.
 * É chamado pela Fase 5 (phase-5.js) via JumpToGraph.
 * 
 * Estrutura:
 * - 13 prioridades (a1 a a13)
 * - Cada prioridade tenta usar um tipo específico de dado
 * - Muitos JumpToGraph para subgrafos específicos
 * - ReturnFromGraph se nenhuma ação for encontrada
 * 
 * Linhas no original: 131 linhas Julia
 * Nós: 52 nós
 */

const selectActionMili = {
    name: "select_action_mili",
    startNode: "select_action_mili",
    nodes: [
        // ============================================================================
        // START NODE
        // ============================================================================
        {
            id: "select_action_mili",
            type: "Start",
            next: "threat_check"
        },

        // Primeiro: verificar ameaça/exposição
        {
            id: "threat_check",
            type: "JumpToGraph",
            targetGraph: "threat_exposed",
            returnTo: "a1"
        },

        // ============================================================================
        // PRIORIDADE A1: WITCH KING MÓVEL
        // ============================================================================
        {
            id: "a1",
            type: "Dummy",
            next: "a1_1"
        },
        {
            id: "a1_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die
            mayUseRing: true,
            next: "a1_cond",
            noDie: "a2"
        },
        {
            id: "a1_cond",
            type: "BinaryCondition",
            message: "O Rei Bruxo está em jogo e não está em um exército *móvel*, mas pode criar ou juntar-se a um?",
            nexts: ["a1_jump", "a2"]  // [yes, no]
        },
        {
            id: "a1_jump",
            type: "JumpToGraph",
            targetGraph: "character_which_king",
            returnTo: "a2"
        },

        // ============================================================================
        // PRIORIDADE A2: RECRUTAR COM MINION (RING)
        // ============================================================================
        {
            id: "a2",
            type: "Dummy",
            next: "a2_1"
        },
        {
            id: "a2_1",
            type: "SetActiveDie",
            dieType: "R",  // Muster die
            mayUseRing: true,
            next: "a2_jump",
            noDie: "a3"
        },
        {
            id: "a2_jump",
            type: "JumpToGraph",
            targetGraph: "muster_minion",
            returnTo: "a3"
        },

        // ============================================================================
        // PRIORIDADE A3: RECRUTAR COM POLÍTICA
        // ============================================================================
        {
            id: "a3",
            type: "Dummy",
            next: "a3_1"
        },
        {
            id: "a3_1",
            type: "SetActiveDie",
            dieType: "R",  // Muster die
            mayUseRing: false,
            next: "a3_jump",
            noDie: "a4"
        },
        {
            id: "a3_jump",
            type: "JumpToGraph",
            targetGraph: "muster_politics",
            returnTo: "a4"
        },

        // ============================================================================
        // PRIORIDADE A4: CARTAS DE PERSONAGEM (FELLOWSHIP REVELADA)
        // ============================================================================
        {
            id: "a4",
            type: "Dummy",
            next: "a4_1"
        },
        {
            id: "a4_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die
            mayUseRing: true,
            next: "a4_2",
            noDie: "a5"
        },
        {
            id: "a4_2",
            type: "SetActiveDie",
            dieType: "P",  // Character die (second choice)
            mayUseRing: true,
            next: "a4_cond",
            noDie: "a5"
        },
        {
            id: "a4_cond",
            type: "BinaryCondition",
            message: "A Sociedade está na trilha de Mordor ou revelada? E você possui uma carta de personagem 'Sociedade revelada'?",
            nexts: ["a4_die", "a5"]  // [yes, no]
        },
        {
            id: "a4_die",
            type: "UseActiveDie",
            next: "a4_action"
        },
        {
            id: "a4_action",
            type: "PerformAction",
            message: `Jogar uma carta de personagem "Sociedade revelada".

Prioridade:
1. Ordem ascendente de iniciativa
2. Aleatório`,
            nexts: ["a4_end"]
        },
        {
            id: "a4_end",
            type: "End"
        },

        // ============================================================================
        // PRIORIDADE A5: MOVIMENTO/ATAQUE ADJACENTE AO ALVO (AGRESSIVO)
        // ============================================================================
        {
            id: "a5",
            type: "Dummy",
            next: "a5_1"
        },
        {
            id: "a5_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die
            mayUseRing: true,
            next: "a5_2",
            noDie: "a6"
        },
        {
            id: "a5_2",
            type: "SetActiveDie",
            dieType: "E",  // Army die
            mayUseRing: true,
            next: "a5_cond",
            noDie: "a6"
        },
        {
            id: "a5_cond",
            type: "BinaryCondition",
            message: `Um exército *móvel* está adjacente ao seu *alvo* ou a um exército dos Povos Livres na rota mais curta para o *alvo*?

E alguma das seguintes condições é verdadeira:
- O *alvo* do exército *móvel* dá pontos suficientes para vencer.
- O *alvo* do exército *móvel* está em uma nação em guerra e não está sob cerco.
- A Sociedade está na trilha de Mordor.`,
            nexts: ["a5_action", "a6"]  // [yes, no]
        },
        {
            id: "a5_action",
            type: "JumpToGraph",
            targetGraph: "movement_attack_basic",
            returnTo: "a6"
        },

        // ============================================================================
        // PRIORIDADE A6: CARTAS DE ESTRATÉGIA QUE RECRUTAM
        // ============================================================================
        {
            id: "a6",
            type: "Dummy",
            next: "a6_1"
        },
        {
            id: "a6_1",
            type: "SetActiveDie",
            dieType: "R",  // Muster die
            mayUseRing: false,
            next: "a6_cond",
            noDie: "a7"
        },
        {
            id: "a6_cond",
            type: "BinaryCondition",
            message: "Uma carta de estratégia que recruta é *jogável*?",
            nexts: ["a6_die", "a6_2"]  // [yes, no]
        },
        {
            id: "a6_2",
            type: "SetActiveDie",
            dieType: "E",  // Army die (fallback)
            mayUseRing: false,
            next: "a6_cond_2",
            noDie: "a7"
        },
        {
            id: "a6_cond_2",
            type: "BinaryCondition",
            message: "Uma carta de estratégia que recruta é *jogável*?",
            nexts: ["a6_die", "a7"]  // [yes, no]
        },
        {
            id: "a6_die",
            type: "UseActiveDie",
            next: "a6_action"
        },
        {
            id: "a6_action",
            type: "PerformAction",
            message: `Jogar uma carta de estratégia que recruta.

Prioridade:
1. Ordem ascendente de iniciativa
2. Aleatório`,
            nexts: ["a6_end"]
        },
        {
            id: "a6_end",
            type: "End"
        },

        // ============================================================================
        // PRIORIDADE A7: PASSAR
        // ============================================================================
        {
            id: "a7",
            type: "Dummy",
            next: "a7_1"
        },
        {
            id: "a7_1",
            type: "BinaryCondition",
            message: "O jogador das Sombras tem permissão para passar?",
            nexts: ["a7_action", "a8"]  // [yes, no]
        },
        {
            id: "a7_action",
            type: "PerformAction",
            message: "Passar",
            nexts: ["a7_end"]
        },
        {
            id: "a7_end",
            type: "End"
        },

        // ============================================================================
        // PRIORIDADE A8: CARTAS DE EVENTO
        // ============================================================================
        {
            id: "a8",
            type: "Dummy",
            next: "a8_1"
        },
        {
            id: "a8_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die (usado para eventos)
            mayUseRing: false,
            next: "a8_jump_1",
            noDie: "a9"
        },
        {
            id: "a8_jump_1",
            type: "JumpToGraph",
            targetGraph: "event_cards_preferred",
            returnTo: "a8_jump_2"
        },
        {
            id: "a8_jump_2",
            type: "JumpToGraph",
            targetGraph: "event_cards_general",
            returnTo: "a9"
        },

        // ============================================================================
        // PRIORIDADE A9: MOVIMENTO/ATAQUE ADJACENTE (GERAL)
        // ============================================================================
        {
            id: "a9",
            type: "Dummy",
            next: "a9_1"
        },
        {
            id: "a9_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die
            mayUseRing: false,
            next: "a9_2",
            noDie: "a10"
        },
        {
            id: "a9_2",
            type: "SetActiveDie",
            dieType: "E",  // Army die
            mayUseRing: false,
            next: "a9_cond",
            noDie: "a10"
        },
        {
            id: "a9_cond",
            type: "BinaryCondition",
            message: "Um exército *móvel* está adjacente ao seu *alvo*?",
            nexts: ["a9_action", "a10"]  // [yes, no]
        },
        {
            id: "a9_action",
            type: "JumpToGraph",
            targetGraph: "movement_attack_basic",
            returnTo: "a10"
        },

        // ============================================================================
        // PRIORIDADE A10: MOVIMENTO/ATAQUE CORRUPÇÃO
        // ============================================================================
        {
            id: "a10",
            type: "Dummy",
            next: "a10_1"
        },
        {
            id: "a10_1",
            type: "SetActiveDie",
            dieType: "E",  // Army die
            mayUseRing: false,
            next: "a10_action",
            noDie: "a11"
        },
        {
            id: "a10_action",
            type: "JumpToGraph",
            targetGraph: "movement_attack_corr",
            returnTo: "a11"
        },

        // ============================================================================
        // PRIORIDADE A11: PERSONAGEM EM EXÉRCITO
        // ============================================================================
        {
            id: "a11",
            type: "Dummy",
            next: "a11_1"
        },
        {
            id: "a11_1",
            type: "SetActiveDie",
            dieType: "P",  // Character die
            mayUseRing: false,
            next: "a11_action",
            noDie: "a12"
        },
        {
            id: "a11_action",
            type: "JumpToGraph",
            targetGraph: "character_army",
            returnTo: "a12"
        },

        // ============================================================================
        // PRIORIDADE A12: RECRUTAR TRIPLO
        // ============================================================================
        {
            id: "a12",
            type: "Dummy",
            next: "a12_start"
        },
        {
            id: "a12_start",
            type: "SetActiveDie",
            dieType: "R",  // Muster die
            mayUseRing: false,
            next: "a12_1",
            noDie: "a13"
        },
        {
            id: "a12_1",
            type: "JumpToGraph",
            targetGraph: "muster_minion",
            returnTo: "a12_2"
        },
        {
            id: "a12_2",
            type: "JumpToGraph",
            targetGraph: "muster_politics",
            returnTo: "a12_3"
        },
        {
            id: "a12_3",
            type: "JumpToGraph",
            targetGraph: "muster_muster",
            returnTo: "a13"
        },

        // ============================================================================
        // PRIORIDADE A13: NENHUMA AÇÃO ENCONTRADA - RETORNAR
        // ============================================================================
        {
            id: "a13",
            type: "ReturnFromGraph"
        }
    ]
};

// Registrar o grafo globalmente
if (typeof window !== 'undefined') {
    window.selectActionMili = selectActionMili;
}
