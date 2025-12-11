// ================================================================
// FASE 5: VERIFICAÇÃO DE VITÓRIA
// ================================================================
// Transpilado de: Queller/graphs/phase-5.jl
// Data: 11 de Dezembro de 2025
// Versão: 1.0
//
// Estrutura:
// - Verificar disponibilidade de anel élfico
// - Verificar disponibilidade de Mensageiro da Torre Negra (MoDT)
// - Selecionar ações baseadas na estratégia (via JumpToGraph)
// - Descartar dados se ação falhou
// - Obter dados restantes disponíveis
// ================================================================

const phase5 = {
    name: "phase-5",
    startNode: "phase_5",
    nodes: [
        // ========================================
        // INÍCIO
        // ========================================
        {
            id: "phase_5",
            type: "Start",
            next: "ring_check",
            interactive: false
        },

        // ========================================
        // VERIFICAÇÃO DE ANEL ÉLFICO
        // ========================================
        {
            id: "ring_check",
            type: "BinaryCondition",
            message: "❓ A Sombra possui um anel élfico?",
            options: ["✅ Sim", "❌ Não"],
            nexts: ["ring_available", "ring_not_available"],
            interactive: true
        },

        {
            id: "ring_available",
            type: "SetRingAvailable",
            value: true,
            next: "modt_check",
            interactive: false
        },

        {
            id: "ring_not_available",
            type: "SetRingAvailable",
            value: false,
            next: "modt_check",
            interactive: false
        },

        // ========================================
        // VERIFICAÇÃO DE MENSAGEIRO DA TORRE NEGRA (MODT)
        // ========================================
        {
            id: "modt_check",
            type: "BinaryCondition",
            message: "❓ O Boca de Sauron está recrutado e sua habilidade \"Mensageiro da Torre Negra\" não foi usada neste turno?",
            options: ["✅ Sim", "❌ Não"],
            nexts: ["modt_available", "modt_not_available"],
            interactive: true
        },

        {
            id: "modt_available",
            type: "SetMoDTAvailable",
            value: true,
            next: "p5_strat",
            interactive: false
        },

        {
            id: "modt_not_available",
            type: "SetMoDTAvailable",
            value: false,
            next: "p5_strat",
            interactive: false
        },

        // ========================================
        // SELEÇÃO DE AÇÕES BASEADA NA ESTRATÉGIA
        // ========================================
        {
            id: "p5_strat",
            type: "CheckStrategy",
            nextMilitar: "p5_mili",
            nextCorrupcao: "p5_corr",
            interactive: false
        },

        // Estratégia Militar - Pula para grafo de seleção militar
        {
            id: "p5_mili",
            type: "JumpToGraph",
            targetGraph: "select_action_mili",
            returnTo: "p5_discard_check",
            interactive: false
        },

        // Estratégia Corrupção - Pula para grafo de seleção corrupção
        {
            id: "p5_corr",
            type: "JumpToGraph",
            targetGraph: "select_action_corr",
            returnTo: "p5_discard_check",
            interactive: false
        },

        // ========================================
        // DESCARTE DE DADOS (SE AÇÃO FALHOU)
        // ========================================
        {
            id: "p5_discard_check",
            type: "CheckStrategy",
            nextMilitar: "p5_mili_discard",
            nextCorrupcao: "p5_corr_discard",
            interactive: false
        },

        {
            id: "p5_mili_discard",
            type: "PerformAction",
            message: "Queller falhou em encontrar uma ação. Descarte um dado de Personagem ou Evento aleatório se possível, caso contrário descarte um dado aleatório (não descarte um dado reservado para uso posterior).",
            nexts: ["p5_dice"],
            interactive: true
        },

        {
            id: "p5_corr_discard",
            type: "PerformAction",
            message: "Queller falhou em encontrar uma ação. Descarte um dado de Exército, Mobilização, Mobilização/Exército ou Evento aleatório se possível, caso contrário descarte um dado aleatório (não descarte um dado reservado para uso posterior).",
            nexts: ["p5_dice"],
            interactive: true
        },

        // ========================================
        // OBTER DADOS RESTANTES
        // ========================================
        {
            id: "p5_dice",
            type: "GetAvailableDice",
            prompt: "Insira os dados disponíveis restantes aqui (sem contar os dados reservados para uso posterior).",
            nexts: ["p5_end"],
            interactive: true
        },

        // ========================================
        // FIM
        // ========================================
        {
            id: "p5_end",
            type: "End",
            message: "✅ Fim da Fase 5",
            interactive: false
        }
    ]
};

// Exportar o grafo
if (typeof window !== 'undefined') {
    window.phase5 = phase5;
}
