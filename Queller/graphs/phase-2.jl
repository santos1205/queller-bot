@graphs begin
	@node phase_2 = Start() -> p2_check
	@node p2_check = CheckStrategy("military") -> [n_true=p2_mili, n_false=p2_corr]

	# Militar
	@node p2_mili = BinaryCondition("""
									Os pontos de vitória das Sombras são menores que os pontos de corrupção após os Povos Livres escolherem se revelam.
									""") -> [n_true=p2_mili_change, n_false=p2_mili_end]
	@node p2_mili_change = SetStrategy("corruption") -> p2_mili_end

	@node p2_mili_end = End("Fim da Fase") -> []

	# Corrupção
	@node p2_corr = BinaryCondition("""
									Os pontos de corrupção são menores que os pontos de vitória das Sombras após os Povos Livres escolherem se revelam.
									""") -> [n_true=p2_corr_change, n_false=p2_corr_end]
	@node p2_corr_change = SetStrategy("military") -> p2_corr_end

	@node p2_corr_end = End("Fim da Fase") -> []

end
