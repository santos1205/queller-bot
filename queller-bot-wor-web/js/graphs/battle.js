/**
 * Battle Graph - Batalha e Resolução
 * 
 * Este grafo gerencia toda a lógica de batalha do automa, incluindo:
 * - Seleção de cartas de combate (defesa, sortida, Witch King, ataque)
 * - Resolução de batalha (rolagem e baixas)
 * - Fim de rodada (decisão de continuar ou encerrar)
 * - Retirada estratégica
 * - Movimento pós-conquista
 * 
 * Estrutura:
 * - battle: Fluxo principal da batalha (29 nós)
 * - battle_resolve: Resolução de rodada (4 nós)
 * - battle_round_end: Fim de rodada e decisões (19 nós)
 * 
 * Total: 52 nós
 */

// Constantes de texto para prioridades de cartas
const DEF_CARD_PRIO = `Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta. Se nenhuma carta corresponder aos 4 primeiros itens na lista de prioridades, não jogue nenhuma carta.

Prioridade:
1. Carta de Estratégia que cancela a carta dos Povos Livres
2. Não usa o termo "Sociedade revelada"
3. Não adiciona uma peça de caçada ou corrupção
4. Carta de Personagem
5. Ordem crescente de iniciativa
6. Aleatório

Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.`;

const SORTIE_CARD_PRIO = `Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta. Se nenhuma carta corresponder aos 2 primeiros itens na lista de prioridades, não jogue nenhuma carta.

Prioridade:
1. Carta de Personagem que não usa o termo "Sociedade revelada"
2. Carta de Personagem que não adiciona uma peça de caçada ou corrupção
3. Ordem crescente de iniciativa
4. Aleatório

Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.`;

const WK_CARD_PRIO = `Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta.

Prioridade:
1. Carta de Estratégia
2. Bane de Durin
3. Carta de Personagem
4. Não usa o termo "Sociedade revelada"
5. Não adiciona uma peça de caçada ou corrupção
6. Ordem crescente de iniciativa
7. Aleatório

Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.`;

const ATTACK_CARD_PRIO = `Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta.

Prioridade:
1. Bane de Durin
2. Carta de Estratégia
3. Carta de Personagem
4. Não usa o termo "Sociedade revelada"
5. Não adiciona uma peça de caçada ou corrupção
6. Ordem crescente de iniciativa
7. Aleatório

Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.`;

const RETREAT_PRIO = `Retirar-se do combate para a região de acordo com a seguinte prioridade.

Prioridade:
1. Não cria uma *ameaça*
2. Reduz distância para região *alvo* ou *exposta*
3. Aumenta o número de exércitos *móveis*
4. Aumenta o número de exércitos *agressivos*
5. Contém um assentamento
6. Contém o exército de maior *valor*
7. Adjacente ao exército de maior *valor*
8. Aleatório`;

const CASUALTIES_PRIO = `Remover baixas.

Prioridade:
1. Maximiza efeito da carta jogada
2. Retém o maior *valor* de exército com o menor número de unidades
3. Mantém uma unidade de cada nação
4. Aleatório`;

// ========================================
// EXPORT JSON - BATTLE
// ========================================

const battle = {
    name: "battle",
    startNode: "battle",
    nodes: [
        // Start
        { id: "battle", type: "Start", next: "rearguard" },
        { id: "rearguard", type: "PerformAction", message: "Todas as unidades de nações que não estão em guerra formam a retaguarda.", nexts: ["army_attacking"] },
        { id: "army_attacking", type: "BinaryCondition", message: "O exército da Sombra está atacando.", nexts: ["is_sortie", "def_in_stronghold"] },
        
        // Defesa em campo
        { id: "def_in_stronghold", type: "BinaryCondition", message: "O exército da Sombra está se defendendo em uma região com uma fortaleza.", nexts: ["should_retreat_to_stronghold", "field_def_card_prio"] },
        { id: "field_def_card_prio", type: "PerformAction", message: DEF_CARD_PRIO, nexts: ["field_def_resolve"] },
        { id: "field_def_resolve", type: "JumpToGraph", targetGraph: "battle_resolve", returnTo: "field_attacking_fp_continues" },
        { id: "field_attacking_fp_continues", type: "BinaryCondition", message: "O jogador dos Povos Livres está continuando o ataque.", nexts: ["retreat_prio", "field_def_end"] },
        { id: "retreat_prio", type: "PerformAction", message: RETREAT_PRIO, nexts: ["field_def_end"] },
        { id: "field_def_end", type: "End", message: "Fim da Batalha" },
        
        // Defesa em fortaleza
        { id: "should_retreat_to_stronghold", type: "BinaryCondition", message: "O exército da Sombra não está sob cerco.\nE, o *valor* é menor ou igual ao do exército atacante.\nE, o número de unidades é menor que 8.", nexts: ["retreat_to_stronghold", "def_card_prio"] },
        { id: "def_card_prio", type: "PerformAction", message: DEF_CARD_PRIO, nexts: ["def_resolve"] },
        { id: "def_resolve", type: "JumpToGraph", targetGraph: "battle_resolve", returnTo: "attacking_fp_continues" },
        { id: "attacking_fp_continues", type: "BinaryCondition", message: "O jogador dos Povos Livres está continuando o ataque.", nexts: ["should_retreat_to_stronghold", "def_end"] },
        { id: "def_end", type: "End", message: "Fim da Batalha" },
        { id: "retreat_to_stronghold", type: "PerformAction", message: "Retirar-se para dentro da fortaleza.", nexts: ["retreat_stronghold_end"] },
        { id: "retreat_stronghold_end", type: "End", message: "Fim da Batalha" },
        
        // Sortida
        { id: "is_sortie", type: "BinaryCondition", message: "A batalha é uma sortida.", nexts: ["sortie_card_prio", "army_with_wk"] },
        { id: "sortie_card_prio", type: "PerformAction", message: SORTIE_CARD_PRIO, nexts: ["sortie_resolve"] },
        { id: "sortie_resolve", type: "JumpToGraph", targetGraph: "battle_resolve", returnTo: "sortie_round_end" },
        { id: "sortie_round_end", type: "JumpToGraph", targetGraph: "battle_round_end", returnTo: "sortie_card_prio" },
        
        // Witch King
        { id: "army_with_wk", type: "BinaryCondition", message: "O exército inclui o Rei Bruxo.", nexts: ["wk_card_prio", "should_play_card"] },
        { id: "wk_card_prio", type: "PerformAction", message: WK_CARD_PRIO, nexts: ["wk_resolve"] },
        { id: "wk_resolve", type: "JumpToGraph", targetGraph: "battle_resolve", returnTo: "wk_round_end" },
        { id: "wk_round_end", type: "JumpToGraph", targetGraph: "battle_round_end", returnTo: "should_play_card" },
        
        // Ataque normal
        { id: "should_play_card", type: "BinaryCondition", message: "A Sombra está conduzindo um cerco.\nOu, a Sombra está segurando mais de 4 cartas.", nexts: ["attack_card_prio", "attack_play_no_card"] },
        { id: "attack_card_prio", type: "PerformAction", message: ATTACK_CARD_PRIO, nexts: ["attack_resolve"] },
        { id: "attack_play_no_card", type: "PerformAction", message: "Não jogar uma carta de combate.", nexts: ["attack_resolve"] },
        { id: "attack_resolve", type: "JumpToGraph", targetGraph: "battle_resolve", returnTo: "attack_round_end" },
        { id: "attack_round_end", type: "JumpToGraph", targetGraph: "battle_round_end", returnTo: "should_play_card" }
    ]
};

// ========================================
// EXPORT JSON - BATTLE_RESOLVE
// ========================================

const battleResolve = {
    name: "battle_resolve",
    startNode: "battle_resolve",
    nodes: [
        { id: "battle_resolve", type: "Start", next: "roll" },
        { id: "roll", type: "PerformAction", message: "Rolar para combate e rerolar erros.", nexts: ["casualties"] },
        { id: "casualties", type: "PerformAction", message: CASUALTIES_PRIO, nexts: ["battle_resolve_return"] },
        { id: "battle_resolve_return", type: "ReturnFromGraph" }
    ]
};

// ========================================
// EXPORT JSON - BATTLE_ROUND_END
// ========================================

const battleRoundEnd = {
    name: "battle_round_end",
    startNode: "battle_round_end",
    nodes: [
        { id: "battle_round_end", type: "Start", next: "is_fp_dead" },
        { id: "is_fp_dead", type: "BinaryCondition", message: "Há unidades dos Povos Livres restantes.", nexts: ["press_on", "no_fp_left"] },
        
        // Vitória (sem FP restantes)
        { id: "no_fp_left", type: "BinaryCondition", message: "Mover para a região conquistada:\n- venceria o jogo; ou\n- diminuiria a distância para o *alvo*; ou\n- removeria uma *ameaça*.", nexts: ["move_into_conquered", "end_without_moving"] },
        { id: "move_into_conquered", type: "PerformAction", message: "Mover o maior *valor* possível para a região conquistada.", nexts: ["move_into_conquered_end"] },
        { id: "move_into_conquered_end", type: "End", message: "Fim da Batalha" },
        { id: "end_without_moving", type: "PerformAction", message: "Não mover nenhuma unidade para a região conquistada.", nexts: ["end_without_moving_end"] },
        { id: "end_without_moving_end", type: "End", message: "Fim da Batalha" },
        
        // Continuar batalha (FP ainda vivos)
        { id: "press_on", type: "BinaryCondition", message: "Uma batalha de campo foi lutada.", nexts: ["aggressive_if_continue", "mili_strat"] },
        { id: "mili_strat", type: "CheckStrategy", nextMilitar: "aggressive_if_continue", nextCorrupcao: "press_on_2" },
        { id: "press_on_2", type: "BinaryCondition", message: "A Sociedade está na trilha de Mordor.", nexts: ["another_round_if_possible", "no_more_round"] },
        { id: "aggressive_if_continue", type: "BinaryCondition", message: "O exército da Sombra é *agressivo* e, se uma batalha de cerco estiver sendo lutada, permaneceria *agressivo* após um rebaixamento de Elite para continuar a batalha.", nexts: ["another_round_if_possible", "no_more_round_2"] },
        { id: "another_round_if_possible", type: "BinaryCondition", message: "Uma batalha de cerco está sendo lutada e o exército da Sombra não tem Elites restantes", nexts: ["no_more_round_2", "one_more_round"] },
        { id: "one_more_round", type: "PerformAction", message: "Continuar a batalha, rebaixar uma Elite se necessário.", nexts: ["one_more_round_return"] },
        { id: "one_more_round_return", type: "ReturnFromGraph" },
        { id: "no_more_round", type: "PerformAction", message: "Encerrar batalha", nexts: ["no_more_round_end"] },
        { id: "no_more_round_end", type: "End", message: "Fim da Batalha" },
        { id: "no_more_round_2", type: "PerformAction", message: "Encerrar batalha", nexts: ["no_more_round_end_2"] },
        { id: "no_more_round_end_2", type: "End", message: "Fim da Batalha" }
    ]
};

// Registrar os grafos globalmente (padrão do projeto)
if (typeof window !== 'undefined') {
    window.battle = battle;
    window.battleResolve = battleResolve;
    window.battleRoundEnd = battleRoundEnd;
}
