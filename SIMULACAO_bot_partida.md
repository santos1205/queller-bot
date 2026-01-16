# Decisões do Queller Bot em Partidas de War of the Ring

Este documento explica detalhadamente como o Queller Bot toma decisões durante uma partida de War of the Ring, comparando as regras do jogo com a lógica implementada pelo bot.

---

# PREPARAÇÃO DO JOGO (SETUP)

Antes de começar a simular uma partida com o Queller Bot, é necessário preparar o jogo físico seguindo os passos abaixo. Esta seção descreve o setup completo conforme o manual oficial de War of the Ring (Segunda Edição).

## PASSO 1: Montar o Tabuleiro

Coloque o tabuleiro sobre uma superfície adequada, se possível grande o suficiente para haver espaço ao longo das bordas do tabuleiro (para colocar as cartas descartadas, as peças eliminadas e jogar os dados).

## PASSO 2: Posicionar a Sociedade do Anel

Coloque as figuras dos **Portadores do Anel** (Frodo e Sam) em **Valfenda**, seu lugar no início do jogo.

## PASSO 3: Configurar o Indicador de Avanço da Sociedade

- Coloque o **Marcador de Progresso da Sociedade** na casa **0** do Indicador de Avanço da Sociedade, com o lado **"Escondido"** para cima.
- Coloque o **Marcador de Corrupção** também na casa **0** do Indicador de Avanço da Sociedade.

## PASSO 4: Preparar as Cartas de Companheiro

Coloque todas as cartas de Companheiro no espaço que corresponde ao Guia no Quadro da Sociedade, com a Carta de Personagem **Gandalf, o Cinzento** no topo da pilha, pois ele é o primeiro Guia da Sociedade. 

Separe as cartas de:
- **Aragorn, Herdeiro de Isildur**
- **Gandalf, o Branco**
- **Gollum**

Para serem usadas mais tarde.

## PASSO 5: Posicionar os Companheiros

Coloque todas as figuras dos Companheiros e seus marcadores no Quadro da Sociedade do Anel. Separe a figura do **Gollum** para ser usada mais tarde.

**Companheiros iniciais:**
- Frodo e Sam (Portadores do Anel)
- Gandalf, o Cinzento (Guia)
- Aragorn
- Legolas
- Gimli
- Boromir
- Merry
- Pippin

## PASSO 6: Anéis Élficos

Coloque os três marcadores dos **Anéis Élficos** no Quadro dos Anéis Élficos dos Povos Livres no tabuleiro com o lado **"Anel"** para cima.

## PASSO 7: Separar Vassalos da Sombra

Separe as Cartas de todos os Vassalos da Sombra (**Rei dos Bruxos**, **Saruman** e **Boca de Sauron**) e as figuras correspondentes para uso posterior. **⚠️ IMPORTANTE:** Os Vassalos **NÃO** começam no tabuleiro! Eles entram depois.

## PASSO 8: Preparar Cartas de Evento

Separe as Cartas de Evento dos Povos Livres e da Sombra em dois maços, **Personagem** e **Estratégia**, de acordo com o verso de cada carta, depois embaralhe-os separadamente e coloque-os nas áreas correspondentes do tabuleiro.

## PASSO 9: Preparar Peças de Busca

Coloque as **Peças de Busca Normais** (bege) numa xícara ou algum outro recipiente opaco: Esta é a **Reserva da Busca**. Separe as **Peças de Busca Especiais** (azuis e verdes) para uso posterior.

## PASSO 10: Distribuir Dados

- **7 Dados de Ação da Sombra** (vermelhos) → para o Bot (Queller Bot)
- **4 Dados de Ação dos Povos Livres** (azuis) → para você
- Coloque de lado os Dados de Ação restantes para uso posterior
- Separe os **5 Dados de Combate** (brancos) para uso durante batalhas

## PASSO 11: Configurar Indicador Político

Coloque o Marcador Político de cada Nação em sua posição inicial no Indicador Político:

### **Povos Livres:**

**Posição Inicial (casa de cima):**
- **Rohan**: Casa **"Passiva"** (lado Passivo para cima)
- **Norte**: Casa **"Passiva"** (lado Passivo para cima)
- **Elfos**: Casa **"Ativa"** (lado Ativo para cima) ⚠️ Único dos Povos Livres que começa Ativo
- **Anões**: Casa **"Passiva"** (lado Passivo para cima)

**Segunda casa:**
- **Gondor**: Casa **"Passiva"** (lado Passivo para cima)

### **Sombra:**

**Segunda casa:**
- **Sulistas/Orientais**: Casa **"Ativa"** (lado Ativo para cima)

**Terceira casa (imediatamente acima de "Em Guerra"):**
- **Sauron**: Casa **"Ativa"** (lado Ativo para cima)
- **Isengard**: Casa **"Ativa"** (lado Ativo para cima)

**⚠️ NOTA:** Sauron e Isengard começam quase "Em Guerra" (na terceira casa), mas ainda estão "Ativos". Eles podem ser movidos para "Em Guerra" facilmente.

## PASSO 12: Posicionar Exércitos Iniciais

Separe as figuras de plástico de acordo com a cor e o tipo e posicione os Líderes e as unidades dos Exércitos de cada Nação conforme descrito abaixo.

### **POVOS LIVRES (Unidades Azuis)**

#### **Gondor (azul escuro):**
- **Minas Tirith**: 3 Regulares, 1 Elite, 1 Líder (Valor: 15)
- **Dol Amroth**: 3 Regulares (Valor: 9)
- **Osgiliath**: 2 Regulares
- **Pelargir**: 1 Regular

#### **Rohan (verde escuro):**
- **Edoras**: 1 Regular, 1 Elite (Valor: 3)
- **Vaus do Isen**: 2 Regulares, 1 Líder
- **Abismo de Helm**: 1 Regular (Valor: 3)

#### **Elfos (verde claro):**
- **Portos Cinzentos**: 1 Regular, 1 Elite, 1 Líder (Valor: 9)
- **Valfenda**: 2 Elite, 1 Líder (Valor: 10)
- **Reino da Floresta**: 1 Regular, 1 Elite, 1 Líder (Valor: 9)
- **Lórien**: 1 Regular, 2 Elite, 1 Líder (Valor: 13)

#### **Anões (marrom):**
- **Erebor**: 1 Regular, 2 Elite, 1 Líder (Valor: 13)
- **Ered Luin**: 1 Regular
- **Colinas de Ferro**: 1 Regular

#### **Norte (azul claro):**
- **Bri**: 1 Regular
- **Carrocha**: 1 Regular
- **Valle**: 1 Regular, 1 Líder
- **Colinas do Norte**: 1 Elite
- **O Condado**: 1 Regular

### **SOMBRA (Unidades Vermelhas - controladas pelo Bot)**

#### **Sauron (vermelho):**
- **Barad-Dûr**: 4 Regulares, 1 Elite, 1 Nazgûl (Valor: 12)
- **Dol Guldur**: 5 Regulares, 1 Elite, 1 Nazgûl (Valor: 13, **Móvel**)
- **Gorgoroth**: 3 Regulares (Valor: 6)
- **Minas Morgul**: 5 Regulares, 1 Nazgûl (Valor: 11)
- **Moria**: 2 Regulares (Valor: 4)
- **Monte Gundabad**: 2 Regulares (Valor: 4)
- **Nurn**: 2 Regulares (Valor: 2)
- **Morannon**: 5 Regulares, 1 Nazgûl (Valor: 11)

#### **Isengard (amarelo/laranja):**
- **Orthanc**: 4 Regulares, 1 Elite (Valor: 11, **Móvel**)
- **Terra Parda do Norte**: 1 Regular (Valor: 2)
- **Terra Parda do Sul**: 1 Regular (Valor: 2)

#### **Sulistas & Orientais (laranja):**
- **Extremo Harad**: 3 Regulares, 1 Elite (Valor: 9)
- **Harad Próximo**: 3 Regulares, 1 Elite (Valor: 9)
- **Rhûn do Norte**: 2 Regulares (Valor: 4)
- **Rhûn do Sul**: 3 Regulares, 1 Elite (Valor: 9)
- **Umbar**: 3 Regulares (Valor: 6)

### **Alvos Iniciais dos Exércitos da Sombra**

Conforme `starting-stats.md`, os exércitos da Sombra têm os seguintes alvos iniciais:

- **Monte Gundabad** → **Reino da Floresta** (Woodland Realm)
- **Moria** → **Lórien**
- **Dol Guldur** → **Reino da Floresta** (Woodland Realm)
- **Terra Parda do Norte** → **Valfenda** (Rivendell)
- **Terra Parda do Sul** → **Abismo de Helm**
- **Orthanc** → **Abismo de Helm**
- **Rhûn do Norte** → **Reino da Floresta** (Woodland Realm)
- **Rhûn do Sul** → **Erebor**
- **Barad-Dûr** → **Minas Tirith**
- **Morannon** → **Minas Tirith**
- **Minas Morgul** → **Minas Tirith**
- **Gorgoroth** → **Minas Tirith**
- **Nurn** → **Minas Tirith**
- **Umbar** → **Minas Tirith**
- **Harad Próximo** → **Minas Tirith**
- **Extremo Harad** → **Minas Tirith**

### **Exércitos Móveis Iniciais**

Apenas dois exércitos da Sombra começam como **móveis**:
- **Dol Guldur** (Valor: 13)
- **Orthanc** (Valor: 11)

### **Reforços Disponíveis**

Coloque de lado as figuras restantes para usar como reforços, tomando cuidado para não misturá-las com as peças eliminadas à medida que o jogo prossegue.

**Povos Livres:**
- **Gondor**: 6 Regulares, 4 Elite, 3 Líder
- **Rohan**: 6 Regulares, 4 Elite, 3 Líder
- **Elfos**: 2 Regulares, 4 Elite
- **Anões**: 2 Regulares, 3 Elite, 3 Líder
- **Norte**: 6 Regulares, 4 Elite, 3 Líder

**Sombra:**
- **Isengard**: 6 Regulares, 5 Elite
- **Sauron**: 8 Regulares, 4 Elite, 4 Nazgûl
- **Sulistas & Orientais**: 10 Regulares, 3 Elite

## RESUMO DO ESTADO INICIAL

Após completar todos os passos acima, o jogo está pronto para começar:

- ✅ **Sociedade**: Em Valfenda, progresso 0, corrupção 0, escondida
- ✅ **Povos Livres**: 4 dados de ação
- ✅ **Sombra**: 7 dados de ação
- ✅ **Marcadores Políticos**: 
  - Gondor, Rohan, Anões, Norte: Passivos
  - Elfos: Ativos
  - Sauron, Isengard: Ativos (quase Em Guerra)
  - Sulistas, Orientais: Ativos
- ✅ **Exércitos**: Posicionados conforme descrição acima
- ✅ **Vassalos**: Separados (não no tabuleiro)
- ✅ **Cartas**: Embaralhadas e prontas
- ✅ **Peças de Busca**: Na reserva

**O jogo está pronto para começar!** O Queller Bot escolherá aleatoriamente uma estratégia inicial (Militar ou Corrupção) e a partida começará na Fase 1.

---

# Como o Bot Sabe o Estado do Tabuleiro

## Resposta Direta

**O bot NÃO mantém um estado interno do tabuleiro.** Ele depende completamente das respostas do jogador humano.

### Como Funciona na Prática

1. **O bot faz perguntas** sobre o estado atual:
   ```julia
   BinaryCondition("The Fellowship is on the Mordor track.")
   [true/false] > 
   ```

2. **Você responde** baseado no que vê no tabuleiro:
   - Fellowship está na trilha de Mordor? → `true` ou `false`
   - Progresso da Fellowship > 5? → `true` ou `false`
   - Exército móvel adjacente ao alvo? → `true` ou `false`

3. **O bot usa essas respostas** para decidir a próxima ação:
   - Se `true` → faz uma coisa
   - Se `false` → faz outra

### Por Que Funciona Assim?

O bot foi convertido de um PDF (Queller Bot) que também não mantinha estado. O PDF fazia perguntas e você respondia consultando o tabuleiro. O código mantém essa mesma abordagem.

### O Que o Bot NÃO Sabe Automaticamente

- ❌ Posição exata dos exércitos
- ❌ Controle de colônias
- ❌ Cartas na sua mão
- ❌ Progresso exato da Fellowship
- ❌ Corrupção atual
- ❌ Marcadores políticos

### O Que o Bot FAZ

- ✅ Apresenta as perguntas certas na ordem certa
- ✅ Guia você pelas decisões
- ✅ Mantém a lógica das regras do jogo
- ✅ Não deixa você se perder no fluxo de decisões

### Analogia

É como um GPS que não sabe onde você está: ele pergunta "você está na rua X?" e você responde. Com suas respostas, ele te guia.

**Em resumo:** O bot é um guia de decisões que depende das suas respostas sobre o estado do tabuleiro. Você é a "memória" do estado do jogo, o bot é a "lógica" que processa essas informações.

---

# Como o Bot Decide Movimentos Baseado nos Povos Livres

## Resposta Direta

**SIM, o bot toma decisões baseado no posicionamento dos Povos Livres**, mas ele não "vê" o tabuleiro - ele pergunta sobre essas condições e você responde.

### Como Funciona na Prática

#### 1. Cada Exército da Sombra tem um "Target" (Alvo)

O alvo é calculado baseado no posicionamento dos Povos Livres, nesta ordem:

```
TARGET (Alvo) - Prioridade:
1. Fortaleza da Sombra conquistada pelos Povos Livres
2. Exército dos Povos Livres que cria "threat" (ameaça)
3. Fortaleza dos Povos Livres não sitiada (prioriza nações em guerra)
4. Cidade dos Povos Livres não conquistada
```

O bot pergunta algo como:
```
"Um exército *móvel* está adjacente ao *alvo* não sob cerco?"
[true/false] > 
```

Você responde baseado no tabuleiro.

#### 2. O Conceito de "Threat" (Ameaça)

Uma região é "threat" se:
- Está a 2 regiões de uma fortaleza da Sombra não conquistada
- Contém um exército dos Povos Livres de uma nação ativa
- O exército dos Povos Livres tem maior valor que o exército da Sombra na fortaleza

O bot pergunta:
```
"Um exército dos Povos Livres cria uma *threat*?"
[true/false] > 
```

#### 3. Prioridades de Movimento

Quando o bot decide mover, ele usa estas prioridades (que dependem do posicionamento dos Povos Livres):

```julia
Prioridade de movimento:
1. Exército está adjacente ao seu *alvo*  ← depende de onde estão os Povos Livres
2. *Alvo* do exército está em uma nação em guerra  ← status político
3. Movimento não ativa uma nação
4. Exército cujo *alvo* está mais alto na lista de prioridades
5. Exército com maior *valor*
6. Região de destino contém a Sociedade  ← posição da Sociedade!
7. Aleatório
```

### Exemplo Prático

**Cenário:** Minas Tirith (fortaleza dos Povos Livres) está ocupada por exércitos de Gondor.

1. **O bot pergunta:**
   ```
   "Um exército *móvel* está adjacente ao *alvo* não sob cerco?"
   ```

2. **Você olha o tabuleiro** e vê que Barad-Dûr está adjacente a Minas Tirith:
   ```
   [true/false] > true
   ```

3. **O bot então pergunta:**
   ```
   "O *alvo* do exército está em uma nação em guerra?"
   ```

4. **Você verifica** se Gondor está "Em Guerra":
   ```
   [true/false] > true
   ```

5. **O bot decide:**
   ```
   → Atacar com exército adjacente ao *alvo* não sob cerco.
   Prioridade: Exército cujo *alvo* está em uma nação em guerra
   ```

### Resumo

- ✅ O bot decide baseado no posicionamento dos Povos Livres
- ❌ Mas ele não "vê" o tabuleiro - ele pergunta sobre condições
- ✅ Você responde baseado no que vê no tabuleiro
- ✅ O bot usa suas respostas para decidir movimentos/ataques seguindo prioridades definidas

É como um assistente que faz as perguntas certas na ordem certa, mas precisa que você informe o estado do tabuleiro para tomar as decisões.

---

# Principais Cenários de War of the Ring e Lógica do Queller Bot

## PRINCIPAIS CENÁRIOS DE UMA PARTIDA

### 1. **Vitória dos Povos Livres**
- **Vitória pelo Anel** (principal): Sociedade chega à Montanha da Perdição com Corrupção < 12
- **Vitória Militar**: Conquista 4+ Pontos de Vitória (fortalezas da Sombra)

### 2. **Vitória da Sombra**
- **Vitória Militar** (principal): Conquista 10+ Pontos de Vitória (cidades/fortalezas dos Povos Livres)
- **Vitória por Corrupção**: Corrupção da Sociedade atinge 12

### 3. **Estratégias Típicas**
- **Povos Livres**: Mover Sociedade, defender cidades-chave, ativar nações
- **Sombra (Bot)**: Estratégia Militar OU Estratégia Corrupção

---

## EXEMPLO DETALHADO: Fase 3 - Alocação para Busca (Estratégia Militar)

### CENÁRIO DO JOGO (Regras)

**Situação:**
- Turno 3
- Sociedade em progresso 6 (não está em Mordor)
- Bot escolheu Estratégia Militar

**Regras (Fase 3):**
1. O jogador da Sombra **deve** colocar pelo menos 1 dado se o jogador dos Povos Livres recuperou dados do Quadro de Busca no turno anterior
2. Pode alocar até o número de Companheiros na Sociedade
3. Esses dados **não são jogados** na Fase 4

**Decisão:** Quantos dados colocar no Quadro de Busca?

---

### LÓGICA DO QUELLER BOT (Fluxo)

O bot segue o grafo `phase-3.jl` com Estratégia Militar:

```julia
@node phase_3 = Start() -> p3_strat
@node p3_strat = CheckStrategy("military") -> [n_true=p3_mili_1, n_false=p3_corr_1]
```

Como a estratégia é "military", vai para `p3_mili_1`.

#### **Passo 1: Verifica se Sociedade está em Mordor**

```julia
@node p3_mili_1 = BinaryCondition("A Sociedade está na trilha de Mordor.")
    -> [n_true = p3_mili_1_yes, n_false = p3_mili_2]
```

**Pergunta ao jogador:**
```
A Sociedade está na trilha de Mordor.
[true/false] > 
```

**Resposta:** `false` (progresso 6, ainda não entrou em Mordor)

**Vai para:** `p3_mili_2`

#### **Passo 2: Verifica progresso da Sociedade**

```julia
@node p3_mili_2 = BinaryCondition("O progresso da Sociedade é maior que 5.")
    -> [n_true = p3_mili_2_yes, n_false = p3_mili_3]
```

**Pergunta:**
```
O progresso da Sociedade é maior que 5.
[true/false] > 
```

**Resposta:** `true` (progresso 6 > 5)

**Vai para:** `p3_mili_2_yes`

#### **Passo 3: Decisão Final**

```julia
@node p3_mili_2_yes = PerformAction("Atribuir 2 dados à reserva de caça.")
    -> p3_mili_end_phase
```

**Ação:**
```
→ Atribuir 2 dados à reserva de caça.
[Press enter to continue]
```

---

### ÁRVORE DE DECISÃO COMPLETA (Estratégia Militar)

```
FASE 3 - ESTRATÉGIA MILITAR
│
├─ Sociedade em Mordor?
│  ├─ SIM → Colocar TODOS os dados (máximo)
│  └─ NÃO → Progresso > 5?
│     ├─ SIM → Colocar 2 dados ✅ (nosso caso)
│     └─ NÃO → Progresso = 0?
│        ├─ SIM → Colocar 0 dados
│        └─ NÃO → Colocar 1 dado
```

---

## COMPARAÇÃO: REGRAS vs LÓGICA DO BOT

### **Regras do Jogo:**
- **Mínimo:** 1 dado (se Povos Livres recuperaram dados)
- **Máximo:** número de Companheiros na Sociedade
- **Decisão:** livre do jogador

### **Lógica do Queller Bot (Estratégia Militar):**
- **Prioriza caça moderada** quando Sociedade está avançada (progresso > 5)
- **Máxima caça** se Sociedade está em Mordor
- **Mínima caça** se Sociedade está no início (progresso 0)
- **Não considera** número de Companheiros automaticamente (depende da resposta do jogador)

---

## OUTRO EXEMPLO: Fase 5 - Resolução de Ações (Movimento)

### **Cenário:**
- Fase 5: Resolução de Ações
- Dado de Exército disponível
- Exército da Sombra em Barad-Dûr
- Minas Tirith (fortaleza dos Povos Livres) adjacente

### **Regras do Jogo:**
- Pode mover até 2 exércitos para regiões adjacentes livres
- Pode atacar exército inimigo adjacente
- Prioridades: não definidas nas regras (escolha do jogador)

### **Lógica do Queller Bot:**

O bot segue `movement-attack.jl`:

#### **Passo 1: Verifica se exército móvel está adjacente ao alvo**

```julia
@node mv_1 = BinaryCondition("Um exército *móvel* está adjacente ao *alvo* não sob cerco.")
    -> [n_true = mv_1_yes, n_false = mv_1_return]
```

**Pergunta:**
```
Um exército *móvel* está adjacente ao *alvo* não sob cerco.
[true/false] > 
```

**Resposta:** `true` (Barad-Dûr adjacente a Minas Tirith, que é o alvo)

#### **Passo 2: Usa o dado e ataca**

```julia
@node mv_1_yes = UseActiveDie() -> mv_1_action
@node mv_1_action = PerformAction("""
    Atacar com exército adjacente ao *alvo* não sob cerco.
    
    Prioridade:
    1. Exército cujo *alvo* está em uma nação em guerra
    2. Exército cujo ataque não colocaria uma nação em guerra
    3. Exército cujo *alvo* está em uma nação ativa
    4. Exército de maior *valor*
    5. Aleatório
    """)
```

**Ação:**
```
→ Atacar com exército adjacente ao *alvo* não sob cerco.

Prioridade:
1. Exército cujo *alvo* está em uma nação em guerra
2. Exército cujo ataque não colocaria uma nação em guerra
...
[Press enter to continue]
```

---

## RESUMO DA LÓGICA DO QUELLER BOT

### **Princípios Gerais:**

1. **Estratégia Binária**: Militar OU Corrupção
2. **Decisões Baseadas em Perguntas**: Bot pergunta, jogador responde
3. **Prioridades Fixas**: Cada tipo de ação tem prioridades definidas
4. **Fluxo Determinístico**: Sempre segue o mesmo grafo

### **Fluxo Típico de uma Fase:**

```
1. Start → Verifica estratégia
2. Faz perguntas (BinaryCondition)
3. Jogador responde (true/false)
4. Bot decide ação baseado na resposta
5. Executa ação (PerformAction)
6. End → Próxima fase
```

### **Estratégia Militar vs Corrupção:**

| Aspecto | Militar | Corrupção |
|---------|---------|-----------|
| **Foco** | Conquista territorial | Caça à Sociedade |
| **Caça** | Moderada (1-2 dados) | Intensa (máximo quando possível) |
| **Movimento** | Prioriza alvos militares | Prioriza região da Sociedade |
| **Recrutamento** | Foco em exércitos grandes | Equilibrado |

---

---

## CENÁRIO 3: COMBATE E CERCOS

### REGRAS DO JOGO - COMBATE

**Mecânica de Combate:**
1. **Batalha Campal**: Combate normal em campo aberto
   - Atacante marca destruição com 5+ (primeira rodada em cidade/fortificação: 6+)
   - Defensor marca destruição com 5+
   - Múltiplas rodadas até alguém recuar ou ser eliminado

2. **Batalha de Cerco**: Ataque a fortaleza sitiada
   - Atacante marca destruição apenas com 6+
   - Defensor marca destruição com 5+
   - Dura apenas 1 rodada (pode estender rebaixando Elite)

3. **Recuar para Fortaleza**: Defensor pode recuar para dentro da fortaleza
   - Fortaleza fica sitiada
   - Máximo 5 unidades na fortaleza sitiada
   - Região ao redor fica livre para o atacante

4. **Sortida**: Exército sitiado pode atacar o sitiante
   - Combate campal (sem vantagens defensivas)
   - Se perder, volta para fortaleza

### LÓGICA DO QUELLER BOT - COMBATE

O bot segue `battle.jl` com uma árvore de decisão complexa:

#### **Passo 1: Formar Retaguarda**

```julia
@node rearguard = PerformAction("Todas as unidades de nações que não estão em guerra formam a retaguarda.")
```

**Ação:**
```
→ Todas as unidades de nações que não estão em guerra formam a retaguarda.
[Press enter]
```

#### **Passo 2: Verificar se está Atacando ou Defendendo**

```julia
@node army_attacking = BinaryCondition("O exército da Sombra está atacando.")
    -> [n_true = is_sortie, n_false = def_in_stronghold]
```

**Pergunta:**
```
O exército da Sombra está atacando.
[true/false] > 
```

#### **Cenário A: Defendendo em Fortaleza**

Se `false` (defendendo), o bot verifica:

```julia
@node def_in_stronghold = BinaryCondition("""
    O exército da Sombra está se defendendo em uma região com uma fortaleza.
    """) -> [n_true = should_retreat_to_stronghold, n_false = field_def_card_prio]
```

**Se defendendo em fortaleza**, verifica se deve recuar:

```julia
@node should_retreat_to_stronghold = BinaryCondition("""
    O exército da Sombra não está sob cerco.
    E, o *valor* é menor ou igual ao do exército atacante.
    E, o número de unidades é menor que 8.
    """) -> [n_true = retreat_to_stronghold, n_false = def_card_prio]
```

**Lógica:** Recua para fortaleza se:
- Não está já sitiado
- Valor menor ou igual ao atacante
- Menos de 8 unidades

**Prioridades de Cartas de Combate (Defesa):**

```
1. Carta de Estratégia que cancela a carta dos Povos Livres
2. Não usa o termo "Sociedade revelada"
3. Não adiciona uma peça de caçada ou corrupção
4. Carta de Personagem
5. Ordem crescente de iniciativa
6. Aleatório
```

#### **Cenário B: Atacando (Batalha Normal)**

Se `true` (atacando), verifica se é sortida:

```julia
@node is_sortie = BinaryCondition("A batalha é uma sortida.")
    -> [n_true = sortie_card_prio, n_false = army_with_wk]
```

**Se não é sortida**, verifica se tem Rei dos Bruxos:

```julia
@node army_with_wk = BinaryCondition("O exército inclui o Rei Bruxo.")
    -> [n_true = wk_card_prio, n_false = should_play_card]
```

**Prioridades com Rei dos Bruxos:**
```
1. Carta de Estratégia
2. Bane de Durin
3. Carta de Personagem
4. Não usa "Sociedade revelada"
5. Não adiciona peça de caçada/corrupção
6. Ordem crescente de iniciativa
7. Aleatório
```

**Se não tem Rei dos Bruxos**, verifica se deve jogar carta:

```julia
@node should_play_card = BinaryCondition("""
    A Sombra está conduzindo um cerco.
    Ou, a Sombra está segurando mais de 4 cartas.
    """) -> [n_true = attack_card_prio, n_false = attack_play_no_card]
```

**Lógica:** Joga carta se:
- Está em cerco (prioridade alta)
- OU tem mais de 4 cartas (evita descarte)

#### **Passo 3: Resolver Combate**

```julia
@node battle_resolve = Start() -> roll
@node roll = PerformAction("Rolar para combate e rerolar erros.") -> casualties
@node casualties = PerformAction("""
    Remover baixas.
    
    Prioridade:
    1. Maximiza efeito da carta jogada
    2. Retém o maior *valor* de exército com o menor número de unidades
    3. Mantém uma unidade de cada nação
    4. Aleatório
    """)
```

#### **Passo 4: Decidir se Continua a Batalha**

```julia
@node press_on = BinaryCondition("""
    Uma batalha de campo foi lutada.
    """) -> [n_true = aggressive_if_continue, n_false = mili_strat]
```

**Lógica de Continuar:**
- Se batalha campal: continua se exército é *agressivo*
- Se estratégia militar: continua se *agressivo*
- Se estratégia corrupção: continua apenas se Sociedade em Mordor
- Em cerco: continua se tem Elite para rebaixar

```julia
@node aggressive_if_continue = BinaryCondition("""
    O exército da Sombra é *agressivo* e, se uma batalha de cerco estiver sendo lutada, 
    permaneceria *agressivo* após um rebaixamento de Elite para continuar a batalha.
    """) -> [n_true = another_round_if_possible, n_false = no_more_round_2]
```

---

## CENÁRIO 4: RECRUTAMENTO (MUSTER)

### REGRAS DO JOGO - RECRUTAMENTO

**Mecânica de Recrutamento:**
1. **Usando Dado de Alistamento:**
   - 2 unidades Regulares, OU
   - 2 Líderes/Nazgûl, OU
   - 1 Regular + 1 Líder/Nazgûl, OU
   - 1 unidade Elite

2. **Restrições:**
   - Apenas em Cidades, Vilas ou Fortalezas da própria nação
   - Nações devem estar "Em Guerra" (exceto cartas de evento)
   - Não pode recrutar em colônias capturadas
   - Não pode recrutar em fortalezas sitiadas (exceto cartas)

3. **Recrutamento de Vassalos:**
   - Saruman: em Orthanc
   - Rei dos Bruxos: em fortaleza de Sauron
   - Boca de Sauron: em fortaleza de Sauron

### LÓGICA DO QUELLER BOT - RECRUTAMENTO

O bot segue `muster.jl` com prioridades complexas:

#### **Prioridade 1: Recrutar Vassalo (Minion)**

```julia
@node m_2 = BinaryCondition("Servo pode ser recrutado.")
    -> [n_true = m_2_1, n_false = m_2_return]
```

**Prioridade de Vassalos:**
```
1. Saruman
2. Rei Bruxo
3. Boca de Sauron
```

**Condição Especial - Reservar Dado:**
```julia
@node m_2_1 = BinaryCondition("""
    Os Povos Livres têm um dado Vontade do Oeste.
    E, Gandalf, o Branco não foi recrutado.
    E, nenhum servo foi recrutado.
    """) -> [n_true = m_2_1_yes, n_false = m_2_minion_selection]
```

**Lógica:** Se Povos Livres têm "Desígnio do Oeste" e podem recrutar Gandalf, o bot **reserva um dado** para recrutar um vassalo como última ação (para não desperdiçar o dado).

#### **Prioridade 2: Política (Mover Nações para Guerra)**

```julia
@node m_3 = BinaryCondition("Uma nação da Sombra não está em guerra.")
    -> [n_true = m_3_yes, n_false = m_3_return]
```

**Prioridade de Nações:**
```
1. Isengard
2. Sauron
3. Sulistas e Orientais
```

#### **Prioridade 3: Carta de Mobilização**

```julia
@node m_4 = BinaryCondition("Uma carta que mobiliza é *jogável*.")
    -> [n_true = m_4_die, n_false = m_5]
```

**Prioridade:**
```
1. Ordem crescente de iniciativa
2. Aleatório
```

#### **Prioridade 4: Recrutamento Normal**

O bot verifica várias condições em ordem:

**4.1 - Criar Região Exposta:**
```julia
@node m_6 = BinaryCondition("Mobilização pode criar uma região *exposta*.")
    -> [n_true = m_6_die, n_false = m_7]
```

**Prioridade de Foco:**
```
1. Região que cria uma região *exposta*
2. Aleatório
```

**Recrutar:**
- Primário: Elite
- Secundário: Regular

**4.2 - Próximo à Sociedade:**
```julia
@node m_7 = BinaryCondition("""
    A Sociedade está adjacente a, ou em, uma região onde é possível recrutar.
    E, o progresso colocou a Sociedade fora de Mordor.
    E, nenhum exército está adjacente à região atual da Sociedade.
    """) -> [n_true = m_7_die, n_false = m_8]
```

**Prioridade de Foco:**
```
1. Região atual da Sociedade
```

**Recrutar:**
- Primário: Regular
- Secundário: Nazgûl

**4.3 - Em Exército Existente:**
```julia
@node m_8 = BinaryCondition("Recrutamento é possível em uma região contendo um exército da Sombra.")
    -> [n_true = m_8_die, n_false = m_9]
```

**Prioridade de Foco:**
```
1. Exército está conduzindo um cerco
2. Exército é *móvel*
3. Exército se torna móvel se Boca de Sauron for adicionado
4. Exército contém Saruman
5. Exército com maior *valor*
6. Aleatório
```

**4.4 - Recrutamento Geral:**
```julia
@node m_9 = BinaryCondition("Menos de 6 Nazgûl estão em jogo.")
    -> [n_true = m_10_yes, n_false = m_10_no]
```

**Se < 6 Nazgûl:**
- Primário: Nazgûl
- Secundário: Nazgûl

**Se ≥ 6 Nazgûl:**
- Primário: Elite
- Secundário: Nazgûl

**Prioridade de Foco (ambos):**
```
1. Mais próximo de exército cujo *alvo* está em nação em guerra
2. Mais próximo de exército cujo *alvo* está em nação ativa
3. Mais próximo de um exército *móvel*
4. Mais próximo de exército cujo *alvo* está em nação passiva
5. Aleatório
```

---

## CENÁRIO 5: CARTAS DE EVENTO

### REGRAS DO JOGO - CARTAS DE EVENTO

**Mecânica de Cartas:**
1. **Comprar Cartas:**
   - Fase 1: 2 cartas de cada baralho (Estratégia e Personagem)
   - Durante jogo: usar dado Evento para comprar

2. **Jogar Cartas:**
   - Usar dado Evento, OU
   - Usar dado com ícone correspondente ao tipo da carta
   - Máximo 6 cartas na mão

3. **Tipos de Cartas:**
   - **Estratégia**: Ações militares e políticas
   - **Personagem**: Ações relacionadas à Sociedade e personagens

4. **Cartas de Combate:**
   - Todas as cartas podem ser usadas como cartas de combate
   - Não requer ação (jogada durante batalha)
   - Sempre descartadas após uso

### LÓGICA DO QUELLER BOT - CARTAS

O bot segue `event-cards.jl` com diferentes fluxos por estratégia:

#### **Fluxo 1: Cartas Preferidas (Estratégia Específica)**

```julia
@node event_cards_preferred = Start() -> ep_1_strat
@node ep_1_strat = CheckStrategy("military") -> [n_true = ep_1_mili, n_false = ep_1_corr]
```

**Estratégia Militar:**
```julia
@node ep_1_mili = BinaryCondition("Uma carta com tipo exército ou mobilização é *jogável*.")
    -> [n_true = ep_2_yes, n_false = ep_return]
```

**Estratégia Corrupção:**
```julia
@node ep_1_corr = BinaryCondition("Uma carta com tipo personagem é *jogável*.")
    -> [n_true = ep_2_yes, n_false = ep_return]
```

**Prioridade de Jogar:**
```
1. Ordem Crescente de Iniciativa
2. Aleatório
```

#### **Fluxo 2: Cartas Gerais**

**2.1 - Comprar se < 4 cartas:**
```julia
@node eg_1 = BinaryCondition("Segurando menos de 4 cartas.")
    -> [n_true = eg_1_yes, n_false = eg_2]
```

**Estratégia Militar:** Compra carta de Estratégia
**Estratégia Corrupção:** Compra carta de Personagem

**2.2 - Jogar se possível:**
```julia
@node eg_2 = BinaryCondition("Uma carta é *jogável*.")
    -> [n_true = eg_2_yes, n_false = eg_3]
```

**Prioridade:**
```
1. Ordem crescente de iniciativa
2. Aleatório
```

**2.3 - Comprar e descartar:**
```julia
@node eg_3_discard = BinaryCondition("Segurando mais de 6 cartas.")
    -> [n_true = eg_3_discard_strat, n_false = eg_3_end]
```

**Estratégia Militar - Prioridade de Descarte:**
```
1. Não é uma carta com tipo exército ou mobilização
2. Não usa o termo "Sociedade revelada"
3. Não coloca uma peça
4. Ordem crescente de iniciativa
5. Aleatório
```

**Estratégia Corrupção - Prioridade de Descarte:**
```
1. Não é uma carta com tipo personagem
2. Não usa o termo "Sociedade revelada"
3. Não coloca uma peça
4. Ordem crescente de iniciativa
5. Aleatório
```

#### **Fluxo 3: Cartas de Corrupção (Estratégia Corrupção)**

```julia
@node event_cards_corruption = Start() -> ec_1
```

**Prioridade 1: Cartas "Sociedade Revelada"**
```julia
@node ec_1 = BinaryCondition("Uma carta 'Sociedade revelada' é *jogável*.")
    -> [n_true = ec_1_yes, n_false = ec_2]
```

**Prioridade 2: Cartas de Corrupção/Caçada**
```julia
@node ec_2 = BinaryCondition("""
    Uma carta que adiciona corrupção ou adiciona uma peça de caçada é *jogável*.
    """) -> [n_true = ec_2_yes, n_false = ec_3]
```

**Prioridade 3: Comprar se < 4 cartas**
```julia
@node ec_3 = BinaryCondition("Segurando menos de 4 cartas.")
    -> [n_true = ec_3_yes, n_false = ec_return]
```

---

## CENÁRIO 6: PERSONAGENS (VASSALOS E NAZGÛL)

### REGRAS DO JOGO - PERSONAGENS

**Mecânica de Personagens:**
1. **Vassalos da Sombra:**
   - **Saruman**: Fica em Orthanc, pode recrutar tropas
   - **Rei dos Bruxos**: Pode se mover livremente, lidera exércitos
   - **Boca de Sauron**: Pode se mover (3 regiões), lidera exércitos

2. **Nazgûl:**
   - Movimento ilimitado (exceto fortalezas dos Povos Livres não sitiadas)
   - Podem liderar exércitos
   - Recrutados em fortalezas de Sauron

3. **Ações de Personagem:**
   - Usar dado Personagem para mover todos os Nazgûl/Vassalos
   - Participar de combates
   - Ativar habilidades especiais

### LÓGICA DO QUELLER BOT - PERSONAGENS

O bot segue `character.jl` com prioridades específicas:

#### **Prioridade de Movimento de Personagens**

**1. Rei dos Bruxos:**
```julia
@node lc_wk = BinaryCondition(MOVE_WK_CONDITION)
    -> [n_true = lc_wk_yes, n_false = lc_naz_1]
```

**Prioridade de Movimento:**
```
1. Em direção a exército com *valor* de liderança menor que número de unidades e 5
2. Em direção a exército *móvel*
3. Em direção a exército adjacente ao seu *alvo*
4. Exército que pode ser alcançado com este dado
5. Em direção ao exército mais próximo
6. Aleatório
```

**2. Nazgûl:**
```julia
@node lc_naz_1 = BinaryCondition(MOVE_NAZGUL_CONDITION)
    -> [n_true = lc_naz_1_yes, n_false = lc_mos_1]
```

**Prioridade similar ao Rei dos Bruxos**

**3. Boca de Sauron:**
```julia
@node lc_mos_1 = BinaryCondition(MOVE_MOS_CONDITION)
    -> [n_true = lc_mos_1_yes, n_false = ...]
```

**Prioridade:**
```
1. Em direção a exército com *valor* de liderança menor que número de unidades e 5
2. Em direção a exército *móvel*
3. Em direção a exército adjacente ao seu *alvo*
4. Exército que pode ser alcançado com este dado
5. Em direção ao exército mais próximo
6. Aleatório
```

#### **Prioridade de Recrutamento de Vassalos**

**Rei dos Bruxos:**
```
1. Exército é *móvel*
2. *Alvo* do exército está em nação em guerra
3. Exército se torna *móvel* se o Rei Bruxo for adicionado
4. Exército dos Povos Livres no *alvo* ou na rota não contém Gandalf, o Branco
5. Exército dos Povos Livres no *alvo* ou na rota não contém um hobbit
6. Exército está adjacente a uma *ameaça*
7. Exército que está conduzindo um cerco
8. Exército está adjacente ao seu *alvo*
9. Exército da Sombra de maior *valor*
10. Aleatório
```

**Boca de Sauron:**
```
1. Exército está conduzindo um cerco
2. Exército é *móvel*
3. Exército se torna *móvel* se Boca de Sauron for adicionado
4. Exército contém Saruman
5. Exército com o maior *valor*
6. Fortaleza mais próxima de exército cujo *alvo* está em nação em guerra
7. Fortaleza mais próxima de exército cujo *alvo* está em nação ativa
8. Fortaleza mais próxima de exército cujo *alvo* está em nação passiva
9. Aleatório
```

---

## CENÁRIO 7: BUSCA PELO ANEL

### REGRAS DO JOGO - BUSCA

**Mecânica de Busca:**
1. **Teste de Busca:**
   - Nível da Busca = número de dados da Sombra no Quadro de Busca
   - Rola até 5 dados de combate
   - Cada 6 = sucesso

2. **Modificadores:**
   - +1 por cada dado dos Povos Livres no Quadro de Busca
   - Reavaliação: +1 relançamento por:
     - Fortaleza da Sombra na região
     - Unidades da Sombra na região
     - Nazgûl na região

3. **Efeitos da Busca:**
   - **Estrago da Busca**: Valor numérico (0-3) ou número de sucessos (se peça com Olho)
   - **Revelar**: Sociedade fica revelada
   - **Corrupção**: Estrago vira corrupção (ou pode sacrificar Companheiro)

4. **Trilha de Mordor:**
   - Quando Sociedade entra em Mordor, busca muda
   - Compra peça diretamente (sem rolar dados)
   - Peças com "Parar" impedem avanço

### LÓGICA DO QUELLER BOT - BUSCA

O bot não controla diretamente a busca (ela é automática quando a Sociedade se move), mas ele **aloca dados** na Fase 3:

**Estratégia Militar:**
- Progresso 0: 0 dados
- Progresso 1-5: 1 dado
- Progresso > 5: 2 dados
- Em Mordor: máximo

**Estratégia Corrupção:**
- Progresso 0: 1 dado (50% chance)
- Progresso 1-4: 1 dado
- Progresso > 4: 2 dados
- Em Mordor: máximo
- Condições especiais (exército móvel adjacente ao alvo que dá vitória): 1 dado

**Lógica:** O bot prioriza caça quando a Sociedade está avançada ou em Mordor, especialmente na estratégia de Corrupção.

---

## CENÁRIO 8: MUDANÇA DE ESTRATÉGIA (Fase 2)

### REGRAS DO JOGO - FASE 2

**Fase da Sociedade:**
- Povos Livres podem tornar a Sociedade pública
- Povos Livres podem curar corrupção (se em cidade/fortaleza)
- Povos Livres podem mudar o Guia

**Não há ação da Sombra nas regras**, mas o bot usa esta fase para **avaliar e mudar estratégia**.

### LÓGICA DO QUELLER BOT - FASE 2

O bot segue `phase-2.jl` para **mudança dinâmica de estratégia**:

```julia
@node phase_2 = Start() -> p2_check
@node p2_check = CheckStrategy("military") -> [n_true=p2_mili, n_false=p2_corr]
```

#### **Estratégia Militar Atual:**

```julia
@node p2_mili = BinaryCondition("""
    Os pontos de vitória das Sombras são menores que os pontos de corrupção 
    após os Povos Livres escolherem se revelam.
    """) -> [n_true=p2_mili_change, n_false=p2_mili_end]
```

**Pergunta:**
```
Os pontos de vitória das Sombras são menores que os pontos de corrupção 
após os Povos Livres escolherem se revelam.
[true/false] > 
```

**Se `true`:** Muda para estratégia Corrupção
```julia
@node p2_mili_change = SetStrategy("corruption") -> p2_mili_end
```

#### **Estratégia Corrupção Atual:**

```julia
@node p2_corr = BinaryCondition("""
    Os pontos de corrupção são menores que os pontos de vitória das Sombras 
    após os Povos Livres escolherem se revelam.
    """) -> [n_true=p2_corr_change, n_false=p2_corr_end]
```

**Se `true`:** Muda para estratégia Militar
```julia
@node p2_corr_change = SetStrategy("military") -> p2_corr_end
```

**Lógica:** O bot **adapta a estratégia** baseado em qual condição de vitória está mais próxima:
- Se Corrupção > Pontos de Vitória → Foca em Corrupção
- Se Pontos de Vitória > Corrupção → Foca em Militar

---

## CENÁRIO 9: FASE 1 - PREPARAÇÃO DO TURNO

### REGRAS DO JOGO - FASE 1

**Mecânica da Fase 1:**
1. **Recuperar Dados de Ação:**
   - Recupera todos os dados usados no turno anterior
   - Adiciona dados ganhos (Vassalos, Personagens)
   - Remove dados perdidos

2. **Comprar Cartas de Evento:**
   - Compra 2 cartas de cada baralho (Estratégia e Personagem)
   - Máximo 6 cartas na mão
   - Se exceder, deve descartar

### LÓGICA DO QUELLER BOT - FASE 1

O bot segue `phase-1.jl`:

#### **Estratégia Militar:**

```julia
@node p1_mili_1 = PerformAction("Recuperar dados de ação.") -> p1_mili_2
@node p1_mili_2 = PerformAction("Comprar cartas de evento.") -> p1_mili_3
@node p1_mili_3 = BinaryCondition("Segurando mais de 6 cartas.")
    -> [n_true = p1_mili_discard, n_false = p1_mili_end]
```

**Se tiver mais de 6 cartas, descarta com prioridade:**
```
1. Não usa o termo "Sociedade revelada"
2. Carta de personagem
3. Carta de estratégia
4. Ordem decrescente de iniciativa
5. Não coloca uma peça
6. Aleatório
```

#### **Estratégia Corrupção:**

```julia
@node p1_corr_1 = PerformAction("Recuperar dados de ação.") -> p1_corr_2
@node p1_corr_2 = PerformAction("Comprar cartas de evento.") -> p1_corr_3
@node p1_corr_3 = BinaryCondition("Segurando mais de 6 cartas.")
    -> [n_true = p1_corr_discard, n_false = p1_corr_end_1]
```

**Se tiver mais de 1 carta de estratégia:**
```
Prioridade de descarte:
1. Não usa "Sociedade revelada"
2. Não coloca uma peça
3. Carta de estratégia
4. Carta de personagem
5. Ordem decrescente de iniciativa
6. Aleatório
```

**Se tiver 0-1 cartas de estratégia:**
```
Prioridade de descarte:
1. Não usa "Sociedade revelada"
2. Não coloca uma peça
3. Carta de personagem
4. Carta de estratégia
5. Ordem decrescente de iniciativa
6. Aleatório
```

**Diferença:** Estratégia Corrupção prioriza manter cartas de Personagem (úteis para caça), enquanto Militar prioriza manter cartas de Estratégia/Exército.

---

## CENÁRIO 10: FASE 4 - JOGADA DE DADOS

### REGRAS DO JOGO - FASE 4

**Mecânica da Fase 4:**
1. **Jogar Dados:**
   - Todos os dados disponíveis são rolados
   - Dados no Quadro de Busca NÃO são rolados

2. **Resultados Olho:**
   - Todos os resultados "Olho" vão automaticamente para o Quadro de Busca
   - Não podem ser usados para ações

3. **Dados Disponíveis:**
   - Restantes após remover os "Olhos"
   - Usados na Fase 5 (Resolução de Ações)

### LÓGICA DO QUELLER BOT - FASE 4

O bot segue `phase-4.jl`:

```julia
@node phase_4 = Start() -> p4_roll
@node p4_roll = GetAvailableDice("""
    Role todos os dados de ação que não estão na caixa de caçada. 
    Coloque todos os resultados de Olho na caixa de caçada e insira os dados restantes.
    """) -> p4_end
```

**Ação:**
```
→ Role todos os dados de ação que não estão na caixa de caçada. 
  Coloque todos os resultados de Olho na caixa de caçada e insira os dados restantes.
[Insira os dados disponíveis] > 
```

**Lógica:** O bot simplesmente solicita que você role os dados e informe os resultados. Ele não rola automaticamente - você faz isso fisicamente e informa os resultados.

---

## RESUMO COMPARATIVO: TODAS AS FASES

| Fase | Regras do Jogo | Lógica do Queller Bot |
|------|----------------|----------------------|
| **Fase 1** | Recuperar dados, comprar 2 cartas de cada | Igual + descarte inteligente baseado em estratégia |
| **Fase 2** | Povos Livres: tornar pública, curar, mudar guia | Bot avalia e muda estratégia se necessário |
| **Fase 3** | Sombra: alocar dados para busca (mínimo 1 se Povos Livres recuperaram) | Aloca baseado em progresso da Sociedade e estratégia |
| **Fase 4** | Rolar dados, colocar Olhos na busca | Solicita resultados dos dados |
| **Fase 5** | Resolver ações alternadamente | Prioriza ações por estratégia (movimento, combate, recrutamento) |

---

---

## REFERÊNCIA RÁPIDA: PRIORIDADES DO BOT

### **MOVIMENTO DE EXÉRCITOS**

**Prioridade (movement-attack.jl):**
1. Exército adjacente ao alvo não sob cerco → **ATACAR**
2. Movimento para assentamento vazio (nação em guerra)
3. Fundir exércitos (aumenta valor ou cria exércitos móveis)
4. Mover em direção ao alvo
5. Movimento básico (não muda nação para "em guerra")

### **RECRUTAMENTO**

**Prioridade (muster.jl):**
1. Recrutar Vassalo (Saruman > Rei Bruxo > Boca de Sauron)
2. Mover nação para guerra (Isengard > Sauron > Sulistas/Orientais)
3. Carta de mobilização jogável
4. Criar região exposta
5. Próximo à Sociedade (se condições atendidas)
6. Em exército existente (prioriza cercos, exércitos móveis)
7. Recrutamento geral (prioriza Nazgûl se < 6 em jogo)

### **COMBATE**

**Prioridade de Cartas (battle.jl):**
- **Defesa:** Cancela carta dos Povos Livres > Não usa "Sociedade revelada" > Não adiciona peça
- **Ataque Normal:** Bane de Durin > Estratégia > Personagem > Não usa "Sociedade revelada"
- **Com Rei dos Bruxos:** Estratégia > Bane de Durin > Personagem
- **Sortida:** Personagem (não usa "Sociedade revelada") > Personagem (não adiciona peça)

**Prioridade de Baixas:**
1. Maximiza efeito da carta jogada
2. Retém maior valor com menor número de unidades
3. Mantém uma unidade de cada nação
4. Aleatório

**Continuar Batalha:**
- Batalha campal: Continua se exército é *agressivo*
- Estratégia militar: Continua se *agressivo*
- Estratégia corrupção: Continua apenas se Sociedade em Mordor
- Cerco: Continua se tem Elite para rebaixar

### **CARTAS DE EVENTO**

**Estratégia Militar:**
- Prioriza: Cartas Exército/Mobilização
- Compra: Carta de Estratégia (se < 4 cartas)
- Descarta: Não-Exército/Mobilização > Não usa "Sociedade revelada"

**Estratégia Corrupção:**
- Prioriza: Cartas Personagem > Cartas "Sociedade revelada" > Cartas Corrupção/Caçada
- Compra: Carta de Personagem (se < 4 cartas)
- Descarta: Não-Personagem > Não usa "Sociedade revelada"

---

## CONCLUSÃO

O Queller Bot:
- ✅ **Não vê o tabuleiro** - faz perguntas sobre o estado
- ✅ **Segue grafos de decisão fixos** por estratégia
- ✅ **Usa prioridades definidas** para cada tipo de ação
- ✅ **Mantém consistência** com as regras do jogo
- ✅ **Adapta estratégia dinamicamente** (Fase 2)
- ✅ **Prioriza ações eficientes** (exércitos móveis, alvos importantes)

É um **assistente que guia as decisões da Sombra** de forma consistente e previsível, baseado nas respostas do jogador sobre o estado do jogo. O bot implementa uma **IA determinística** que segue padrões de jogo experientes, priorizando sempre as ações mais eficientes para a estratégia escolhida.

---

## 📖 GLOSSÁRIO DE TERMOS TÉCNICOS

### **Conceitos Importantes:**

**Target (Alvo):**
- Cada exército da Sombra tem um alvo prioritário
- Calculado baseado em: Fortalezas conquistadas > Exércitos que criam threat > Fortalezas não sitiadas > Cidades

**Threat (Ameaça):**
- Região a 2 espaços de fortaleza da Sombra não conquistada
- Contém exército dos Povos Livres de nação ativa
- Exército dos Povos Livres tem maior valor que exército da Sombra na fortaleza

**Mobile (Móvel):**
- Exército que pode se mover em direção ao alvo sem criar threat
- É agressivo em relação a todos os exércitos no caminho mais curto

**Aggressive (Agressivo):**
- Exército de nação ativa com valor ≥ exército oponente
- OU exército no limite de concentração com Rei dos Bruxos ou 5 liderança

**Exposed (Exposta):**
- Região que é alvo de um exército da Sombra
- Não contém exército dos Povos Livres
- Caminho mais curto está livre de exércitos dos Povos Livres

**Value (Valor):**
- Pontos de combate do exército
- Calculado: unidades + dados de combate + liderança + bônus defensivos

---

## 🔗 ESTRUTURA DOS GRAFOS

### **Arquivos Principais:**

| Arquivo | Descrição | Quando é Usado |
|---------|-----------|----------------|
| `phase-1.jl` | Recuperar dados e comprar cartas | Início de cada turno |
| `phase-2.jl` | Mudança de estratégia | Após Fase da Sociedade |
| `phase-3.jl` | Alocação para busca | Antes de rolar dados |
| `phase-4.jl` | Jogada de dados | Após alocação |
| `phase-5.jl` | Resolução de ações | Principal fase do turno |
| `movement-attack.jl` | Movimento e ataques | Quando há dado Exército/Personagem |
| `battle.jl` | Resolução de combates | Durante batalhas |
| `muster.jl` | Recrutamento de tropas | Quando há dado Alistamento |
| `character.jl` | Ações de personagens | Quando há dado Personagem |
| `event-cards.jl` | Uso de cartas de evento | Quando há dado Evento ou carta jogável |

### **Tipos de Nós (Nodes):**

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `Start()` | Início do grafo | `@node phase_1 = Start() -> p1_strat` |
| `End()` | Fim do grafo | `@node p1_mili_end = End("Fim da Fase")` |
| `BinaryCondition()` | Pergunta sim/não | `BinaryCondition("Sociedade em Mordor?")` |
| `PerformAction()` | Ação a ser executada | `PerformAction("Atribuir 2 dados à busca")` |
| `MultipleChoice()` | Escolha entre opções | `MultipleChoice("Qual vassalo recrutar?")` |
| `CheckStrategy()` | Verifica estratégia atual | `CheckStrategy("military")` |
| `UseActiveDie()` | Usa um dado disponível | `UseActiveDie() -> action` |
| `GetAvailableDice()` | Solicita dados disponíveis | `GetAvailableDice("Role os dados")` |
| `JumpToGraph()` | Chama outro grafo | `JumpToGraph("battle")` |
| `ReturnFromGraph()` | Retorna do grafo chamado | `ReturnFromGraph()` |

---

## DICAS PARA USAR O BOT EFETIVAMENTE

### **Para o Jogador dos Povos Livres:**

1. **Entenda as Prioridades do Bot:**
   - O bot sempre prioriza exércitos adjacentes a alvos
   - Fortalezas em nações "Em Guerra" são alvos prioritários
   - O bot raramente ataca se não for agressivo

2. **Explore as Fraquezas:**
   - O bot não considera número de Companheiros automaticamente na Fase 3
   - O bot pode mudar de estratégia na Fase 2 (monitore isso)
   - O bot prioriza eficiência sobre surpresa

3. **Gerencie a Sociedade:**
   - Progresso baixo = menos caça (Estratégia Militar)
   - Múltiplos movimentos = busca mais fácil (modificador +1)
   - Evite fortalezas da Sombra quando possível

4. **Use a Política:**
   - Nações passivas não podem ser atacadas
   - O bot prioriza não ativar nações
   - Use isso para proteger regiões importantes

### **Entendendo as Decisões do Bot:**

- **Se o bot ataca:** Provavelmente o exército é agressivo e o alvo está em nação em guerra
- **Se o bot recua:** Valor menor que atacante, menos de 8 unidades, não está sitiado
- **Se o bot não joga carta:** Tem ≤ 4 cartas e não está em cerco
- **Se o bot muda estratégia:** Pontos de vitória vs corrupção mudaram

---

## SIMULAÇÃO DE PARTIDA COMPLETA PARA INICIANTES

Esta seção simula os primeiros 2 turnos de uma partida completa, explicando as regras e mostrando como usar o Queller Bot passo a passo.

### PREPARAÇÃO INICIAL

**Estado Inicial do Jogo:**
- **Sociedade**: Em Valfenda, progresso 0, corrupção 0, escondida
- **Povos Livres**: 4 dados de ação
- **Sombra**: 7 dados de ação
- **Marcadores Políticos**: 
  - Gondor, Rohan, Anões, Norte: Passivos
  - Elfos: Ativos
  - Sauron, Isengard: Em Guerra
  - Sulistas, Orientais: Passivos

**Exércitos Iniciais:**
- **Minas Tirith**: 3 Regulares, 1 Elite, 1 Líder (Valor: 15)
- **Barad-Dûr**: 4 Regulares, 1 Elite, 1 Nazgûl (Valor: 12)
- **Orthanc**: 4 Regulares, 1 Elite (Valor: 11)
- E outros conforme setup padrão

---

### TURNO 1 - PASSO A PASSO

#### FASE 1: RECUPERAR DADOS E COMPRAR CARTAS

**Regras do Jogo:**
- Cada jogador recupera seus dados de ação
- Cada jogador compra 2 cartas de cada baralho (Estratégia e Personagem)
- Se tiver mais de 6 cartas, deve descartar

**Usando o Queller Bot:**

```
$ ./QuellerCLI

Queller CLI: IA das Sombras para War of the Ring

Digite 'ajuda' e pressione enter para mais informações...
```

**O bot inicia automaticamente na Fase 1:**

```
═══════════════════════════════════════
 FASE 1: RECUPERAR E COMPRAR
═══════════════════════════════════════

→ Recuperar dados de ação.
[Press enter to continue]
```

**Você faz:**
1. Recupera seus 4 dados dos Povos Livres
2. Recupera os 7 dados da Sombra
3. Pressiona Enter

**Próximo passo do bot:**

```
→ Comprar cartas de evento.
[Press enter to continue]
```

**Você faz:**
1. Compra 2 cartas de Estratégia dos Povos Livres
2. Compra 2 cartas de Personagem dos Povos Livres
3. Compra 2 cartas de Estratégia da Sombra
4. Compra 2 cartas de Personagem da Sombra
5. Pressiona Enter

**O bot verifica se precisa descartar:**

```
Segurando mais de 6 cartas.
[true/false] > 
```

**Você verifica:** A Sombra tem 4 cartas (2+2), então:
```
> false
```

**Fase 1 completa!**

---

#### FASE 2: FASE DA SOCIEDADE

**Regras do Jogo:**
- Você (Povos Livres) pode tornar a Sociedade pública
- Se tornar pública em cidade/fortaleza dos Povos Livres, pode curar 1 corrupção
- Pode mudar o Guia da Sociedade

**Usando o Queller Bot:**

O bot verifica a estratégia e possivelmente muda:

```
═══════════════════════════════════════
 FASE 2: FASE DA SOCIEDADE
═══════════════════════════════════════

Os pontos de vitória das Sombras são menores que os pontos de corrupção 
após os Povos Livres escolherem se revelam.
[true/false] > 
```

**Você verifica:**
- Pontos de Vitória da Sombra: 0 (nenhuma conquista ainda)
- Corrupção: 0
- Você não revelou a Sociedade

**Resposta:**
```
> false
```

**O bot mantém a estratégia atual (Militar ou Corrupção - escolhida aleatoriamente no início).**

**Você (Povos Livres) decide:**
- Não tornar a Sociedade pública (mantém escondida)
- Mantém Gandalf como Guia
- Não há corrupção para curar

**Fase 2 completa!**

---

#### FASE 3: ALOCAÇÃO PARA BUSCA

**Regras do Jogo:**
- A Sombra pode colocar dados no Quadro de Busca
- Mínimo: 1 dado (se Povos Livres recuperaram dados da busca no turno anterior)
- Máximo: número de Companheiros na Sociedade

**Usando o Queller Bot:**

O bot escolheu **Estratégia Militar** (aleatório no primeiro turno):

```
═══════════════════════════════════════
 FASE 3: ALOCAÇÃO PARA BUSCA
═══════════════════════════════════════

A Sociedade está na trilha de Mordor.
[true/false] > 
```

**Você verifica:** Sociedade está em Valfenda, não entrou em Mordor ainda:
```
> false
```

**Próxima pergunta:**

```
O progresso da Sociedade é maior que 5.
[true/false] > 
```

**Você verifica:** Progresso = 0:
```
> false
```

**Próxima pergunta:**

```
A Sociedade está na posição inicial e seu progresso é 0.
[true/false] > 
```

**Você verifica:** Sim, está em Valfenda (posição inicial) e progresso = 0:
```
> true
```

**Decisão do bot:**

```
→ Atribuir 0 dados à reserva de caça.
[Press enter to continue]
```

**Explicação:** Na Estratégia Militar, se a Sociedade está no início (progresso 0), o bot prioriza ações militares e não aloca dados para busca.

**Você faz:**
- Não coloca nenhum dado no Quadro de Busca
- Pressiona Enter

**Fase 3 completa!**

---

#### FASE 4: JOGADA DE AÇÃO

**Regras do Jogo:**
- Cada jogador rola seus dados de ação
- Dados no Quadro de Busca NÃO são rolados
- Todos os resultados "Olho" vão automaticamente para o Quadro de Busca

**Usando o Queller Bot:**

```
═══════════════════════════════════════
 FASE 4: JOGADA DE AÇÃO
═══════════════════════════════════════

→ Role todos os dados de ação que não estão na caixa de caçada. 
  Coloque todos os resultados de Olho na caixa de caçada e insira os dados restantes.
[Insira os dados disponíveis] > 
```

**Você faz:**
1. Rola seus 4 dados dos Povos Livres: `Personagem, Exército, Alistamento, Evento`
2. Rola os 7 dados da Sombra: `Olho, Personagem, Exército, Exército, Alistamento, Alistamento/Exército, Evento`
3. O resultado "Olho" vai automaticamente para o Quadro de Busca
4. Informa os dados restantes da Sombra: `Personagem, Exército, Exército, Alistamento, Alistamento/Exército, Evento`

**Exemplo de entrada:**
```
> Personagem, Exército, Exército, Alistamento, Alistamento/Exército, Evento
```

**Fase 4 completa!**

---

#### FASE 5: RESOLUÇÃO DE AÇÕES

**Regras do Jogo:**
- Jogadores alternam ações usando seus dados
- Povos Livres começam
- Cada ação usa um dado
- Quando a Sociedade se move, o dado vai para o Quadro de Busca

**Usando o Queller Bot:**

O bot mostra o menu da Fase 5:

```
Dados Disponíveis: Alistamento,Alistamento/Exército,Evento,Exército,Exército,Personagem

Selecione a ação da fase 5.

1. Escolher ação das Sombras
2. Resolver um efeito de carta
3. Resolver uma batalha
4. Recrutar um lacaio como ação final das Sombras com dado reservado anteriormente
5. Alterar os dados disponíveis (use isto se os dados disponíveis do bot não correspondem à realidade)
6. Encerrar turno e ir para a fase 1
```

**Você escolhe:**
```
> 1
```

**O bot inicia a seleção de ação:**

**Passo 1 - Verifica se há exército agressivo adjacente:**

```
Um exército *agressivo* está adjacente a um exército dos Povos Livres.
[true/false] > 
```

**Você verifica o tabuleiro:**
- Barad-Dûr (Valor 12) está adjacente a Minas Tirith (Valor 15)
- Barad-Dûr tem 1 Nazgûl (liderança)
- Sauron está "Em Guerra"
- Barad-Dûr é agressivo? Valor 12 < 15, mas tem Nazgûl... Verifica: Exército agressivo se nação ativa E valor ≥ oponente OU limite de concentração com Rei dos Bruxos/5 liderança
- Barad-Dûr não está no limite (5 unidades), então não é agressivo ainda

**Resposta:**
```
> false
```

**Passo 2 - Verifica se há exército móvel com liderança:**

```
Um exército *móvel* com liderança pode se mover ou atacar.
[true/false] > 
```

**Você verifica:**
- Dol Guldur tem 5 Regulares, 1 Elite, 1 Nazgûl (Valor 13)
- É móvel? Sim (conforme starting-stats.md)
- Tem liderança? Sim (Nazgûl)
- Pode se mover em direção ao alvo (Woodland Realm)?

**Resposta:**
```
> true
```

**O bot decide usar um dado:**

```
→ Selecionar um exército *móvel* e mover ou atacar em direção ao *alvo*.

Prioridade:
1. Exército está adjacente ao seu *alvo*
2. *Alvo* do exército está em uma nação em guerra
3. Movimento/ataque não ativa uma nação
4. Movimento/ataque não muda uma nação para "em guerra"
5. Exército cujo *alvo* está mais alto na lista de prioridades na definição de *alvo*
6. Exército com maior *valor*
7. Movimento/ataque não bloqueia a rota mais curta de outro exército *móvel* para seu *alvo*
8. Região de destino contém a Sociedade
9. Aleatório
[Press enter to continue]
```

**Você executa:**
- Dol Guldur (Valor 13) move em direção a Woodland Realm
- Move 1 região adjacente (conforme regras de movimento)
- O dado usado é removido dos disponíveis

**Você (Povos Livres) faz sua ação:**
- Usa dado Personagem para mover a Sociedade
- Move progresso de 0 para 1
- Coloca o dado no Quadro de Busca (regra: quando Sociedade se move)

**O bot continua com próximo dado...**

**E assim por diante até todos os dados serem usados.**

**Quando terminar, escolhe opção 6:**
```
> 6
```

**Confirmação:**
```
Sair da fase 5 e retornar à fase 1.
[true/false] > true
```

**Turno 1 completo!**

---

### TURNO 2 - EXEMPLO DE DECISÕES MAIS COMPLEXAS

#### FASE 3: ALOCAÇÃO PARA BUSCA (Cenário Diferente)

**Situação:**
- Sociedade em progresso 3
- Bot escolheu Estratégia Militar
- Povos Livres recuperaram 1 dado do Quadro de Busca no turno anterior

**O bot pergunta:**

```
A Sociedade está na trilha de Mordor.
[true/false] > false

O progresso da Sociedade é maior que 5.
[true/false] > false

A Sociedade está na posição inicial e seu progresso é 0.
[true/false] > false
```

**Decisão do bot:**

```
→ Atribuir 1 dado à reserva de caça.
[Press enter to continue]
```

**Explicação:** Progresso entre 1-5, não em Mordor, não no início → 1 dado (moderado).

---

#### FASE 5: EXEMPLO DE COMBATE

**Situação:**
- Barad-Dûr atacou Minas Tirith
- Você escolheu opção 3 (Resolver uma batalha)

**O bot inicia o grafo de combate:**

```
→ Todas as unidades de nações que não estão em guerra formam a retaguarda.
[Press enter]
```

**Você verifica:** Todas as nações da Sombra estão "Em Guerra" ou não têm unidades no exército → nenhuma retaguarda.

**Próximo passo:**

```
O exército da Sombra está atacando.
[true/false] > 
```

**Resposta:**
```
> true
```

**O bot verifica se é sortida:**

```
A batalha é uma sortida.
[true/false] > 
```

**Resposta:** Não, é um ataque normal:
```
> false
```

**O bot verifica se tem Rei dos Bruxos:**

```
O exército inclui o Rei Bruxo.
[true/false] > 
```

**Você verifica:** Barad-Dûr tem Nazgûl, mas não o Rei dos Bruxos (ainda não foi recrutado):
```
> false
```

**O bot verifica se deve jogar carta:**

```
A Sombra está conduzindo um cerco.
Ou, a Sombra está segurando mais de 4 cartas.
[true/false] > 
```

**Você verifica:**
- Não está em cerco (é batalha campal)
- Sombra tem 4 cartas (não mais de 4):
```
> false
```

**Decisão do bot:**

```
→ Não jogar uma carta de combate.
[Press enter to continue]
```

**O bot resolve o combate:**

```
→ Rolar para combate e rerolar erros.
[Press enter]
```

**Você faz:**
1. Rola os dados de combate
2. Calcula destruição
3. Remove baixas conforme prioridades do bot

**O bot verifica se continua:**

```
Uma batalha de campo foi lutada.
[true/false] > true

O exército da Sombra é *agressivo* e, se uma batalha de cerco estiver sendo lutada, 
permaneceria *agressivo* após um rebaixamento de Elite para continuar a batalha.
[true/false] > 
```

**Você verifica:** Barad-Dûr agora tem valor suficiente para ser agressivo? Depende das baixas. Se sim:
```
> true
```

**O bot decide:**

```
→ Continuar a batalha, rebaixar uma Elite se necessário.
[Press enter]
```

**E assim a batalha continua até alguém recuar ou ser eliminado.**

---

### DICAS PARA INICIANTES

1. **Sempre verifique o tabuleiro antes de responder:**
   - Não adivinhe - olhe as posições reais
   - Verifique valores de exércitos
   - Confirme status político das nações

2. **Use o glossário:**
   - Termos como "*móvel*", "*agressivo*", "*alvo*" têm definições específicas
   - Consulte `glossary.md` quando em dúvida

3. **Entenda as prioridades:**
   - O bot sempre segue as mesmas prioridades
   - Com tempo, você aprenderá a prever as ações do bot

4. **Não tenha pressa:**
   - O bot espera sua resposta
   - Use comandos como `ajuda` se precisar
   - Use `desfazer` se cometer erro

5. **Mantenha registro:**
   - Anote pontos de vitória
   - Acompanhe corrupção da Sociedade
   - Monitore status político

---

## ÍNDICE DAS PRINCIPAIS SEÇÕES

### PARTE 1: FUNDAMENTOS

1. Como o Bot Sabe o Estado do Tabuleiro
   - Resposta Direta
   - Como Funciona na Prática
   - Por Que Funciona Assim
   - O Que o Bot NÃO Sabe Automaticamente
   - O Que o Bot FAZ
   - Analogia

2. Como o Bot Decide Movimentos Baseado nos Povos Livres
   - Resposta Direta
   - Cada Exército da Sombra tem um "Target" (Alvo)
   - O Conceito de "Threat" (Ameaça)
   - Prioridades de Movimento
   - Exemplo Prático
   - Resumo

### PARTE 2: PRINCIPAIS CENÁRIOS E MECÂNICAS

3. Principais Cenários de War of the Ring e Lógica do Queller Bot
   - Principais Cenários de uma Partida
   - Exemplo Detalhado: Fase 3 - Alocação para Busca (Estratégia Militar)
   - Árvore de Decisão Completa (Estratégia Militar)
   - Comparação: Regras vs Lógica do Bot
   - Outro Exemplo: Fase 5 - Resolução de Ações (Movimento)
   - Resumo da Lógica do Queller Bot

4. Cenário 3: Combate e Cercos
   - Regras do Jogo - Combate
   - Lógica do Queller Bot - Combate
   - Passo 1: Formar Retaguarda
   - Passo 2: Verificar se está Atacando ou Defendendo
   - Cenário A: Defendendo em Fortaleza
   - Cenário B: Atacando (Batalha Normal)
   - Passo 3: Resolver Combate
   - Passo 4: Decidir se Continua a Batalha

5. Cenário 4: Recrutamento (Muster)
   - Regras do Jogo - Recrutamento
   - Lógica do Queller Bot - Recrutamento
   - Prioridade 1: Recrutar Vassalo (Minion)
   - Prioridade 2: Política (Mover Nações para Guerra)
   - Prioridade 3: Carta de Mobilização
   - Prioridade 4: Recrutamento Normal

6. Cenário 5: Cartas de Evento
   - Regras do Jogo - Cartas de Evento
   - Lógica do Queller Bot - Cartas
   - Fluxo 1: Cartas Preferidas (Estratégia Específica)
   - Fluxo 2: Cartas Gerais
   - Fluxo 3: Cartas de Corrupção (Estratégia Corrupção)

7. Cenário 6: Personagens (Vassalos e Nazgûl)
   - Regras do Jogo - Personagens
   - Lógica do Queller Bot - Personagens
   - Prioridade de Movimento de Personagens
   - Prioridade de Recrutamento de Vassalos

8. Cenário 7: Busca pelo Anel
   - Regras do Jogo - Busca
   - Lógica do Queller Bot - Busca

9. Cenário 8: Mudança de Estratégia (Fase 2)
   - Regras do Jogo - Fase 2
   - Lógica do Queller Bot - Fase 2
   - Estratégia Militar Atual
   - Estratégia Corrupção Atual

10. Cenário 9: Fase 1 - Preparação do Turno
    - Regras do Jogo - Fase 1
    - Lógica do Queller Bot - Fase 1
    - Estratégia Militar
    - Estratégia Corrupção

11. Cenário 10: Fase 4 - Jogada de Dados
    - Regras do Jogo - Fase 4
    - Lógica do Queller Bot - Fase 4

### PARTE 3: REFERÊNCIAS E GUIAS

12. Resumo Comparativo: Todas as Fases
    - Tabela comparativa das 5 fases

13. Referência Rápida: Prioridades do Bot
    - Movimento de Exércitos
    - Recrutamento
    - Combate
    - Cartas de Evento

14. Glossário de Termos Técnicos
    - Conceitos Importantes
    - Target (Alvo)
    - Threat (Ameaça)
    - Mobile (Móvel)
    - Aggressive (Agressivo)
    - Exposed (Exposta)
    - Value (Valor)

15. Estrutura dos Grafos
    - Arquivos Principais
    - Tipos de Nós (Nodes)

16. Dicas para Usar o Bot Efetivamente
    - Para o Jogador dos Povos Livres
    - Entendendo as Decisões do Bot

17. Simulação de Partida Completa para Iniciantes
    - Preparação Inicial
    - Turno 1 - Passo a Passo
    - Fase 1: Recuperar Dados e Comprar Cartas
    - Fase 2: Fase da Sociedade
    - Fase 3: Alocação para Busca
    - Fase 4: Jogada de Ação
    - Fase 5: Resolução de Ações
    - Turno 2 - Exemplo de Decisões Mais Complexas
    - Dicas para Iniciantes

---

**Documento criado para:** Projeto Queller Bot - War of the Ring  
**Versão:** 1.0  
**Última atualização:** Baseado no código do Queller Bot v3.0.1

