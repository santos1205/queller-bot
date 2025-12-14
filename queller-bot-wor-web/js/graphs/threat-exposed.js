/**
 * threat-exposed.js
 * Subgrafo: Ameaça Exposta (Threat Exposed)
 * Transpilado de: Queller/graphs/threat-exposed.jl (149 linhas)
 * 
 * Este subgrafo é chamado pela Fase 5 quando há regiões ameaçadas ou expostas.
 * Prioriza ações de ataque e movimento contra ameaças.
 */

const threatExposed = {
    name: "threat_exposed",
    startNode: "threat_exposed_start",
    nodes: [
        // ====================================================================
        // INÍCIO - Verificar se há ameaça ou região exposta
        // ====================================================================
        {
            id: "threat_exposed_start",
            type: "Start",
            next: "tx_t"
        },

        // Verificar se uma ameaça existe
        {
            id: "tx_t",
            type: "BinaryCondition",
            message: "Uma *ameaça* existe?",
            nexts: ["tx_1", "tx_exp"]
        },

        // Se não há ameaça, verificar se há região exposta
        {
            id: "tx_exp",
            type: "BinaryCondition",
            message: "Uma região *exposta* existe?",
            nexts: ["tx_5", "tx_skip_return"]
        },

        // Se não há ameaça nem exposição, retornar
        {
            id: "tx_skip_return",
            type: "ReturnFromGraph",
            next: null
        },

        // ====================================================================
        // PRIORIDADE 1: ATACAR AMEAÇA (Character ou Army)
        // ====================================================================
        {
            id: "tx_1",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_1_char_cond",
            noDie: "tx_1_army",
            mayUseRing: false
        },

        // Character pode atacar ameaça?
        {
            id: "tx_1_char_cond",
            type: "BinaryCondition",
            message: "Um exército *móvel* pode atacar a *ameaça*?",
            nexts: ["tx_1_use_die", "tx_1_army"]
        },

        // Tentar com Army die
        {
            id: "tx_1_army",
            type: "SetActiveDie",
            dieType: "A",
            next: "tx_1_army_cond",
            noDie: "tx_2",
            mayUseRing: true
        },

        // Army pode atacar ameaça?
        {
            id: "tx_1_army_cond",
            type: "BinaryCondition",
            message: "Um exército *móvel* pode atacar a *ameaça*?",
            nexts: ["tx_1_use_die", "tx_2"]
        },

        // Usar dado para ataque
        {
            id: "tx_1_use_die",
            type: "UseActiveDie",
            next: "tx_1_action"
        },

        // Executar ataque
        {
            id: "tx_1_action",
            type: "PerformAction",
            message: "**Atacar ameaça:**\nAtaque de acordo com a última condição. Selecione exército aleatoriamente se vários puderem realizar tal ataque.",
            nexts: ["tx_1_end"]
        },

        {
            id: "tx_1_end",
            type: "End",
            next: null
        },

        // ====================================================================
        // PRIORIDADE 2: MOVER PARA ADJACENTE À AMEAÇA
        // ====================================================================
        {
            id: "tx_2",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_2_char_cond",
            noDie: "tx_2_army",
            mayUseRing: false
        },

        {
            id: "tx_2_char_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover para que um exército *móvel* fique adjacente à *ameaça*?",
            nexts: ["tx_move_use_die", "tx_2_army"]
        },

        {
            id: "tx_2_army",
            type: "SetActiveDie",
            dieType: "A",
            next: "tx_2_army_cond",
            noDie: "tx_3",
            mayUseRing: true
        },

        {
            id: "tx_2_army_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover para que um exército *móvel* fique adjacente à *ameaça*?",
            nexts: ["tx_move_use_die", "tx_3"]
        },

        // ====================================================================
        // PRIORIDADE 3: MOVER PARA STRONGHOLD SOB AMEAÇA
        // ====================================================================
        {
            id: "tx_3",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_3_char_cond",
            noDie: "tx_3_army",
            mayUseRing: false
        },

        {
            id: "tx_3_char_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover de modo que o *valor* em um stronghold sob *ameaça* aumente?",
            nexts: ["tx_move_use_die", "tx_3_army"]
        },

        {
            id: "tx_3_army",
            type: "SetActiveDie",
            dieType: "A",
            next: "tx_3_army_cond",
            noDie: "tx_4",
            mayUseRing: true
        },

        {
            id: "tx_3_army_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover de modo que o *valor* em um stronghold sob *ameaça* aumente?",
            nexts: ["tx_move_use_die", "tx_4"]
        },

        // ====================================================================
        // PRIORIDADE 4: MOVER EM DIREÇÃO À AMEAÇA
        // ====================================================================
        {
            id: "tx_4",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_4_char_cond",
            noDie: "tx_4_army",
            mayUseRing: false
        },

        {
            id: "tx_4_char_cond",
            type: "BinaryCondition",
            message: "Exército(s) *móveis* podem se mover em direção ao(s) *alvo(s)* e reduzir a distância até a *ameaça*?",
            nexts: ["tx_move_use_die", "tx_4_army"]
        },

        {
            id: "tx_4_army",
            type: "SetActiveDie",
            dieType: "A",
            next: "tx_4_army_cond",
            noDie: "tx_5",
            mayUseRing: true
        },

        {
            id: "tx_4_army_cond",
            type: "BinaryCondition",
            message: "Exército(s) *móveis* podem se mover em direção ao(s) *alvo(s)* e reduzir a distância até a *ameaça*?",
            nexts: ["tx_move_use_die", "tx_5"]
        },

        // ====================================================================
        // PRIORIDADE 5: MOVER EM DIREÇÃO A REGIÃO EXPOSTA
        // ====================================================================
        {
            id: "tx_5",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_5_char_cond",
            noDie: "tx_5_army",
            mayUseRing: false
        },

        {
            id: "tx_5_char_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover em direção a uma região *exposta*?",
            nexts: ["tx_move_use_die", "tx_5_army"]
        },

        {
            id: "tx_5_army",
            type: "SetActiveDie",
            dieType: "A",
            next: "tx_5_army_cond",
            noDie: "tx_m",
            mayUseRing: true
        },

        {
            id: "tx_5_army_cond",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover em direção a uma região *exposta*?",
            nexts: ["tx_move_use_die", "tx_m"]
        },

        // ====================================================================
        // MOVIMENTO COMPARTILHADO (usado por prioridades 2-5)
        // ====================================================================
        {
            id: "tx_move_use_die",
            type: "UseActiveDie",
            next: "tx_move_action"
        },

        {
            id: "tx_move_action",
            type: "PerformAction",
            message: "**Mover:**\nMova de acordo com a última condição. Selecione exército aleatoriamente se vários puderem realizar tal movimento.",
            nexts: ["tx_move_army_die_to_move"]
        },

        // Verificar se é Army die (pode ter segundo movimento)
        {
            id: "tx_move_army_die_to_move",
            type: "CheckActiveDie",
            dieType: "E",  // 'E' = Exército/Army
            nextTrue: "tx_move_movement_remains",
            nextFalse: "tx_move_end"
        },

        // Army die tem movimento restante?
        {
            id: "tx_move_movement_remains",
            type: "BinaryCondition",
            message: "O Army Die tem um movimento restante?",
            nexts: ["tx_move_rem_2", "tx_move_end"]
        },

        {
            id: "tx_move_end",
            type: "End",
            next: null
        },

        // ====================================================================
        // SEGUNDO MOVIMENTO (Army die)
        // ====================================================================
        {
            id: "tx_move_rem_2",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover para que um exército *móvel* fique adjacente à *ameaça*?",
            nexts: ["tx_move_rem_use_die", "tx_move_rem_3"]
        },

        {
            id: "tx_move_rem_3",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover de modo que o *valor* em um stronghold sob *ameaça* aumente?",
            nexts: ["tx_move_rem_use_die", "tx_move_rem_4"]
        },

        {
            id: "tx_move_rem_4",
            type: "BinaryCondition",
            message: "Exército(s) *móveis* podem se mover em direção ao(s) *alvo(s)* e reduzir a distância até a *ameaça*?",
            nexts: ["tx_move_rem_use_die", "tx_move_rem_5"]
        },

        {
            id: "tx_move_rem_5",
            type: "BinaryCondition",
            message: "Exército(s) podem se mover em direção a uma região *exposta*?",
            nexts: ["tx_move_rem_use_die", "tx_move_rem_6"]
        },

        // Se nenhuma condição, pular para movement_attack_corr
        {
            id: "tx_move_rem_6",
            type: "JumpToGraph",
            targetGraph: "movement_attack_corr",
            returnTo: "tx_move_rem_end"
        },

        {
            id: "tx_move_rem_use_die",
            type: "UseActiveDie",
            next: "tx_move_rem_action"
        },

        {
            id: "tx_move_rem_action",
            type: "PerformAction",
            message: "**Mover (2º movimento):**\nMova de acordo com a última condição. Selecione exército aleatoriamente se vários puderem realizar tal movimento.",
            nexts: ["tx_move_rem_end"]
        },

        {
            id: "tx_move_rem_end",
            type: "End",
            next: null
        },

        // ====================================================================
        // RECRUTAR (Muster) EM STRONGHOLD SOB AMEAÇA
        // ====================================================================
        {
            id: "tx_m",
            type: "SetActiveDie",
            dieType: "M",
            next: "tx_m_cond",
            noDie: "tx_c",
            mayUseRing: true
        },

        {
            id: "tx_m_cond",
            type: "BinaryCondition",
            message: "É possível recrutar em um stronghold sob *ameaça*?",
            nexts: ["tx_m_die", "tx_c"]
        },

        {
            id: "tx_m_die",
            type: "UseActiveDie",
            next: "tx_m_action"
        },

        {
            id: "tx_m_action",
            type: "PerformAction",
            message: "**Recrutar:**\n\n**Prioridade de *Foco*:**\n1. Stronghold sob *ameaça*\n2. Aleatório\n\n**Recrutar:**\n*Primário*: Elite\n*Secundário*: Regular\n\nSe unidade não disponível, rotacionar como:\nElite → Regular → Nazgûl → Elite",
            nexts: ["tx_m_end"]
        },

        {
            id: "tx_m_end",
            type: "End",
            next: null
        },

        // ====================================================================
        // CHARACTER MOVE (Último recurso)
        // ====================================================================
        {
            id: "tx_c",
            type: "SetActiveDie",
            dieType: "C",
            next: "tx_c_cond",
            noDie: "tx_return",
            mayUseRing: true
        },

        {
            id: "tx_c_cond",
            type: "BinaryCondition",
            message: "Uma *ameaça* está sitiando um stronghold Shadow cuja liderança de exército é menor que 5 e menor que o número de unidades de exército?",
            nexts: ["tx_c_1", "tx_return"]
        },

        {
            id: "tx_c_1",
            type: "JumpToGraph",
            targetGraph: "character_move",
            returnTo: "tx_return"
        },

        // ====================================================================
        // RETORNO
        // ====================================================================
        {
            id: "tx_return",
            type: "ReturnFromGraph",
            next: null
        }
    ]
};
