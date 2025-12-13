// Grafo da Fase 3: Ações
// Transpilado de Queller/graphs/phase-3.jl

const phase3 = {
    name: "phase_3",
    startNode: "phase_3",
    nodes: [
        // ===== NÓ INICIAL =====
        {
            id: "phase_3",
            type: "Start",
            next: "p3_strat"
        },

        // ===== VERIFICAÇÃO DE ESTRATÉGIA =====
        {
            id: "p3_strat",
            type: "CheckStrategy",
            nextMilitar: "p3_mili_1",
            nextCorrupcao: "p3_corr_1"
        },

        // ==========================================
        // CAMINHO MILITAR
        // ==========================================

        // Condição 1: Sociedade na trilha de Mordor?
        {
            id: "p3_mili_1",
            type: "BinaryCondition",
            message: "❓ A Sociedade está na trilha de Mordor?",
            nextYes: "p3_mili_1_yes",
            nextNo: "p3_mili_2",
            nexts: ["p3_mili_1_yes", "p3_mili_2"]
        },
        {
            id: "p3_mili_1_yes",
            type: "PerformAction",
            message: "🎯 Atribuir o número máximo permitido de dados à reserva de caça.",
            nexts: ["p3_mili_end_phase"]
        },

        // Condição 2: Progresso da Sociedade > 5?
        {
            id: "p3_mili_2",
            type: "BinaryCondition",
            message: "❓ O progresso da Sociedade é maior que 5?",
            nextYes: "p3_mili_2_yes",
            nextNo: "p3_mili_3",
            nexts: ["p3_mili_2_yes", "p3_mili_3"]
        },
        {
            id: "p3_mili_2_yes",
            type: "PerformAction",
            message: "🎯 Atribuir 2 dados à reserva de caça.",
            nexts: ["p3_mili_end_phase"]
        },

        // Condição 3: Sociedade na posição inicial com progresso 0?
        {
            id: "p3_mili_3",
            type: "BinaryCondition",
            message: "❓ A Sociedade está na posição inicial e seu progresso é 0?",
            nextYes: "p3_mili_3_yes",
            nextNo: "p3_mili_3_no",
            nexts: ["p3_mili_3_yes", "p3_mili_3_no"]
        },
        {
            id: "p3_mili_3_yes",
            type: "PerformAction",
            message: "🎯 Atribuir 0 dados à reserva de caça.",
            nexts: ["p3_mili_end_phase"]
        },
        {
            id: "p3_mili_3_no",
            type: "PerformAction",
            message: "🎯 Atribuir 1 dado à reserva de caça.",
            nexts: ["p3_mili_end_phase"]
        },

        // Fim do caminho Militar
        {
            id: "p3_mili_end_phase",
            type: "End",
            message: "✅ Fim da Fase 3 (Militar)"
        },

        // ==========================================
        // CAMINHO CORRUPÇÃO
        // ==========================================

        // Condição 1: Sociedade na posição inicial com progresso 0?
        {
            id: "p3_corr_1",
            type: "BinaryCondition",
            message: "❓ A Sociedade está na posição inicial e seu progresso é 0?",
            nextYes: "p3_corr_1_yes",
            nextNo: "p3_corr_2",
            nexts: ["p3_corr_1_yes", "p3_corr_2"]
        },
        {
            id: "p3_corr_1_yes",
            type: "PerformAction",
            message: "🎲 Role um d6. Em 4+, atribuir 1 dado à reserva de caça, caso contrário não faça nada.",
            nexts: ["p3_corr_end_phase"]
        },

        // Condição 2: Sociedade na trilha de Mordor?
        {
            id: "p3_corr_2",
            type: "BinaryCondition",
            message: "❓ A Sociedade está na trilha de Mordor?",
            nextYes: "p3_corr_2_yes",
            nextNo: "p3_corr_3",
            nexts: ["p3_corr_2_yes", "p3_corr_3"]
        },
        {
            id: "p3_corr_2_yes",
            type: "PerformAction",
            message: "🎯 Atribuir o número máximo permitido de dados à reserva de caça.",
            nexts: ["p3_corr_end_phase"]
        },

        // Condição 3: Exército móvel adjacente ao alvo OU 7 dados?
        {
            id: "p3_corr_3",
            type: "BinaryCondition",
            message: "❓ Um exército móvel está adjacente ao seu alvo que fornece pontos de vitória suficientes para vencer o jogo, OU as Sombras têm 7 dados?",
            nextYes: "p3_corr_3_yes",
            nextNo: "p3_corr_4",
            nexts: ["p3_corr_3_yes", "p3_corr_4"]
        },
        {
            id: "p3_corr_3_yes",
            type: "PerformAction",
            message: "🎯 Atribuir 1 dado à reserva de caça.",
            nexts: ["p3_corr_end_phase"]
        },

        // Condição 4: Progresso da Sociedade > 4?
        {
            id: "p3_corr_4",
            type: "BinaryCondition",
            message: "❓ O progresso da Sociedade é maior que 4?",
            nextYes: "p3_corr_4_yes",
            nextNo: "p3_corr_5",
            nexts: ["p3_corr_4_yes", "p3_corr_5"]
        },
        {
            id: "p3_corr_4_yes",
            type: "PerformAction",
            message: "🎯 Atribuir 2 dados à reserva de caça.",
            nexts: ["p3_corr_end_phase"]
        },

        // Condição 5: Caminho passa por fortaleza das Sombras?
        {
            id: "p3_corr_5",
            type: "BinaryCondition",
            message: "❓ O caminho mais curto da Sociedade para Mordor passa por uma fortaleza das Sombras e o progresso permite que eles a passem ou estejam a 2 passos dela?",
            nextYes: "p3_corr_5_yes",
            nextNo: "p3_corr_5_no",
            nexts: ["p3_corr_5_yes", "p3_corr_5_no"]
        },
        {
            id: "p3_corr_5_yes",
            type: "PerformAction",
            message: "🎯 Atribuir 2 dados à reserva de caça.",
            nexts: ["p3_corr_end_phase"]
        },
        {
            id: "p3_corr_5_no",
            type: "PerformAction",
            message: "🎯 Atribuir 1 dado à reserva de caça.",
            nexts: ["p3_corr_end_phase"]
        },

        // Fim do caminho Corrupção
        {
            id: "p3_corr_end_phase",
            type: "End",
            message: "✅ Fim da Fase 3 (Corrupção)"
        }
    ]
};
