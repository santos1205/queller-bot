@graphs begin
	################################################################################
	@node select_action_mili = Start() -> threat_check
	@node threat_check = JumpToGraph("threat_exposed") -> a1


	########################################
	@node a1 = Dummy() -> a1_1
	@node a1_1 = SetActiveDie('C', may_use_ring = true) -> [next = a1_cond, no_die = a2]
	@node a1_cond = BinaryCondition("""
									O Rei dos Bruxos está em jogo e não está em um exército *móvel*, mas é capaz de criar ou se juntar a um.
									""") -> [n_true = a1_jump, n_false = a2]
	@node a1_jump = JumpToGraph("character_which_king") -> a2


	########################################
	@node a2 = Dummy() -> a2_1
	@node a2_1 = SetActiveDie('M', may_use_ring = true) -> [next = a2_jump, no_die = a3]
	@node a2_jump = JumpToGraph("muster_minion") -> a3


	########################################
	@node a3 = Dummy() -> a3_1
	@node a3_1 = SetActiveDie('M') -> [next = a3_jump, no_die = a4]
	@node a3_jump = JumpToGraph("muster_politics") -> a4


	########################################
	@node a4 = Dummy() -> a4_1
	@node a4_1 = SetActiveDie('C', may_use_ring = true) -> [next = a4_2, no_die = a5]
	@node a4_2 = SetActiveDie('P', may_use_ring = true) -> [next = a4_cond, no_die = a5]
	@node a4_cond = BinaryCondition("""
									A Sociedade está na trilha de Mordor ou está revelada.
									E, uma carta de personagem "Sociedade revelada" está na mão.
									""") -> [n_true = a4_die, n_false = a5]
	@node a4_die = UseActiveDie() -> a4_action
	@node a4_action = PerformAction("""
									Jogar uma carta de personagem "Sociedade revelada".

									Prioridade:
									1. Ordem crescente de iniciativa
									2. Aleatório
									""") -> a4_end
	@node a4_end = End() -> []


	########################################
	@node a5 = Dummy() -> a5_1
	@node a5_1 = SetActiveDie('C', may_use_ring = true) -> [next = a5_2, no_die = a6]
	@node a5_2 = SetActiveDie('A', may_use_ring = true) -> [next = a5_cond, no_die = a6]
	@node a5_cond = BinaryCondition("""
									Um exército *móvel* está adjacente ao seu *alvo* ou a um exército dos Povos Livres na rota mais curta para o seu *alvo*.

									E, qualquer uma das seguintes condições é verdadeira:
									- O *alvo* do exército *móvel* fornece pontos suficientes para vencer.
									- O *alvo* do exército *móvel* está em uma nação em guerra e não está sob cerco.
									- A Sociedade está na trilha de Mordor.
									""") -> [n_true = a5_action, n_false = a6]
	@node a5_action = JumpToGraph("movement_attack_basic") -> a6


	########################################
	@node a6 = Dummy() -> a6_1
	@node a6_1 = SetActiveDie('M') -> [next = a6_cond, no_die = a7]
	@node a6_cond = BinaryCondition("""
									Uma carta de estratégia que recruta é *jogável*.
									""") -> [n_true = a6_die, n_false = a6_2]
	@node a6_2 = SetActiveDie('A') -> [next = a6_cond_2, no_die = a7]
	@node a6_cond_2 = BinaryCondition("""
									  Uma carta de estratégia que recruta é *jogável*.
									  """) -> [n_true = a6_die, n_false = a7]
	@node a6_die = UseActiveDie() -> a6_action
	@node a6_action = PerformAction("""
									Jogar uma carta de estratégia que recruta.

									Prioridade:
									1. Ordem crescente de iniciativa
									2. Aleatório
									""") -> a6_end
	@node a6_end = End() -> []


	########################################
	@node a7 = Dummy() -> a7_1
	@node a7_1 = BinaryCondition("O jogador das Sombras tem permissão para passar.") -> [n_true = a7_action, n_false = a8]
	@node a7_action = PerformAction("Passar") -> a7_end
	@node a7_end = End() -> []


	########################################
	@node a8 = Dummy() -> a8_1
	@node a8_1 = SetActiveDie('P') -> [next = a8_jump_1, no_die = a9]
	@node a8_jump_1 = JumpToGraph("event_cards_preferred") -> a8_jump_2
	@node a8_jump_2 = JumpToGraph("event_cards_general") -> a9


	########################################
	@node a9 = Dummy() -> a9_1
	@node a9_1 = SetActiveDie('C') -> [next = a9_2, no_die = a10]
	@node a9_2 = SetActiveDie('A') -> [next = a9_cond, no_die = a10]
	@node a9_cond = BinaryCondition("""
									Um exército *móvel* está adjacente ao seu *alvo*.
									""") -> [n_true = a9_action, n_false = a10]
	@node a9_action = JumpToGraph("movement_attack_basic") -> a10


	########################################
	@node a10 = Dummy() -> a10_1
	@node a10_1 = SetActiveDie('A') -> [next = a10_action, no_die = a11]
	@node a10_action = JumpToGraph("movement_attack_corr") -> a11


	########################################
	@node a11 = Dummy() -> a11_1
	@node a11_1 = SetActiveDie('C') -> [next = a11_action, no_die = a12]
	@node a11_action = JumpToGraph("character_army") -> a12


	########################################
	@node a12 = Dummy() -> a12_start
	@node a12_start = SetActiveDie('M') -> [next = a12_1, no_die = a13]
	@node a12_1 = JumpToGraph("muster_minion") -> a12_2
	@node a12_2 = JumpToGraph("muster_politics") -> a12_3
	@node a12_3 = JumpToGraph("muster_muster") -> a13


	# No action found and end
	########################################
	@node a13 = ReturnFromGraph() -> []
end
