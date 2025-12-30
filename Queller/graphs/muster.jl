@graphs begin
	minion_prio = """
	Selecionar um servo que pode ser recrutado.

	Prioridade:
	1. Saruman
	2. Rei Bruxo
	3. Boca de Sauron
	"""

	recruit_saruman = """
	Recrutar Saruman.
	"""

	recruit_wk = """
	Recrutar o Rei Bruxo, colocá-lo em uma região válida com um exército.

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

	recruit_mos = """
	Recrutar Boca de Sauron, colocá-lo em uma região válida com um exército ou fortaleza.

	Prioridade:
	1. Exército está conduzindo um cerco.
	2. Exército é *móvel*
	3. Exército se torna *móvel* se Boca de Sauron for adicionado
	4. Exército contém Saruman
	5. Exército com o maior *valor*
	6. Fortaleza mais próxima de exército cujo *alvo* está em uma nação em guerra
	7. Fortaleza mais próxima de exército cujo *alvo* está em uma nação ativa
	8. Fortaleza mais próxima de exército cujo *alvo* está em uma nação passiva
	9. Aleatório
	"""


	################################################################################
	@node muster_minion = Start() -> m_2_reserved_check
	@node m_2_reserved_check = BinaryCondition("""
											   A die has been reserved for recruiting a minion as a last action.
											   """) -> [n_true = m_2_return, n_false = m_2]
	@node m_2 = BinaryCondition("""
								Servo pode ser recrutado.
								""") -> [n_true = m_2_1, n_false = m_2_return]
	@node m_2_return = ReturnFromGraph() -> []

	@node m_2_1 = BinaryCondition("""
								  Os Povos Livres têm um dado Vontade do Oeste.
								  E, Gandalf, o Branco não foi recrutado.
								  E, nenhum servo foi recrutado.
								  """) -> [n_true = m_2_1_yes, n_false = m_2_minion_selection]
	@node m_2_1_yes = UseActiveDie() -> m_2_1_reserve
	@node m_2_1_reserve = PerformAction("""
										Set aside the die (and ring if necessary). Use this die as an last action to recruit a minion. Minion selection and placement can be made from the main menu of Phase 5.
										""") -> m_2_1_return
	@node m_2_1_return = ReturnFromGraph() -> []

	@node m_2_minion_selection = MultipleChoice(minion_prio) -> [m_2_saruman_die, m_2_wk_die, m_2_mos_die]

	@node m_2_saruman_die = UseActiveDie() -> m_2_saruman_placement
	@node m_2_saruman_placement = PerformAction(recruit_saruman) -> m_2_saruman_end

	@node m_2_wk_die = UseActiveDie() -> m_2_wk_placement
	@node m_2_wk_placement = PerformAction(recruit_wk) -> m_2_wk_end

	@node m_2_mos_die = UseActiveDie() -> m_2_mos_placement
	@node m_2_mos_placement = PerformAction(recruit_mos) -> m_2_mos_end

	@node m_2_saruman_end = End() -> []
	@node m_2_wk_end = End() -> []
	@node m_2_mos_end = End() -> []


	################################################################################
	@node muster_minion_selection = Start() -> m_2_minion_selection_last
	@node m_2_minion_selection_last = MultipleChoice(minion_prio) -> [m_2_saruman_last, m_2_wk_last, m_2_mos_last]

	@node m_2_saruman_last = PerformAction(recruit_saruman) -> m_2_saruman_end_last
	@node m_2_wk_last = PerformAction(recruit_wk) -> m_2_wk_end_last
	@node m_2_mos_last = PerformAction(recruit_mos) -> m_2_mos_end_last

	@node m_2_saruman_end_last = End() -> []
	@node m_2_wk_end_last = End() -> []
	@node m_2_mos_end_last = End() -> []



	################################################################################
	@node muster_politics = Start() -> m_3
	@node m_3 = BinaryCondition("Uma nação da Sombra não está em guerra.") -> [n_true = m_3_yes, n_false = m_3_return]
	@node m_3_return = ReturnFromGraph() -> []

	@node m_3_yes = UseActiveDie() -> m_3_action
	@node m_3_action = PerformAction("""
									 Mover uma nação um passo para baixo na trilha política.

									 Prioridade:
									 1. Isengard
									 2. Sauron
									 3. Sulistas e Orientais
									 """) -> m_3_end
	@node m_3_end = End() -> []





	################################################################################
	@node muster_muster = Start() -> m_4
	@node m_4 = BinaryCondition("Uma carta que mobiliza é *jogável*.") -> [n_true = m_4_die, n_false = m_5]
	@node m_4_die = UseActiveDie() -> m_4_action
	@node m_4_action = PerformAction("""
									 Jogar uma carta *jogável* de mobilização.

									 Prioridade:
									 1. Ordem crescente de iniciativa
									 2. Aleatório
									 """) -> m_4_end
	@node m_4_end = End() -> []

	@node m_5 = BinaryCondition("""
								Mobilização é possível.
								""") -> [n_true = m_6, n_false = m_return]
	@node m_return = ReturnFromGraph() -> []

	@node m_6 = BinaryCondition("Mobilização pode criar uma região *exposta*.") -> [n_true = m_6_die, n_false = m_7]
	@node m_6_die = UseActiveDie() -> m_6_action
	@node m_6_action = PerformAction("""
									 Prioridade de *Foco*:
									 1. Região que cria uma região *exposta*
									 2. Aleatório

									 Recrutar:
									 *Primário*: Elite
									 *Secundário*: Regular

									 Se unidade não estiver disponível, rotacione como:
									 Elite -> Regular -> Nazgûl -> Elite
									 """) -> m_6_end
	@node m_6_end = End() -> []


	@node m_7 = BinaryCondition("""
								A Sociedade está adjacente a, ou em, uma região onde é possível recrutar.
								E, o progresso colocou a Sociedade fora de Mordor.
								E, nenhum exército está adjacente à região atual da Sociedade.
								""") -> [n_true = m_7_die, n_false = m_8]
	@node m_7_die = UseActiveDie() -> m_7_action
	@node m_7_action = PerformAction("""
									 Prioridade de *Foco*:
									 1. Região atual da Sociedade

									 Recrutar:
									 *Primário*: Regular
									 *Secundário*: Nazgûl

									 Se unidade não estiver disponível, rotacione como:
									 Elite -> Regular -> Nazgûl -> Elite
									 """) -> m_7_end
	@node m_7_end = End() -> []


	@node m_8 = BinaryCondition("Recrutamento é possível em uma região contendo um exército da Sombra.") -> [n_true = m_8_die, n_false = m_9]
	@node m_8_die = UseActiveDie() -> m_8_action
	@node m_8_action = PerformAction("""
									 Prioridade de *Foco*:
									 1. Exército está conduzindo um cerco.
									 2. Exército é *móvel*
									 3. Exército se torna móvel se o Boca de Sauron for adicionado
									 4. Exército contém Saruman
									 5. Exército com maior *valor*
									 6. Aleatório

									 Recrutar:
									 *Primário*: Regular
									 *Secundário*: Nazgûl

									 Se unidade não estiver disponível, rotacione como:
									 Elite -> Regular -> Nazgûl -> Elite
									 """) -> m_8_end
	@node m_8_end = End() -> []


	@node m_9 = BinaryCondition("Menos de 6 Nazgûl estão em jogo.") -> [n_true = m_10_yes, n_false = m_10_no]
	@node m_10_yes = UseActiveDie() -> m_10_yes_action
	@node m_10_yes_action = PerformAction("""
										  Prioridade de *Foco*:
										  1. Mais próximo de exército cujo *alvo* está em uma nação em guerra
										  2. Mais próximo de exército cujo *alvo* está em uma nação ativa.
										  3. Mais próximo de um exército *móvel*
										  4. Mais próximo de exército cujo *alvo* está em uma nação passiva.
										  5. Aleatório

										  Recrutar:
										  *Primário*: Nazgûl
										  *Secundário*: Nazgûl

										  Se unidade não estiver disponível, rotacione como:
										  Elite -> Regular -> Nazgûl -> Elite
										  """) -> m_10_end_yes
	@node m_10_end_yes = End() -> []

	@node m_10_no = UseActiveDie() -> m_10_no_action
	@node m_10_no_action = PerformAction("""
										 Prioridade de *Foco*:
										 1. Mais próximo de exército cujo *alvo* está em uma nação em guerra
										 2. Mais próximo de exército cujo *alvo* está em uma nação ativa.
										 3. Mais próximo de um exército *móvel*
										 4. Mais próximo de exército cujo *alvo* está em uma nação passiva.
										 5. Aleatório

										 Recrutar:
										 *Primário*: Elite
										 *Secundário*: Nazgûl

										 Se unidade não estiver disponível, rotacione como:
										 Elite -> Regular -> Nazgûl -> Elite
										 """) -> m_10_end_no
	@node m_10_end_no = End() -> []




	################################################################################

	@node muster_card = Start() -> m_c_6
	@node m_c_6 = BinaryCondition("Recrutamento pode criar uma região *exposta*.") -> [n_true = m_c_6_action, n_false = m_c_7]
	@node m_c_6_action = PerformAction("""
									   Prioridade de *Foco*:
									   1. Região que cria uma região *exposta*
									   2. Aleatório

									   Recrutar:
									   *Primário*: Unidades de acordo com a carta
									   *Secundário*: Unidades de acordo com a carta
									   """) -> m_c_6_end
	@node m_c_6_end = End() -> []

	@node m_c_7 = BinaryCondition("""
								  A Sociedade está adjacente a, ou em, uma região onde é possível recrutar.
								  E, o progresso colocou a Sociedade fora de Mordor.
								  E, nenhum exército está adjacente à região atual da Sociedade.
								  """) -> [n_true = m_c_7_action, n_false = m_c_8]
	@node m_c_7_action = PerformAction("""
									   Prioridade de *Foco*:
									   1. Região atual da Sociedade

									   Recrutar:
									   *Primário*: Unidades de acordo com a carta
									   *Secundário*: Unidades de acordo com a carta
									   """) -> m_c_7_end
	@node m_c_7_end = End() -> []


	@node m_c_8 = BinaryCondition("""
								  Recrutamento é possível em uma região contendo um exército da Sombra.
								  """) -> [n_true = m_c_8_action, n_false = m_c_9]
	@node m_c_8_action = PerformAction("""
									   Prioridade de *Foco*:
									   1. Exército é *móvel*
									   2. *Alvo* do exército está em uma nação em guerra
									   3. Exército se torna móvel se o Rei dos Bruxos for adicionado
									   4. Exército dos Povos Livres no *alvo* ou na rota para o *alvo* não contém Gandalf, o Branco
									   5. Exército com maior *valor*
									   6. Aleatório

									   Recrutar:
									   *Primário*: Unidades de acordo com a carta
									   *Secundário*: Unidades de acordo com a carta
									   """) -> m_c_8_end
	@node m_c_8_end = End() -> []


	@node m_c_9 = PerformAction("""
								Prioridade de *Foco*:
								1. Mais próximo de exército cujo *alvo* está em uma nação em guerra
								2. Mais próximo de exército cujo *alvo* está em uma nação ativa.
								3. Mais próximo de um exército *móvel*
								4. Mais próximo de exército cujo *alvo* está em uma nação passiva.
								5. Aleatório

								Recrutar:
								*Primário*: Unidades de acordo com a carta
								*Secundário*: Unidades de acordo com a carta
								""") -> m_c_9_end
	@node m_c_9_end = End() -> []

end
