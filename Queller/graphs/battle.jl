@graphs begin
	def_card_prio = """
	Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta. Se nenhuma carta corresponder aos 4 primeiros itens na lista de prioridades, não jogue nenhuma carta.

	Prioridade:
	1. Carta de Estratégia que cancela a carta dos Povos Livres
	2. Não usa o termo "Sociedade revelada"
	3. Não adiciona uma peça de caçada ou corrupção
	4. Carta de Personagem
	5. Ordem crescente de iniciativa
	6. Aleatório

	Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.
	"""

	sortie_card_prio = """
	Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta. Se nenhuma carta corresponder aos 2 primeiros itens na lista de prioridades, não jogue nenhuma carta.

	Prioridade:
	1. Carta de Personagem que não usa o termo "Sociedade revelada"
	2. Carta de Personagem que não adiciona uma peça de caçada ou corrupção
	3. Ordem crescente de iniciativa
	4. Aleatório

	Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.
	"""

	wk_card_prio = """
	Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta.

	Prioridade:
	1. Carta de Estratégia
	2. Bane de Durin
	3. Carta de Personagem
	4. Não usa o termo "Sociedade revelada"
	5. Não adiciona uma peça de caçada ou corrupção
	6. Ordem crescente de iniciativa
	7. Aleatório

	Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.
	"""

	attack_card_prio = """
	Depois que o jogador dos Povos Livres tiver selecionado sua carta de combate, selecione e jogue uma carta.

	Prioridade:
	1. Bane de Durin
	2. Carta de Estratégia
	3. Carta de Personagem
	4. Não usa o termo "Sociedade revelada"
	5. Não adiciona uma peça de caçada ou corrupção
	6. Ordem crescente de iniciativa
	7. Aleatório

	Se a carta selecionada exigir que unidades sejam rebaixadas ou sacrificadas, faça isso desde que o exército não se torne não-*agressivo*.
	"""


	################################################################################
	 @node battle = Start() -> rearguard
	 @node rearguard = PerformAction("Todas as unidades de nações que não estão em guerra formam a retaguarda.") -> army_attacking
	 @node army_attacking = BinaryCondition("O exército da Sombra está atacando.") -> [n_true = is_sortie, n_false = def_in_stronghold]

	 ########################################
	 @node def_in_stronghold = BinaryCondition("""
					 O exército da Sombra está se defendendo em uma região com uma fortaleza.
					 """) -> [n_true = should_retreat_to_stronghold, n_false = field_def_card_prio]
	 @node field_def_card_prio = PerformAction(def_card_prio) -> field_def_resolve
	 @node field_def_resolve = JumpToGraph("battle_resolve") -> field_attacking_fp_continues
	 @node field_attacking_fp_continues = BinaryCondition("""
														  O jogador dos Povos Livres está continuando o ataque.
														  """) -> [n_true = retreat_prio, n_false = field_def_end]
	 @node retreat_prio = PerformAction("""
				   Retirar-se do combate para a região de acordo com a seguinte prioridade.

				   Prioridade:
				   1. Não cria uma *ameaça*
				   2. Reduz distância para região *alvo* ou *exposta*
				   3. Aumenta o número de exércitos *móveis*
				   4. Aumenta o número de exércitos *agressivos*
				   5. Contém um assentamento
				   6. Contém o exército de maior *valor*
				   7. Adjacente ao exército de maior *valor*
				   8. Aleatório
				   """) -> field_def_end
	 @node field_def_end = End("Fim da Batalha") -> []


	 ########################################
	 @node should_retreat_to_stronghold = BinaryCondition("""
					 O exército da Sombra não está sob cerco.
					 E, o *valor* é menor ou igual ao do exército atacante.
					 E, o número de unidades é menor que 8.
					 """) -> [n_true = retreat_to_stronghold, n_false = def_card_prio]
	 @node def_card_prio = PerformAction(def_card_prio) -> def_resolve
	 @node def_resolve = JumpToGraph("battle_resolve") -> attacking_fp_continues
	 @node attacking_fp_continues = BinaryCondition("""
													O jogador dos Povos Livres está continuando o ataque.
													""") -> [n_true = should_retreat_to_stronghold, n_false = def_end]
	 @node def_end = End("Fim da Batalha") -> []

	 @node retreat_to_stronghold = PerformAction("Retirar-se para dentro da fortaleza.") -> retreat_stronghold_end
	 @node retreat_stronghold_end = End("Fim da Batalha") -> []


	 ########################################
	 @node is_sortie = BinaryCondition("A batalha é uma sortida.") -> [n_true = sortie_card_prio, n_false = army_with_wk]
	 @node sortie_card_prio = PerformAction(sortie_card_prio) -> sortie_resolve
	 @node sortie_resolve = JumpToGraph("battle_resolve") -> sortie_round_end
	 @node sortie_round_end = JumpToGraph("battle_round_end") -> sortie_card_prio


	 ########################################
	 @node army_with_wk = BinaryCondition("O exército inclui o Rei Bruxo.") -> [n_true = wk_card_prio, n_false = should_play_card]
	 @node wk_card_prio = PerformAction(wk_card_prio) -> wk_resolve
	 @node wk_resolve = JumpToGraph("battle_resolve") -> wk_round_end
	 @node wk_round_end = JumpToGraph("battle_round_end") -> should_play_card


	 ########################################
	 @node should_play_card = BinaryCondition("""
					 A Sombra está conduzindo um cerco.
					 Ou, a Sombra está segurando mais de 4 cartas.
					 """) -> [n_true = attack_card_prio, n_false = attack_play_no_card]

	 @node attack_card_prio = PerformAction(attack_card_prio) -> attack_resolve
	 @node attack_play_no_card = PerformAction("Não jogar uma carta de combate.") -> attack_resolve
	 @node attack_resolve = JumpToGraph("battle_resolve") -> attack_round_end
	 @node attack_round_end = JumpToGraph("battle_round_end") -> should_play_card


	 ################################################################################
	 @node battle_resolve = Start() -> roll
	 @node roll = PerformAction("Rolar para combate e rerolar erros.") -> casualties
	 @node casualties = PerformAction("""
				   Remover baixas.

				   Prioridade:
				   1. Maximiza efeito da carta jogada
				   2. Retém o maior *valor* de exército com o menor número de unidades
				   3. Mantém uma unidade de cada nação
				   4. Aleatório
				   """) -> battle_resolve_return
	 @node battle_resolve_return = ReturnFromGraph() -> []




	 ################################################################################
	 @node battle_round_end = Start() -> is_fp_dead
	 @node is_fp_dead = BinaryCondition("Há unidades dos Povos Livres restantes.") -> [n_true = press_on, n_false = no_fp_left]
	 @node no_fp_left = BinaryCondition("""
					 Mover para a região conquistada:
					 - venceria o jogo; ou
					 - diminuiria a distância para o *alvo*; ou
					 - removeria uma *ameaça*.
					 """) -> [n_true = move_into_conquered, n_false = end_without_moving]

	 @node move_into_conquered = PerformAction("Mover o maior *valor* possível para a região conquistada.") -> move_into_conquered_end
	 @node move_into_conquered_end = End("Fim da Batalha") -> []


	 @node end_without_moving = PerformAction("Não mover nenhuma unidade para a região conquistada.") -> end_without_moving_end
	 @node end_without_moving_end = End("Fim da Batalha") -> []


	 @node press_on = BinaryCondition("""
					 Uma batalha de campo foi lutada.
					 """) -> [n_true = aggressive_if_continue, n_false = mili_strat]
	 @node mili_strat = CheckStrategy("military") -> [n_true = aggressive_if_continue, n_false = press_on_2]
	 @node press_on_2 = BinaryCondition("""
					 A Sociedade está na trilha de Mordor.
					 """) -> [n_true = another_round_if_possible, n_false = no_more_round]
	 @node aggressive_if_continue = BinaryCondition("""
					 O exército da Sombra é *agressivo* e, se uma batalha de cerco estiver sendo lutada, permaneceria *agressivo* após um rebaixamento de Elite para continuar a batalha.
					 """) -> [n_true = another_round_if_possible, n_false = no_more_round_2]
	 @node another_round_if_possible = BinaryCondition("Uma batalha de cerco está sendo lutada e o exército da Sombra não tem Elites restantes") -> [n_true = no_more_round_2, n_false = one_more_round]
	 @node one_more_round = PerformAction("Continuar a batalha, rebaixar uma Elite se necessário.") -> one_more_round_return
	 @node one_more_round_return = ReturnFromGraph() -> []


	 @node no_more_round = PerformAction("Encerrar batalha") -> no_more_round_end
	 @node no_more_round_end = End("Fim da Batalha") -> []

	 @node no_more_round_2 = PerformAction("Encerrar batalha") -> no_more_round_end_2
	 @node no_more_round_end_2 = End("Fim da Batalha") -> []

end
