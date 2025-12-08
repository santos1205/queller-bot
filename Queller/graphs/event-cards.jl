@graphs begin
	 ################################################################################
	 @node event_cards_preferred = Start() -> ep_1_strat

	 @node ep_1_strat = CheckStrategy("military") -> [n_true = ep_1_mili, n_false = ep_1_corr]
	 @node ep_1_mili = BinaryCondition("""
					 Uma carta com tipo exército ou mobilização é *jogável*.
					 """) -> [n_true = ep_2_yes, n_false = ep_return]
	 @node ep_1_corr = BinaryCondition("""
					 Uma carta com tipo personagem é *jogável*.
					 """) -> [n_true = ep_2_yes, n_false = ep_return]

	 @node ep_return = ReturnFromGraph() -> []
	 @node ep_2_yes = UseActiveDie() -> ep_2_strat
	 @node ep_2_strat = CheckStrategy("military") -> [n_true = ep_2_mili, n_false = ep_2_corr]
	 @node ep_2_mili = PerformAction("""
				   Jogar uma carta *jogável* com tipo mobilização ou exército.

				   Prioridade:
				   1. Ordem Crescente de Iniciativa
				   2. Aleatório
				   """) -> ep_2_end
	 @node ep_2_corr = PerformAction("""
				   Jogar uma carta *jogável* com tipo personagem.

				   Prioridade:
				   1. Ordem Crescente de Iniciativa
				   2. Aleatório
				   """) -> ep_2_end
	 @node ep_2_end = End() -> []


	 ################################################################################
	 @node event_cards_general = Start() -> eg_1
	 @node eg_1 = BinaryCondition("""
					 Segurando menos de 4 cartas.
					 """) -> [n_true = eg_1_yes, n_false = eg_2]
	 @node eg_1_yes = UseActiveDie() -> eg_1_strat
	 @node eg_1_strat = CheckStrategy("military") -> [n_true = eg_1_mili, n_false = eg_1_corr]
	 @node eg_1_mili = PerformAction("""
				   Comprar uma carta de estratégia.
				   """) -> eg_1_end
	 @node eg_1_corr = PerformAction("""
				   Comprar uma carta de personagem.
				   """) -> eg_1_end
	 @node eg_1_end = End() -> []


	 @node eg_2 = BinaryCondition("""
					 Uma carta é *jogável*.
					 """) -> [n_true = eg_2_yes, n_false = eg_3]
	 @node eg_2_yes = UseActiveDie() -> eg_2_action
	 @node eg_2_action = PerformAction("""
				   Jogar uma carta *jogável*.

				   Prioridade:
				   1. Ordem crescente de iniciativa
				   2. Aleatório
				   """) -> eg_2_end
	 @node eg_2_end = End() -> []


	 @node eg_3 = UseActiveDie() -> eg_3_strat
	 @node eg_3_strat = CheckStrategy("military") -> [n_true = eg_3_mili, n_false = eg_3_corr]
	 @node eg_3_mili = PerformAction("""
				   Comprar uma carta de estratégia.
				   """) -> eg_3_discard
	 @node eg_3_corr = PerformAction("""
				   Comprar uma carta de personagem.
				   """) -> eg_3_discard
	 @node eg_3_discard = BinaryCondition("""
					 Segurando mais de 6 cartas.
					 """) -> [n_true = eg_3_discard_strat, n_false = eg_3_end]
	 @node eg_3_end = End() -> []

	 @node eg_3_discard_strat = CheckStrategy("military") -> [n_true = eg_3_discard_mili, n_false = eg_3_discard_corr]
	 @node eg_3_discard_mili = PerformAction("""
				   Descartar até 6 cartas.

				   Prioridade:
				   1. Não é uma carta com tipo exército ou mobilização
				   2. Não usa o termo "Sociedade revelada"
				   3. Não coloca uma peça
				   4. Ordem crescente de iniciativa
				   5. Aleatório
				   """) -> eg_3_discard_end
	 @node eg_3_discard_corr = PerformAction("""
				   Descartar até 6 cartas.

				   Prioridade:
				   1. Não é uma carta com tipo personagem
				   2. Não usa o termo "Sociedade revelada"
				   3. Não coloca uma peça
				   4. Ordem crescente de iniciativa
				   5. Aleatório
				   """) -> eg_3_discard_end
	 @node eg_3_discard_end = End() -> []


	 ################################################################################
	 @node event_cards_corruption = Start() -> ec_1
	 @node ec_1 = BinaryCondition("""
					 Uma carta "Sociedade revelada" é *jogável*.
					 """) -> [n_true = ec_1_yes, n_false = ec_2]
	 @node ec_1_yes = UseActiveDie() -> ec_1_action
	 @node ec_1_action = PerformAction("""
				   Jogar uma carta *jogável* "Sociedade revelada".

				   Prioridade:
				   1. Ordem crescente de iniciativa
				   2. Aleatório
				   """) -> ec_1_end
	 @node ec_1_end = End() -> []

	 @node ec_2 = BinaryCondition("""
					 Uma carta que adiciona corrupção ou adiciona uma peça de caçada é *jogável*.
					 """) -> [n_true = ec_2_yes, n_false = ec_3]
	 @node ec_2_yes = UseActiveDie() -> ec_2_action
	 @node ec_2_action = PerformAction("""
				   Jogar uma carta *jogável* que adiciona corrupção ou adiciona uma peça de caçada.

				   Prioridade:
				   1. Ordem crescente de iniciativa
				   2. Aleatório
				   """) -> ec_2_end
	 @node ec_2_end = End() -> []

	 @node ec_3 = BinaryCondition("""
					 Segurando menos de 4 cartas.
					 """) -> [n_true = ec_3_yes, n_false = ec_return]
	 @node ec_3_yes = UseActiveDie() -> ec_3_action
	 @node ec_3_action = PerformAction("""
				   Comprar uma carta de personagem.
				   """) -> ec_3_end
	 @node ec_3_end = End() -> []

	 @node ec_return = ReturnFromGraph() -> []


	 ################################################################################
	 @node event_cards_resolve_effect = Start() -> er_select_card_effect_choice
	 @node er_select_card_effect_choice = MultipleChoice("""
					Selecionar efeito de carta para resolver.

					1. Seleção de região para mobilização
					2. Seleção de exército para movimento ou ataque
					3. Mover servo ou Nazgûl
					4. Alocação de caçada
					5. Sem efeito, retornar ao menu da Fase 5
					""") -> [er_muster, er_army, er_char_move, er_hunt, er_resolve_end]
	 @node er_muster = JumpToGraph("muster_card") -> er_resolve_end
	 @node er_army = JumpToGraph("movement_attack_card") -> er_resolve_end
	 @node er_char_move = MultipleChoice("""
					Selecionar o que mover.

					1. O Rei Bruxo
					2. O Boca de Sauron
					3. Os Nazgûl
					4. Nada
					""") -> [er_move_wk, er_move_mos, er_move_naz, er_select_card_effect_choice]
	 @node er_move_wk = JumpToGraph("character_wk_prio") -> er_resolve_end
	 @node er_move_mos = JumpToGraph("character_mos_prio") -> er_resolve_end
	 @node er_move_naz = JumpToGraph("character_nazgul_prio") -> er_resolve_end

	 @node er_hunt = CheckStrategy("military") -> [n_true = er_hunt_mili, n_false = er_hunt_corr]
	 @node er_hunt_mili = PerformAction("""
										Selecionar um dado de personagem ou evento aleatoriamente, rolar um d6. Em um 4+, adicioná-lo à reserva de caçada. Fazer isso para cada dado que é possível adicionar à reserva de caçada.
										""") -> er_resolve_end
	 @node er_hunt_corr = PerformAction("""
										Selecionar um dado de exército, mobilização, mobilização/exército ou evento aleatoriamente, rolar um d6. Em um 4+, adicioná-lo à reserva de caçada. Fazer isso para cada dado que é possível adicionar à reserva de caçada.
										""") -> er_resolve_end
	 @node er_resolve_end = End() -> []
end
