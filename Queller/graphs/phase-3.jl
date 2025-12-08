@graphs begin
	@node phase_3 = Start() -> p3_strat
	@node p3_strat = CheckStrategy("military") -> [n_true=p3_mili_1, n_false=p3_corr_1]

	# Militar
	@node p3_mili_1 = BinaryCondition("A Sociedade está na trilha de Mordor.") -> [n_true = p3_mili_1_yes, n_false = p3_mili_2]
	@node p3_mili_1_yes = PerformAction("Atribuir o número máximo permitido de dados à reserva de caça.") -> p3_mili_end_phase

	@node p3_mili_2 = BinaryCondition("O progresso da Sociedade é maior que 5.") -> [n_true = p3_mili_2_yes, n_false = p3_mili_3]
	@node p3_mili_2_yes = PerformAction("Atribuir 2 dados à reserva de caça.") -> p3_mili_end_phase

	@node p3_mili_3 = BinaryCondition("A Sociedade está na posição inicial e seu progresso é 0.") -> [n_true = p3_mili_3_yes, n_false = p3_mili_3_no]
	@node p3_mili_3_yes = PerformAction("Atribuir 0 dados à reserva de caça.") -> p3_mili_end_phase
	@node p3_mili_3_no = PerformAction("Atribuir 1 dado à reserva de caça.") -> p3_mili_end_phase

	@node p3_mili_end_phase = End("Fim da Fase") -> []

	# Corrupção
	@node p3_corr_1 = BinaryCondition("A Sociedade está na posição inicial e seu progresso é 0.") -> [n_true = p3_corr_1_yes, n_false = p3_corr_2]
	@node p3_corr_1_yes = PerformAction("Role um d6. Em 4+, atribuir 1 dado à reserva de caça, caso contrário não faça nada.") -> p3_corr_end_phase

	@node p3_corr_2 = BinaryCondition( " A Sociedade está na trilha de Mordor.  ") -> [n_true = p3_corr_2_yes, n_false = p3_corr_3]
	@node p3_corr_2_yes = PerformAction( " Atribuir o número máximo permitido de dados à reserva de caça.  ") -> p3_corr_end_phase

	@node p3_corr_3 = BinaryCondition("""
									  Um exército *móvel* está adjacente ao seu *alvo* que fornece pontos de vitória suficientes para vencer o jogo.
									  Ou, as Sombras têm 7 dados.
									  """
									  ) -> [n_true = p3_corr_3_yes, n_false = p3_corr_4]
	@node p3_corr_3_yes = PerformAction( " Atribuir 1 dado à reserva de caça.  ") -> p3_corr_end_phase

	@node p3_corr_4 = BinaryCondition( " O progresso da Sociedade é maior que 4.  ") -> [n_true = p3_corr_4_yes, n_false = p3_corr_5]
	@node p3_corr_4_yes = PerformAction( " Atribuir 2 dados à reserva de caça.  ") -> p3_corr_end_phase

	@node p3_corr_5 = BinaryCondition("""
									  O caminho mais curto da Sociedade para Mordor passa por uma fortaleza das Sombras e o progresso permite que eles a passem ou estejam a 2 passos dela.
									  """) -> [n_true = p3_corr_5_yes, n_false = p3_corr_5_no]
	@node p3_corr_5_yes = PerformAction("Atribuir 2 dados à reserva de caça.") -> p3_corr_end_phase
	@node p3_corr_5_no = PerformAction("Atribuir 1 dado à reserva de caça.") -> p3_corr_end_phase

	@node p3_corr_end_phase = End("Fim da Fase") -> []
end
