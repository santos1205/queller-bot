@graphs begin
	@node phase_4 = Start() -> p4_roll
	@node p4_roll = GetAvailableDice("""
									 Role todos os dados de ação que não estão na caixa de caçada. Coloque todos os resultados de Olho na caixa de caçada e insira os dados restantes.
									 """) -> p4_end
	@node p4_end = End("Fim da Fase") -> []

	@node adjust_dice = Start() -> adjust_roll
	@node adjust_roll = GetAvailableDice() -> adjust_end
	@node adjust_end = End() -> []
end
