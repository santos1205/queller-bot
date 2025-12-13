/**
 * FASE 4 - OLHO DE SAURON
 * 
 * Transpilado de: Queller/graphs/phase-4.jl
 * Data: 11 de Dezembro de 2025
 * 
 * DESCRIÇÃO:
 * - Fase 4: Role dados de ação e coloque resultados de Olho na caixa de caçada
 * 
 * FLUXO:
 * Start → GetAvailableDice → End
 */

const phase4 = {
    name: "phase_4",
    startNode: "phase_4",
    nodes: [
        {
            id: "phase_4",
            type: "Start",
            next: "p4_roll"
        },
        {
            id: "p4_roll",
            type: "GetAvailableDice",
            prompt: "Role todos os dados de ação que não estão na caixa de caçada. Coloque todos os resultados de Olho na caixa de caçada e insira os dados restantes.",
            nexts: ["p4_end"]
        },
        {
            id: "p4_end",
            type: "End",
            message: "Fim da Fase",
            nexts: []
        }
    ]
};

// Grafo auxiliar: adjust_dice
const adjustDice = {
    name: "adjust_dice",
    startNode: "adjust_dice",
    nodes: [
        {
            id: "adjust_dice",
            type: "Start",
            next: "adjust_roll"
        },
        {
            id: "adjust_roll",
            type: "GetAvailableDice",
            nexts: ["adjust_end"]
        },
        {
            id: "adjust_end",
            type: "End",
            nexts: []
        }
    ]
};
