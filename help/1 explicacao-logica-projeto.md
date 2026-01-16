# Explicação Detalhada da Lógica do Projeto Queller Bot

## 🎯 O QUE O PROJETO FAZ (Resumo)

Imagine que você está jogando War of the Ring sozinho. Você controla os "mocinhos" (Povos Livres) e precisa de algo para controlar os "vilões" (Sombras). Este programa é esse "algo" - ele é um cérebro artificial que toma decisões pelos vilões.

---

## 🏗️ COMO O PROJETO ESTÁ ORGANIZADO

### **1. A Estrutura Principal (Analogia: Um Livro de Aventura)**

Sabe aqueles livros de "escolha sua aventura"? Tipo:
- "Você está numa caverna. Quer ir pela esquerda? Vá para página 42. Pela direita? Vá para página 87."

Este projeto funciona EXATAMENTE assim! Mas ao invés de páginas, usa **GRAFOS** (árvores de decisão).

---

## 📊 OS COMPONENTES PRINCIPAIS

### **A) GRAFOS (graphs/) - O "Livro de Regras"**

Cada arquivo `.jl` na pasta `graphs/` é uma **árvore de decisão**. Por exemplo:

```julia
@node p1_mili_1 = PerformAction("Recover action dice.") -> p1_mili_2
@node p1_mili_2 = PerformAction("Draw event cards.") -> p1_mili_3
```

**Traduzindo:**
1. **Passo 1**: "Recupere seus dados de ação" → depois vá para o passo 2
2. **Passo 2**: "Compre cartas de evento" → depois vá para o passo 3

É como um **fluxograma gigante** que diz: "faça isso, depois faça aquilo, se X for verdade faça Y, senão faça Z".

#### **Tipos de "Páginas" (Nodes):**

1. **PerformAction** - "Faça esta ação!" (ex: "Mova o exército")
2. **BinaryCondition** - "Esta afirmação é verdadeira?" (ex: "Você tem mais de 6 cartas?")
   - Se SIM → vai pra página A
   - Se NÃO → vai pra página B
3. **MultipleChoice** - "Escolha uma opção" (ex: "Qual exército atacar? 1, 2 ou 3?")
4. **End** - "Fim da fase/ação"
5. **JumpToGraph** - "Vá ler outro fluxograma" (como um sub-capítulo)

---

### **B) CRAWLER (crawler.jl) - O "Leitor Automático"**

O **GraphCrawler** é como um robô que:
1. **Lê o fluxograma** (grafo)
2. **Segue as setas** de uma página para outra
3. **Para quando precisa perguntar algo** para o jogador (você)
4. **Guarda todas as mensagens** no caminho

**Exemplo:**
```julia
function autocrawl!(gc)
    while !at_end(gc)
        gc.msg_buf = add2msgbuf(...)  # Acumula mensagens
        gc.current isa InteractiveNode && break  # Para se precisar de input
        gc.current = autonext!(gc, gc.current)  # Segue para próximo nó
    end
end
```

**Traduzindo:** 
"Continue lendo e acumulando mensagens até encontrar uma pergunta ou chegar no fim"

---

### **C) CLI (cli.jl) - A "Interface com o Jogador"**

Este arquivo gerencia a comunicação com você:

```julia
[true/false] > true
[1/2/3/4] > 3
[C,A,M,H,P] > map
```

Ele:
- **Mostra perguntas** na tela
- **Recebe suas respostas**
- **Valida** se você digitou algo correto
- Entende comandos especiais como `help`, `undo`, `exit`

---

### **D) QUELLER STATE (quellerstate.jl) - O "Caderno de Anotações"**

Mantém o **estado do jogo**:
- Quais **dados** estão disponíveis (Character, Army, Muster, etc.)
- Qual **estratégia** está sendo usada (Military ou Corruption)
- Qual **dado está ativo** no momento

É como a memória do bot - ele precisa lembrar o que já aconteceu.

---

### **E) DICE AND STRATEGY (dice_and_strategy.jl) - As "Regras dos Dados"**

Define os tipos de dados do jogo:
- **Character** (Personagem)
- **Army** (Exército)  
- **Muster** (Recrutamento)
- **Event** (Evento)
- **Will of the West** (dados especiais dos Povos Livres)

E as estratégias:
- **Military** (Militar)
- **Corruption** (Corrupção)

---

## 🔄 COMO TUDO FUNCIONA JUNTO (O Fluxo)

### **1. Você inicia o programa:**
```bash
julia run.jl
```

### **2. O programa carrega:**
```julia
const GRAPHS = load_graphs(GRAPH_FILES...)  # Carrega TODOS os grafos
```
- Lê todos arquivos `.jl` da pasta `graphs/`
- Transforma em estruturas de dados (árvores de decisão)

### **3. O jogo começa:**
```julia
phase = 1
phases = [phase1, phase2, phase3, phase4, phase5]
```
- O jogo tem **5 fases**
- Cada fase é um grafo diferente

### **4. Para cada fase:**

**A.** O **Crawler** começa no nó `Start` do grafo:
```julia
gc.current = gc.root_node
```

**B.** Ele **auto-navega** até encontrar uma pergunta:
```julia
autocrawl!(gc)  # Lê tudo automaticamente até precisar de você
```

**C.** Mostra a pergunta para você:
```
Você tem mais de 6 cartas?
[true/false] > 
```

**D.** Você responde:
```
> true
```

**E.** O Crawler **continua navegando** baseado na sua resposta:
```julia
proceed!(gc, opt)  # Prossegue com a opção escolhida
```

**F.** Repete até chegar num nó `End` (fim da fase)

### **5. Passa para a próxima fase e repete!**

---

## 💡 EXEMPLO PRÁTICO (Fase 1 - Militar)

Vamos seguir o grafo `phase-1.jl`:

```julia
@node phase_1 = Start() -> p1_strat
@node p1_strat = CheckStrategy("military") -> [n_true=p1_mili_1, n_false=p1_corr_1]
```

**Passo 1:** Começa em `phase_1` (Start)
- Vai automaticamente para `p1_strat`

**Passo 2:** Checa a estratégia
- Se for "military" → vai para `p1_mili_1`
- Se for "corruption" → vai para `p1_corr_1`

```julia
@node p1_mili_1 = PerformAction("Recover action dice.") -> p1_mili_2
```

**Passo 3:** Mostra na tela:
```
Recover action dice.
[Press enter to continue]
```

**Passo 4:** Você aperta Enter, vai para próximo:
```julia
@node p1_mili_2 = PerformAction("Draw event cards.") -> p1_mili_3
```

Mostra:
```
Draw event cards.
[Press enter to continue]
```

**Passo 5:** Faz uma pergunta:
```julia
@node p1_mili_3 = BinaryCondition("Holding more than 6 cards.") 
    -> [n_true = p1_mili_discard, n_false = p1_mili_end]
```

Mostra:
```
Holding more than 6 cards.
[true/false] > 
```

- Se você responder **true** → vai para `p1_mili_discard` (descarta cartas)
- Se responder **false** → vai para `p1_mili_end` (fim da fase)

E assim por diante!

---

## 🎮 FUNCIONALIDADES EXTRAS

### **UNDO (Desfazer)**
```julia
function undo!(gc)
    pop!(options)  # Remove última escolha
    initialize!(gc)  # Reinicia
    for opt in options  # Repete todas escolhas anteriores
        proceed!(gc, opt)
    end
end
```

Guarda todas suas escolhas e pode "voltar no tempo"!

### **JUMP (Pular para outro grafo)**
```julia
@node attack = JumpToGraph("battle") -> continue
```

Quando chega aqui, **pausa** o grafo atual e vai ler o grafo `battle.jl`. Quando terminar, **volta** para onde estava.

---

## 📝 RESUMO DA LÓGICA

1. **Grafos** = Fluxogramas que dizem o que o bot deve fazer
2. **Crawler** = Robô que lê e segue o fluxograma
3. **CLI** = Interface que fala com você
4. **State** = Memória do que já aconteceu
5. **Tudo junto** = Um sistema que guia você pelas decisões do bot, passo a passo

É como ter um **assistente inteligente** que lê um manual gigante por você e só te pergunta quando realmente precisa da sua confirmação!

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
Queller/
├── src/
│   ├── Queller.jl          # Módulo principal, coordena tudo
│   ├── cli.jl              # Interface de linha de comando
│   ├── crawler.jl          # Navega pelos grafos de decisão
│   ├── graph.jl            # Define tipos de nós (nodes)
│   ├── quellerstate.jl     # Estado do jogo (dados, estratégia)
│   ├── dice_and_strategy.jl # Regras dos dados e estratégias
│   └── graphviz.jl         # Visualização dos grafos
│
├── graphs/                 # Árvores de decisão
│   ├── phase-1.jl          # Fase 1: Recuperar dados e cartas
│   ├── phase-2.jl          # Fase 2: Ativação de eventos
│   ├── phase-3.jl          # Fase 3: Ações principais
│   ├── phase-4.jl          # Fase 4: Movimentação de companhia
│   ├── phase-5.jl          # Fase 5: Ativação de eventos
│   ├── battle.jl           # Sub-grafo: Combate
│   ├── movement-attack.jl  # Sub-grafo: Movimento e ataque
│   ├── muster.jl           # Sub-grafo: Recrutamento
│   ├── character.jl        # Sub-grafo: Ações de personagem
│   └── event-cards.jl      # Sub-grafo: Uso de cartas
│
├── Project.toml            # Dependências do projeto
└── Manifest.toml           # Versões exatas das dependências

run.jl                      # Script para executar o programa
build.jl                    # Script para compilar executável
```

---

## 🔧 TECNOLOGIAS UTILIZADAS

- **Linguagem:** Julia 1.6+
- **Dependências:** 
  - `TextWrap` - Formatação de texto para exibição no terminal
- **Paradigma:** Programação baseada em grafos de decisão
- **Compilação:** PackageCompiler (para criar executáveis standalone)

---

## 🎲 COMO O BOT TOMA DECISÕES

O bot não usa inteligência artificial no sentido moderno (machine learning). Ele usa um sistema de **regras determinísticas** baseado em:

1. **Árvores de decisão pré-definidas** - Todas as possíveis situações foram mapeadas manualmente
2. **Estado do jogo** - Dados disponíveis, estratégia escolhida, situação atual
3. **Prioridades fixas** - Quando há múltiplas opções válidas, segue uma lista de prioridades

**Exemplo de prioridade:**
```julia
Priority:
1. Doesn't use the term "Fellowship revealed"
2. Character card
3. Strategy card
4. Descending order of initiative
5. Random
```

O bot sempre escolhe baseado nesta ordem: primeiro tenta aplicar a regra 1, se não funcionar tenta a 2, e assim por diante.

---

## 🚀 VANTAGENS DESTE DESIGN

1. **Transparente** - Você pode ver exatamente como o bot decide (basta ler os grafos)
2. **Modificável** - Quer mudar o comportamento? Edite os arquivos `.jl` dos grafos
3. **Reproduzível** - Mesma situação = mesma decisão (com UNDO você pode voltar e tentar de novo)
4. **Educacional** - Ao jogar, você aprende as estratégias do Queller Bot original
5. **Sem surpresas** - Não há "caixa preta" de IA, tudo é baseado em regras claras

---

**Criado por:** Martin Morin  
**Baseado em:** Queller Bot v3.0.1 (original em papel)  
**Repositório:** https://github.com/mvmorin/queller-bot
