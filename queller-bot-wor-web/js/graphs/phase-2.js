/**
 * FASE 2 - CAMARADAGEM E DECLARAÇÃO
 * 
 * Transpilado de: Queller/graphs/phase-2.jl
 * 
 * Estrutura:
 * - Start
 * - CheckStrategy (militar vs corrupção)
 * - Caminho Militar:
 *   - Verificar se pontos VP Shadow < pontos Corrupção
 *   - Se sim: trocar para Corrupção
 * - Caminho Corrupção:
 *   - Verificar se pontos Corrupção < pontos VP Shadow
 *   - Se sim: trocar para Militar
 * 
 * Total: 9 nós (Start, CheckStrategy, 2x BinaryCondition, 2x SetStrategy, 2x End)
 */

const phase2 = {
    name: "phase-2",
    startNode: "phase_2",
    nodes: [
        // ===== INÍCIO DA FASE =====
        {
            id: "phase_2",
            type: "Start",
            next: "p2_check"
        },

        // ===== VERIFICAR ESTRATÉGIA =====
        {
            id: "p2_check",
            type: "CheckStrategy",
            nextMilitar: "p2_mili",
            nextCorrupcao: "p2_corr"
        },

        // ===== CAMINHO MILITAR =====
        {
            id: "p2_mili",
            type: "BinaryCondition",
            message: "❓ Os pontos de vitória das Sombras são menores que os pontos de corrupção após os Povos Livres escolherem se revelam?",
            nexts: ["p2_mili_change", "p2_mili_end"]
        },
        {
            id: "p2_mili_change",
            type: "SetStrategy",
            strategyName: "corruption",
            next: "p2_mili_end"
        },
        {
            id: "p2_mili_end",
            type: "End",
            endMessage: "Fim da Fase 2"
        },

        // ===== CAMINHO CORRUPÇÃO =====
        {
            id: "p2_corr",
            type: "BinaryCondition",
            message: "❓ Os pontos de corrupção são menores que os pontos de vitória das Sombras após os Povos Livres escolherem se revelam?",
            nexts: ["p2_corr_change", "p2_corr_end"]
        },
        {
            id: "p2_corr_change",
            type: "SetStrategy",
            strategyName: "military",
            next: "p2_corr_end"
        },
        {
            id: "p2_corr_end",
            type: "End",
            endMessage: "Fim da Fase 2"
        }
    ]
};
