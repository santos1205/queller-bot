# 🎮 Guia Rápido: Como Jogar com o Queller Bot (CLI)

## 📋 PRÉ-REQUISITOS

1. **Tabuleiro de War of the Ring** montado e preparado
2. **Terminal aberto** (Git Bash ou PowerShell)
3. **Você está na pasta do projeto**

---

## 🚀 PASSO 1: Abrir o Terminal

**No Windows:**
- Abra **Git Bash** ou **PowerShell**
- Navegue até a pasta:
```bash
cd "/c/Users/mario/OneDrive - Santos TI/boardgames/automas-projects/war of ring queller-bot-br"
```

---

## 🎯 PASSO 2: Executar o Bot

Digite:
```bash
./start.sh
```

Ou diretamente:
```bash
/c/Users/mario/.julia/juliaup/julia-1.6.7+0.x64.w64.mingw32/bin/julia.exe run.jl
```

---

## 📖 PASSO 3: Entender o que o Bot Mostra

O bot vai mostrar **3 tipos de mensagens**:

### **1. 📢 Mensagens Informativas**
```
----------
Recuperar os dados de ação.
[Pressione enter para continuar] >
```
**O QUE FAZER:**
- Execute a ação no tabuleiro (recupere os dados vermelhos)
- Aperte **Enter** para continuar

### **2. ❓ Perguntas Sim/Não**
```
A Sociedade está na Trilha de Mordor.
[verdadeiro/falso] >
```
**O QUE FAZER:**
- Verifique o tabuleiro
- Digite `verdadeiro` ou `v` se SIM
- Digite `falso` ou `f` se NÃO
- Aperte **Enter**

### **3. 🔢 Escolhas Múltiplas**
```
Selecione a estratégia:
1. Militar
2. Corrupção
[1/2] >
```
**O QUE FAZER:**
- Digite o número da opção (ex: `1` ou `2`)
- Aperte **Enter**

---

## 🎓 COMANDOS ESPECIAIS

Você pode usar estes comandos **a qualquer momento**:

- `ajuda` ou `a` - Mostra ajuda
- `sair` ou `s` - Sai do programa
- `desfazer` ou `d` - Volta uma ação
- `repetir` ou `r` - Repete a última pergunta
- `reiniciar` - Reinicia a fase atual
- `fase 3` - Pula para a fase 3

---

## 📚 ESTRUTURA DO TURNO

O jogo tem **5 fases** que se repetem:

### **FASE 1: Recuperar e Comprar**
- Recuperar dados de ação
- Comprar cartas de evento

### **FASE 2: Fase da Sociedade**
- Você pode tornar pública a Sociedade
- Mudar o Guia da Sociedade

### **FASE 3: Alocação para Busca**
- Bot decide quantos dados colocar na busca

### **FASE 4: Jogada de Ação**
- Bot rola os dados
- Dados com "Olho" vão para busca

### **FASE 5: Resolução de Ações**
- Bot escolhe ações para fazer
- Você responde perguntas sobre o estado do jogo

---

## 💡 DICAS PARA INICIANTES

1. **Leia cada mensagem com cuidado** - O bot explica o que fazer
2. **Verifique o tabuleiro antes de responder** - As perguntas são sobre o estado atual
3. **Use "ajuda" se tiver dúvidas** - Digite `ajuda` a qualquer momento
4. **Use "desfazer" se errar** - Digite `desfazer` para voltar
5. **Não tenha pressa** - O bot espera você responder

---

## 🎯 PRIMEIRA PARTIDA - O QUE ESPERAR

Quando você executar `./start.sh`, verá:

1. **Mensagem de boas-vindas**
2. **Escolha de estratégia** (Militar ou Corrupção)
3. **Fase 1 começa** - O bot pede para recuperar dados
4. **Perguntas sobre o jogo** - Responda baseado no tabuleiro
5. **Ações do bot** - Ele diz o que fazer no tabuleiro

---

## ❓ PRECISA DE AJUDA?

- Digite `ajuda` no bot para ver comandos
- Consulte `help/manual regras do jogo.txt` para regras completas
- Consulte `help/3 guia-uso-queller-bot.md` para guia detalhado

---

**Boa sorte na sua primeira partida! 🎲**

