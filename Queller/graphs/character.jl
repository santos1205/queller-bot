@graphs begin
	move_wk_cond = """
	O Rei Bruxo não está em um exército *móvel*, mas é capaz de se juntar ou criar um.
	"""

	wk_prio = """
	Mover o Rei Bruxo, colocá-lo em uma região válida com um exército.

	Prioridade:
	1. Exército é *móvel*
	2. *Alvo* do exército está em nação em guerra
	3. Exército se torna *móvel* se o Rei Bruxo for adicionado
	4. Exército dos Povos Livres no *alvo* ou na rota para o *alvo* não contém Gandalf, o Branco
	5. Exército dos Povos Livres no *alvo* ou na rota para o *alvo* não contém um hobbit
	6. Exército está adjacente a uma *ameaça*
	7. Exército que está conduzindo um cerco
	8. Exército está adjacente ao seu *alvo*
	9. Exército da Sombra de maior *valor*
	10. Aleatório
	"""

	move_nazgul_cond = """
	Nenhum Nazgûl está na região da Sociedade, mas eles podem se mover para lá.
	Ou, um Nazgûl está em um exército não-*móvel*, mas é capaz de se juntar ou criar um.
	"""

	nazgul_prio = """
	Reunir todos os Nazgûl e colocá-los um de cada vez.

	Prioridade:
	1. Um, e apenas um, na região da Sociedade
	2. Exército com *valor* de liderança menor que o número de unidades do exército e menor que 5
	3. Exército que contém o Rei Bruxo
	4. Fortaleza da Sombra sob cerco
	5. Exército *móvel*
	6. Exército adjacente a *ameaça*
	7. Exército cujo *alvo* de nação está ativo
	8. Exército que se torna *móvel* se Nazgûl for adicionado
	9. Exército que não está sitiando
	10. Exército que está adjacente ao seu *alvo*
	11. Exército da Sombra de maior *valor*
	12. Aleatório
	"""

	move_mos_cond = """
	Boca de Sauron não está em um exército *móvel*.
	"""

	mos_prio = """
	Mover Boca de Sauron.

	Prioridade:
	1. Em direção a exército com *valor* de liderança menor que o número de unidades do exército e 5
	2. Em direção a exército *móvel*
	3. Em direção a exército adjacente ao seu *alvo*
	4. Exército que pode ser alcançado com este dado
	5. Em direção ao exército mais próximo
	6. Aleatório
	"""

	################################################################################
	@node character_army = Start() -> lc_1

	@node lc_1 = BinaryCondition("""
								 Um exército *agressivo* com o Rei Bruxo ou liderança máxima está adjacente ao seu *alvo*.
								 """) -> [n_true = lc_1_yes, n_false = lc_2]
	@node lc_1_yes = UseActiveDie() -> lc_1_action
	@node lc_1_action = PerformAction("""
									  Atacar de acordo com a última declaração. Selecionar exército aleatoriamente se vários puderem realizar tal ataque.
									  """) -> lc_1_end
	@node lc_1_end = End() -> []

	@node lc_2 = BinaryCondition("""
								 Um exército *móvel* com liderança e um movimento/ataque válido em direção ao *alvo* existe.
								 """) -> [n_true = lc_2_yes, n_false = lc_3]
	@node lc_2_yes = JumpToGraph("movement_attack_basic") -> lc_3


	################################################################################
	@node character_move = Start() -> lc_3
	@node lc_3 = BinaryCondition("""
								 Um Nazgûl ou o Rei Bruxo está em jogo.
								 """) -> [n_true = lc_wk, n_false = lc_3_no]
	@node lc_3_no = JumpToGraph("event_cards_preferred") -> lc_3_return
	@node lc_3_return = ReturnFromGraph() -> []


	########################################
	@node character_which_king = Start() -> lc_wk_yes

	@node lc_wk = BinaryCondition(move_wk_cond) -> [n_true = lc_wk_yes, n_false = lc_naz_1]
	@node lc_wk_yes = UseActiveDie() -> lc_wk_action
	@node lc_wk_action = PerformAction(wk_prio) -> lc_naz_2


	########################################
	@node lc_naz_1 = BinaryCondition(move_nazgul_cond) -> [n_true = lc_naz_1_yes, n_false = lc_mos_1]
	@node lc_naz_1_yes = UseActiveDie() -> lc_naz_1_action
	@node lc_naz_1_action = PerformAction(nazgul_prio) -> lc_mos_2

	@node lc_naz_2 = BinaryCondition(move_nazgul_cond) -> [n_true = lc_naz_2_yes, n_false = lc_mos_3]
	@node lc_naz_2_yes = UseActiveDie() -> lc_naz_2_action
	@node lc_naz_2_action = PerformAction(nazgul_prio) -> lc_mos_4


	########################################
	@node lc_mos_1 = BinaryCondition(move_mos_cond) -> [n_true = lc_mos_1_yes, n_false = lc_play_card]
	@node lc_mos_1_yes = UseActiveDie() -> lc_mos_1_action
	@node lc_mos_1_action = PerformAction(mos_prio) -> lc_mos_end_1

	@node lc_mos_2 = BinaryCondition(move_mos_cond) -> [n_true = lc_mos_2_yes, n_false = lc_mos_end_2]
	@node lc_mos_2_yes = UseActiveDie() -> lc_mos_2_action
	@node lc_mos_2_action = PerformAction(mos_prio) -> lc_mos_end_2

	@node lc_mos_3 = BinaryCondition(move_mos_cond) -> [n_true = lc_mos_3_yes, n_false = lc_mos_end_3]
	@node lc_mos_3_yes = UseActiveDie() -> lc_mos_3_action
	@node lc_mos_3_action = PerformAction(mos_prio) -> lc_mos_end_3

	@node lc_mos_4 = BinaryCondition(move_mos_cond) -> [n_true = lc_mos_4_yes, n_false = lc_mos_end_4]
	@node lc_mos_4_yes = UseActiveDie() -> lc_mos_4_action
	@node lc_mos_4_action = PerformAction(mos_prio) -> lc_mos_end_4

	@node lc_mos_end_1 = End() -> []
	@node lc_mos_end_2 = End() -> []
	@node lc_mos_end_3 = End() -> []
	@node lc_mos_end_4 = End() -> []


	########################################
	@node lc_play_card = JumpToGraph("event_cards_preferred") -> lc_play_card_return
	@node lc_play_card_return = ReturnFromGraph() -> []


	################################################################################
	@node character_wk_prio = Start() -> lc_wk_prio
	@node lc_wk_prio = PerformAction(wk_prio) -> lc_wk_prio_end
	@node lc_wk_prio_end = End() -> []


	################################################################################
	@node character_nazgul_prio = Start() -> lc_nazgul_prio
	@node lc_nazgul_prio = PerformAction(nazgul_prio) -> lc_nazgul_prio_end
	@node lc_nazgul_prio_end = End() -> []


	################################################################################
	@node character_mos_prio = Start() -> lc_mos_prio
	@node lc_mos_prio = PerformAction(mos_prio) -> lc_mos_prio_end
	@node lc_mos_prio_end = End() -> []
end
