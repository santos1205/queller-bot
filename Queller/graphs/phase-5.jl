@graphs begin
	@node phase_5 = Start() -> ring_check

	@node ring_check = BinaryCondition("A Sombra possui um anel élfico.") -> [n_true=ring_available, n_false=ring_not_available]
	@node ring_available = SetRingAvailable(true) -> modt_check
	@node ring_not_available = SetRingAvailable(false) -> modt_check

	@node modt_check = BinaryCondition("""
									   O Boca de Sauron está recrutado e sua habilidade "Mensageiro da Torre Negra" não foi usada neste turno.
									   """) -> [n_true=modt_available, n_false=modt_not_available]
	@node modt_available = SetMoDTAvailable(true) -> p5_strat
	@node modt_not_available = SetMoDTAvailable(false) -> p5_strat

	@node p5_strat = CheckStrategy("military") -> [n_true=p5_mili, n_false=p5_corr]

	@node p5_mili = JumpToGraph("select_action_mili") -> p5_discard_check
	@node p5_corr = JumpToGraph("select_action_corr") -> p5_discard_check

	@node p5_discard_check = CheckStrategy("military") -> [n_true = p5_mili_discard, n_false = p5_corr_discard]
	@node p5_mili_discard = PerformAction("""
										  Queller falhou em encontrar uma ação. Descarte um dado de Personagem ou Evento aleatório se possível, caso contrário descarte um dado aleatório (não descarte um dado reservado para uso posterior).
										  """) -> p5_dice
	@node p5_corr_discard = PerformAction("""
										  Queller falhou em encontrar uma ação. Descarte um dado de Exército, Mobilização, Mobilização/Exército ou Evento aleatório se possível, caso contrário descarte um dado aleatório (não descarte um dado reservado para uso posterior).
										  """) -> p5_dice
	@node p5_dice = GetAvailableDice("""
									 Insira os dados disponíveis restantes aqui (sem contar os dados reservados para uso posterior).
									 """) -> p5_end

	@node p5_end = End("Fim da Fase") -> []
end
