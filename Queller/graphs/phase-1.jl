@graphs begin
	@node phase_1 = Start() -> p1_strat
	@node p1_strat = CheckStrategy("military") -> [n_true=p1_mili_1, n_false=p1_corr_1]

	# Militar
	@node p1_mili_1 = PerformAction("Recuperar dados de ação.") -> p1_mili_2
	@node p1_mili_2 = PerformAction("Comprar cartas de evento.") -> p1_mili_3
	@node p1_mili_3 = BinaryCondition("Segurando mais de 6 cartas.") -> [n_true = p1_mili_discard, n_false = p1_mili_end]
	@node p1_mili_discard = PerformAction("""
										  Descartar cartas de evento até 6.

										  Prioridade:
										  1. Não usa o termo "Sociedade revelada"
										  2. Carta de personagem
										  3. Carta de estratégia
										  4. Ordem decrescente de iniciativa
										  5. Não coloca uma peça
										  6. Aleatório
										  """) -> p1_mili_end
	@node p1_mili_end = End("Fim da Fase") -> []

	# Corrupção
	@node p1_corr_1 = PerformAction("Recuperar dados de ação.") -> p1_corr_2
	@node p1_corr_2 = PerformAction("Comprar cartas de evento.") -> p1_corr_3
	@node p1_corr_3 = BinaryCondition("Segurando mais de 6 cartas.") -> [n_true = p1_corr_discard, n_false = p1_corr_end_1]
	@node p1_corr_discard = BinaryCondition("Segurando mais de 1 carta de estratégia.") -> [n_true = p1_corr_discard_1, n_false = p1_corr_discard_2]
	@node p1_corr_discard_1 = PerformAction("""
										Descartar cartas de evento até 6.

										Prioridade:
										1. Não usa o termo "Sociedade revelada"
										2. Não coloca uma peça
										3. Carta de estratégia
										4. Carta de personagem
										5. Ordem decrescente de iniciativa
										6. Aleatório
										""") -> p1_corr_end_2
	@node p1_corr_discard_2 = PerformAction("""
										Descartar cartas de evento até 6.

										Prioridade:
										1. Não usa o termo "Sociedade revelada"
										2. Não coloca uma peça
										3. Carta de personagem
										4. Carta de estratégia
										5. Ordem decrescente de iniciativa
										6. Aleatório
										""") -> p1_corr_end_2
	@node p1_corr_end_1 = End("Fim da Fase") -> []
	@node p1_corr_end_2 = End("Fim da Fase") -> []
end
