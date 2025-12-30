@graphs begin
	attack_threat_cond = """
	Um exército *móvel* pode atacar uma *ameaça*.
	"""

	move_adjacent_cond = """
	Exército(s) pode(m) se mover de forma que um exército *móvel* seja criado adjacente a uma *ameaça*.
	"""

	move_stronghold_cond = """
	Exército(s) pode(m) se mover de forma que o *valor* em uma fortaleza sob *ameaça* aumente.
	"""

	move_toward_cond = """
	Exército(s) *móvel(is)* pode(m) se mover em direção ao(s) seu(s) *alvo(s)* e reduzir sua distância à *ameaça*.
	"""

	move_exposed_cond = """
	Exército(s) pode(m) se mover em direção a uma região *exposta*.
	"""

	muster_cond = """
	É possível recrutar em uma fortaleza sob *ameaça*.
	"""

	character_cond = """
	Uma *ameaça* está sitiando uma fortaleza da Sombra cuja liderança do exército é menor que 5 e menor que o número de unidades do exército.
	"""

	move_remain_cond = """
	O Dado de Exército tem um movimento restante.
	"""


	attack_text = """
	Atacar de acordo com a última declaração. Selecione exército aleatoriamente se vários podem realizar tal ataque.
	"""

	move_text = """
	Mover de acordo com a última declaração. Selecione exército aleatoriamente se vários podem realizar tal movimento.
	"""

	muster_text = """
	Prioridade de *Foco*:
	1. Fortaleza sob *ameaça*
	2. Aleatório

	Recrutar:
	*Primário*: Elite
	*Secundário*: Regular

	Se unidade não estiver disponível, rotacione como:
	Elite -> Regular -> Nazgûl -> Elite
	"""


	################################################################################

	@node threat_exposed = Start() -> tx_t
	@node tx_t = BinaryCondition("Uma *ameaça* existe.") -> [n_true = tx_1, n_false = tx_exp]
	@node tx_exp = BinaryCondition("Uma região *exposta* existe.") -> [n_true = tx_5, n_false=tx_skip_return]
	@node tx_skip_return = ReturnFromGraph() -> []

	########################################
	@node tx_1 = SetActiveDie('C') -> [next = tx_1_char_cond, no_die = tx_1_army]

	@node tx_1_char_cond = BinaryCondition(attack_threat_cond) -> [n_true = tx_1_use_die, n_false = tx_1_army]
	@node tx_1_army = SetActiveDie('A', may_use_ring = true) -> [next = tx_1_army_cond, no_die = tx_2]

	@node tx_1_army_cond = BinaryCondition(attack_threat_cond) -> [n_true = tx_1_use_die, n_false = tx_2]
	@node tx_1_use_die = UseActiveDie() -> tx_1_action
	@node tx_1_action = PerformAction(attack_text) -> tx_1_end
	@node tx_1_end = End() -> []


	########################################
	@node tx_2 = SetActiveDie('C') -> [next = tx_2_char_cond, no_die = tx_2_army]

	@node tx_2_char_cond = BinaryCondition(move_adjacent_cond) -> [n_true = tx_move_use_die, n_false = tx_2_army]
	@node tx_2_army = SetActiveDie('A', may_use_ring = true) -> [next = tx_2_army_cond, no_die = tx_3]

	@node tx_2_army_cond = BinaryCondition(move_adjacent_cond) -> [n_true = tx_move_use_die, n_false = tx_3]


	########################################
	@node tx_3 = SetActiveDie('C') -> [next = tx_3_char_cond, no_die = tx_3_army]

	@node tx_3_char_cond = BinaryCondition(move_stronghold_cond) -> [n_true = tx_move_use_die, n_false = tx_3_army]
	@node tx_3_army = SetActiveDie('A', may_use_ring = true) -> [next = tx_3_army_cond, no_die = tx_4]

	@node tx_3_army_cond = BinaryCondition(move_stronghold_cond) -> [n_true = tx_move_use_die, n_false = tx_4]


	########################################
	@node tx_4 = SetActiveDie('C') -> [next = tx_4_char_cond, no_die = tx_4_army]

	@node tx_4_char_cond = BinaryCondition(move_toward_cond) -> [n_true = tx_move_use_die, n_false = tx_4_army]
	@node tx_4_army = SetActiveDie('A', may_use_ring = true) -> [next = tx_4_army_cond, no_die = tx_5]

	@node tx_4_army_cond = BinaryCondition(move_toward_cond) -> [n_true = tx_move_use_die, n_false = tx_5]


	########################################
	@node tx_5 = SetActiveDie('C') -> [next = tx_5_char_cond, no_die = tx_5_army]

	@node tx_5_char_cond = BinaryCondition(move_exposed_cond) -> [n_true = tx_move_use_die, n_false = tx_5_army]
	@node tx_5_army = SetActiveDie('A', may_use_ring = true) -> [next = tx_5_army_cond, no_die = tx_m]

	@node tx_5_army_cond = BinaryCondition(move_exposed_cond) -> [n_true = tx_move_use_die, n_false = tx_m]


	########################################
	@node tx_move_use_die = UseActiveDie() -> tx_move_action
	@node tx_move_action = PerformAction(move_text) -> tx_move_army_die_to_move
	@node tx_move_army_die_to_move = CheckActiveDie('A') -> [n_true=tx_move_movement_remains, n_false=tx_move_end]
	@node tx_move_movement_remains = BinaryCondition(move_remain_cond) -> [n_true = tx_move_rem_2, n_false = tx_move_end]
	@node tx_move_end = End() -> []


	########################################
	@node tx_move_rem_2 = BinaryCondition(move_adjacent_cond) -> [n_true = tx_move_rem_use_die, n_false = tx_move_rem_3]
	@node tx_move_rem_3 = BinaryCondition(move_stronghold_cond) -> [n_true = tx_move_rem_use_die, n_false = tx_move_rem_4]
	@node tx_move_rem_4 = BinaryCondition(move_toward_cond) -> [n_true = tx_move_rem_use_die, n_false = tx_move_rem_5]
	@node tx_move_rem_5 = BinaryCondition(move_exposed_cond) -> [n_true = tx_move_rem_use_die, n_false = tx_move_rem_6]
	@node tx_move_rem_use_die = UseActiveDie() -> tx_move_rem_action
	@node tx_move_rem_action = PerformAction(move_text) -> tx_move_rem_end
	@node tx_move_rem_6 = JumpToGraph("movement_attack_corr") -> tx_move_rem_end
	@node tx_move_rem_end = End() -> []


	########################################
	@node tx_m = SetActiveDie('M', may_use_ring = true) -> [next = tx_m_cond, no_die = tx_c]

	@node tx_m_cond = BinaryCondition(muster_cond) -> [n_true = tx_m_die, n_false = tx_c]
	@node tx_m_die = UseActiveDie() -> tx_m_action
	@node tx_m_action = PerformAction(muster_text) -> tx_m_end
	@node tx_m_end = End() -> []


	########################################
	@node tx_c = SetActiveDie('C', may_use_ring = true) -> [next = tx_c_cond, no_die = tx_return]

	@node tx_c_cond = BinaryCondition(character_cond) -> [n_true = tx_c_1, n_false = tx_return]
	@node tx_c_1 = JumpToGraph("character_move") -> tx_return


	########################################
	@node tx_return = ReturnFromGraph() -> []
end
