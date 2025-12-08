@graphs begin
	generic_move = """
	Mover de acordo com a última declaração. Selecionar exército aleatoriamente se vários puderem realizar tal movimento.
	"""

	settlement_cond = """
	Um exército pode se mover para um assentamento vazio de uma nação em guerra.
	"""
	settlement_cond_2 = """
	Um exército pode se mover para um assentamento vazio de uma nação em guerra, sem aumentar a distância para seu *alvo* (o *alvo* pode mudar).
	"""
	settlement_move_unit = """
	Mover 1 unidade para um assentamento vazio de nação em guerra.

	Prioridade de exército: Aleatório

	Prioridade de unidade:
	1. Regular
	2. Elite
	3. Aleatório
	"""

	merge_cond = """
	Dois exércitos, onde pelo menos um não é *móvel*, podem se fundir.
	E, fundir os exércitos aumentaria o número de exércitos *móveis*.
	Ou, o exército fundido teria maior *valor* do que qualquer um dos dois atualmente tem.
	"""

	merge_move = """
	Fundir dois exércitos.

	Prioridade:
	1. Fusão diminui maior distância para *alvo* (*alvo* pode mudar)
	2. Maior *valor* do exército resultante
	3. Move o exército mais distante de seu *alvo*
	4. Menor número de unidades deixadas para trás após movimento
	5. Região onde exércitos se fundem contém uma fortaleza
	6. Aleatório
	"""

	move_target_cond = """
	Um exército *móvel* pode se mover ou atacar em direção ao seu *alvo*.
	"""

	move_target = """
	Selecionar um exército *móvel* e mover ou atacar em direção ao *alvo*.

	Prioridade:
	1. Exército está adjacente ao seu *alvo*
	2. *Alvo* do exército está em uma nação em guerra
	3. Movimento/ataque não ativa uma nação
	4. Movimento/ataque não muda uma nação para "em guerra"
	5. Exército cujo *alvo* está mais alto na lista de prioridades na definição de *alvo*
	6. Exército com maior *valor*
	7. Movimento/ataque não bloqueia a rota mais curta de outro exército *móvel* para seu *alvo*
	8. Região de destino contém a Sociedade
	9. Aleatório
	"""

	basic_move_cond = """
	Um exército da Sombra está no tabuleiro.
	"""

	basic_move = """
	Mover um exército.

	Prioridade:
	1. Movimento não muda uma nação para "em guerra"
	2. Fundir dois exércitos para criar o maior *valor* de exército possível
	3. *Alvo* do exército é adjacente a um exército da Sombra passivo
	4. Movimento termina adjacente a outro exército da Sombra
	5. Diminui distância para *alvo* (*alvo* pode mudar)
	6. Exército com maior *valor*
	7. Aleatório
	"""

	one_move_left_on_die = """
	O Dado de Exército tem um movimento restante.
	"""

	################################################################################
	@node movement_attack_besiege = Start() -> mv_1

	@node mv_1 = BinaryCondition("""
								 Um exército *móvel* está adjacente ao *alvo* não sob cerco.
								 """) -> [n_true = mv_1_yes, n_false = mv_1_return]
	@node mv_1_return = ReturnFromGraph() -> []
	@node mv_1_yes = UseActiveDie() -> mv_1_action
	@node mv_1_action = PerformAction("""
									  Atacar com exército adjacente ao *alvo* não sob cerco.

									  Prioridade:
									  1. Exército cujo *alvo* está em uma nação em guerra
									  2. Exército cujo ataque não colocaria uma nação em guerra.
									  3. Exército cujo *alvo* está em uma nação ativa
									  4. Exército de maior *valor*
									  5. Aleatório
									  """) -> mv_1_end
	@node mv_1_end = End() -> []




	################################################################################
	@node movement_attack_corr = Start() -> mv_2
	@node mv_2 = BinaryCondition("""
								 Há Olhos na reserva de caçada.
								 E, nenhum exército está na região da Sociedade
								 E, a Sociedade não alcança Mordor com o progresso atual.
								 E, um exército pode se mover para a região da Sociedade sem aumentar a distância para seu *alvo* (o *alvo* pode mudar).
								 """) -> [n_true = mv_2_yes, n_false = mv_3]
	@node mv_2_yes = UseActiveDie() -> mv_2_action
	@node mv_2_action = PerformAction(generic_move) -> mv_2_army_die_to_move
	@node mv_2_army_die_to_move = CheckActiveDie('A') -> [n_true=mv_2_movement_remains, n_false=mv_2_end]
	@node mv_2_movement_remains = BinaryCondition(one_move_left_on_die) -> [n_true = mv_2, n_false = mv_2_end]
	@node mv_2_end = End() -> []


	########################################
	@node mv_3 = BinaryCondition(settlement_cond) -> [n_true = mv_3_1, n_false = mv_4]
	@node mv_3_1 = BinaryCondition(settlement_cond_2) -> [n_true = mv_3_yes, n_false = mv_3_no]
	@node mv_3_yes = UseActiveDie() -> mv_3_yes_action
	@node mv_3_yes_action = PerformAction(generic_move) -> mv_3_movement_remains
	@node mv_3_no = UseActiveDie() -> mv_3_no_action
	@node mv_3_no_action = PerformAction(settlement_move_unit) -> mv_3_army_die_to_move
	@node mv_3_army_die_to_move = CheckActiveDie('A') -> [n_true=mv_3_movement_remains, n_false=mv_3_end]
	@node mv_3_movement_remains = BinaryCondition(one_move_left_on_die) -> [n_true = mv_3, n_false = mv_3_end]
	@node mv_3_end = End() -> []


	########################################
	@node mv_4 = BinaryCondition(merge_cond) -> [n_true = mv_4_yes, n_false = mv_5]
	@node mv_4_yes = UseActiveDie() -> mv_4_action
	@node mv_4_action = PerformAction(merge_move) -> mv_4_army_die_to_move
	@node mv_4_army_die_to_move = CheckActiveDie('A') -> [n_true=mv_4_movement_remains, n_false=mv_4_end]
	@node mv_4_movement_remains = BinaryCondition(one_move_left_on_die) -> [n_true = mv_4, n_false = mv_4_end]
	@node mv_4_end = End() -> []



	################################################################################
	@node movement_attack_basic = Start() -> mv_5
	@node mv_5 = BinaryCondition(move_target_cond) -> [n_true = mv_5_yes, n_false = mv_6]
	@node mv_5_yes = UseActiveDie() -> mv_5_action
	@node mv_5_action = PerformAction(move_target) -> mv_5_army_die_to_move
	@node mv_5_army_die_to_move = CheckActiveDie('A') -> [n_true=mv_5_movement_remains, n_false=mv_5_end]
	@node mv_5_movement_remains = BinaryCondition(one_move_left_on_die) -> [n_true = mv_5, n_false = mv_5_end]
	@node mv_5_end = End() -> []


	########################################
	@node mv_6 = BinaryCondition(basic_move_cond) -> [n_true = mv_6_yes, n_false = mv_6_return_okay]

	@node mv_6_return_okay = BinaryCondition("""
											 Um Dado de Exército foi usado com um movimento restante.
											 """) -> [n_true = mv_6_return_end, n_false = mv_6_return]
	@node mv_6_return_end = End() -> []
	@node mv_6_return = ReturnFromGraph() -> []

	@node mv_6_yes = UseActiveDie() -> mv_6_action
	@node mv_6_action = PerformAction(basic_move) -> mv_6_army_die_to_move
	@node mv_6_army_die_to_move = CheckActiveDie('A') -> [n_true=mv_6_movement_remains, n_false=mv_6_end]
	@node mv_6_movement_remains = BinaryCondition(one_move_left_on_die) -> [n_true = mv_6, n_false = mv_6_end]
	@node mv_6_end = End() -> []


	################################################################################
	@node movement_attack_card = Start() -> mv_c_1

	@node mv_c_1 = BinaryCondition(settlement_cond) -> [n_true = mv_c_1_1, n_false = mv_c_2]
	@node mv_c_1_1 = BinaryCondition(settlement_cond_2) -> [n_true = mv_c_1_army, n_false = mv_c_1_unit]
	@node mv_c_1_army = PerformAction(generic_move) -> mv_c_1_army_end
	@node mv_c_1_army_end = End() -> []

	@node mv_c_1_unit = PerformAction(settlement_move_unit) -> mv_c_1_unit_end
	@node mv_c_1_unit_end = End() -> []

	@node mv_c_2 = BinaryCondition(merge_cond) -> [n_true = mv_c_2_move, n_false = mv_c_3]
	@node mv_c_2_move = PerformAction(merge_move) -> mv_c_2_end
	@node mv_c_2_end = End() -> []

	@node mv_c_3 = BinaryCondition(move_target_cond) -> [n_true = mv_c_3_move, n_false = mv_c_4_move]
	@node mv_c_3_move = PerformAction(move_target) -> mv_c_3_end
	@node mv_c_3_end = End() -> []

	@node mv_c_4_move = PerformAction(basic_move) -> mv_c_4_end
	@node mv_c_4_end = End() -> []

end
