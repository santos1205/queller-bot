module Queller

using TextWrap

export main,
	check_queller_graphs

################################################################################

not_unique(v, f=isequal) = filter(e -> (count(f.([e],v)) > 1), v)
strvec2str(v,sep='\n') = isempty(v) ? "" : reduce((s,t) -> s*sep*t, v)
fieldsdefined(obj) = all(i -> isdefined(obj,i), 1:nfields(obj))

################################################################################

include("dice_and_strategy.jl")
include("cli.jl")
include("graph.jl")
include("quellerstate.jl")
include("crawler.jl")

const PKG_DIR = abspath(joinpath(@__DIR__, ".."))
const GRAPH_FILES = filter(p-> splitext(p)[2] == ".jl", readdir("$(PKG_DIR)/graphs", join=true))
const GRAPHS = load_graphs(GRAPH_FILES...)

################################################################################

mutable struct ProgramState
	phase::Int
	phases::Vector{Function}
	graphs::Dict{String,QuellerGraph}

	available_dice::Vector{Die.Face}
	strategy::Strategy.Choice

	iop::IOParser

	reset::Bool
	reset_phase::Bool
	exit::Bool
end

function ProgramState()
	phase = 1
	phases = [phase1,phase2,phase3,phase4,phase5]

	available_dice = Vector{Die.Face}()
	strategy = rand(instances(Strategy.Choice))

	iop = IOParser([
		CMD.ResetPhase()
		CMD.Exit()
		CMD.Repeat()
		CMD.Phase(length(phases))
		CMD.Help()
		])

	cmds = Vector{CMD.Command}()
	return ProgramState(phase,phases,GRAPHS,available_dice,strategy,iop,false,false,false)
end

greeting_str = """
Queller CLI: IA das Sombras para War of the Ring

Digite 'ajuda' e pressione enter para mais informações sobre a operação do programa.
"""

help_str = """
Queller CLI: IA das Sombras para War of the Ring

-- Uso --

Este programa apresentará várias declarações, seleções e ações para cada uma das 5 fases do jogo. Simplesmente responda/execute-as quando forem apresentadas. Todas as declarações referem-se à mão, exércitos etc. do jogador das Sombras, a menos que especificado que se refere à mão, exércitos etc. dos Povos Livres.

Leia o manual curto antes de começar e mantenha-o disponível. Palavras entre asteriscos, por exemplo, *ameaça*, referem-se ao glossário no manual.

-- Dados --

O programa manterá o controle dos dados disponíveis para o jogador das Sombras e instruirá você sobre quais usar. No entanto, é possível, devido a erros e razões legítimas, que o programa fique fora de sincronia com a realidade. Há uma opção de menu na Fase 5 para corrigir isso.

-- Entradas --

As opções válidas para uma consulta são dadas pelo prompt de entrada. Se as opções forem separadas por "/" apenas uma das opções deve ser fornecida. Se forem separadas por "," várias opções podem ser fornecidas. Para selecionar uma opção, simplesmente digite a opção selecionada e pressione enter; múltiplas opções devem ser separadas por espaços ou nada.

Todas as entradas não diferenciam maiúsculas de minúsculas e em muitos casos podem ser encurtadas para uma letra, ou seja, "v" para "verdadeiro", "f" para "falso", "d" para "desfazer" etc.

Exemplos:

[verdadeiro/falso] > verdadeiro
[verdadeiro/falso] > f
[1/2/3/4] > 3
[1,2,3,4] > 2 4 1
[C,A,M,H,P] > mappc

-- Comandos --

Os seguintes comandos podem (quase) sempre ser usados quando solicitado entrada. Para usar um comando, digite o nome do comando e pressione enter.

ajuda       :: Mostra esta mensagem de ajuda.
sair        :: Sai do programa.
undo        :: Desfazer a última entrada e voltar um passo. Note que nem tudo pode ser desfeito; use o comando "reiniciar" ou "fase" nessas circunstâncias.
repetir     :: Repete a última consulta.
reiniciar   :: Reinicia e recomeça a fase atual.
fase <número> :: Pula para o início de uma fase, por exemplo, digite "fase 3" para pular para a fase 3

----------
"""



################################################################################

function print_read_process(state, msg, options, callback, silent_options=Vector{CMD.Command}())
	display_message(state.iop, msg)

	while true
		cmd = read_input(state.iop, options, silent_options)

		if cmd in options || cmd in silent_options
			callback(cmd)
			return true
		end

		cmd isa CMD.Command && handle_general_command(state,cmd)
		cmd isa CMD.Repeat && return print_read_process(state, msg, options, callback, silent_options)
		cmd isa CMD.AbortingCommand && return false
	end
end

function resolve_decision_graph(state, graph)
	gc = GraphCrawler(graph, state.graphs, state.available_dice, state.strategy)

	abort = Ref(false)
	callback(cmd) = proceed!(gc, cmd)
	callback(cmd::CMD.Undo) = !undo!(gc) && (abort[] = !print_read_process(state, "Não é possível desfazer mais.", [CMD.Blank()], x->nothing))

	while !at_end(gc)
		msg, options = getinteraction(gc)
		!print_read_process(state, msg, options, callback, [CMD.Undo()]) && return false
		abort[] && return false
	end

	state.available_dice = get_available_dice(gc)
	state.strategy = get_strategy(gc)
	return true
end


################################################################################

function main()::Cint
	try
		state = ProgramState()
		display_message(state.iop, greeting_str)

		while !state.exit
			state.phases[state.phase](state)

			state.reset_phase && (state.reset_phase = false; continue)

			state.phase = 1 + (state.phase % length(state.phases))
		end
	catch e
		println(e)
		return 1
	end
	return 0
end

handle_general_command(state,cmd::CMD.Command) = nothing
handle_general_command(state,cmd::CMD.ResetPhase) = (state.reset_phase = true)
handle_general_command(state,cmd::CMD.Exit) = (state.exit = true)
handle_general_command(state,cmd::CMD.Phase) = (state.reset_phase = true; state.phase = cmd.nbr)
handle_general_command(state,cmd::CMD.Help) = display_message(state.iop, help_str)


phase1(state) = graph_phase(state, "phase_1", "Fase 1")
phase2(state) = graph_phase(state, "phase_2", "Fase 2")
phase3(state) = graph_phase(state, "phase_3", "Fase 3")
phase4(state) = graph_phase(state, "phase_4", "Fase 4")

function graph_phase(state, graph, name)
	display_message(state.iop, name)
	resolve_decision_graph(state, graph)
end

function phase5(state)
	menu = """
	Dados Disponíveis: $(strvec2str(sort(Die.char.(state.available_dice)),','))

	Selecione a ação da fase 5.

	1. Escolher ação das Sombras
	2. Resolver um efeito de carta
	3. Resolver uma batalha
	4. Recrutar um lacaio como ação final das Sombras com dado reservado anteriormente
	5. Alterar os dados disponíveis (use isto se os dados disponíveis do bot não correspondem à realidade)
	6. Encerrar turno e ir para a fase 1
	"""

	graphs = [
			  "phase_5",
			  "event_cards_resolve_effect",
			  "battle",
			  "muster_minion_selection",
			  "adjust_dice",
			  ]

	choice = Ref(0)
	menu_callback(cmd) = (choice[] = cmd.opt)
	!print_read_process(state, menu, CMD.Option.(1:6), menu_callback) && return

	if 1 <= choice[] <= 5
		!resolve_decision_graph(state, graphs[choice[]]) && return

	elseif choice[] == 6
		# Confirm exit
		msg = "Sair da fase 5 e retornar à fase 1."
		exit = Ref(false)

		exit_callback(cmd::CMD.False) = (exit[] = false)
		exit_callback(cmd::CMD.True) = (exit[] = true)

		!print_read_process(state, msg, [CMD.True(), CMD.False()], exit_callback) && return

		exit[] && return
	end

	phase5(state)
end

################################################################################

include("graphviz.jl")

function check_queller_graphs()
	println("\nTodos os grafos em PostScript podem ser encontrados em Queller/graph_output.")
	graph_output_file(f) = joinpath(PKG_DIR, "graph_output", splitext(basename(f))[1]*".ps")

	for f in getfield.(values(GRAPHS),:source_file)
		graph2ps(f, graph_output_file(f))
	end

	unjumped = get_graphs_not_jumped_to(values(GRAPHS))
	println("\nGrafos que não são referenciados de outro grafo:\n$(strvec2str(unjumped))")

	return
end


end
