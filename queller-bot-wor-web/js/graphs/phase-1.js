/**
 * graphs/phase-1.js
 * Grafo da Fase 1: Recuperar e Comprar
 * Transpilado de phase-1.jl
 */

// Define phase1 como variável global (sem export)
const phase1 = {
  name: "phase-1",
  startNode: "phase_1",
  nodes: [
    {
      id: "phase_1",
      type: "Start",
      next: "p1_strat",
      interactive: false
    },
    {
      id: "p1_strat",
      type: "CheckStrategy",
      nextMilitar: "p1_mili_1",
      nextCorrupcao: "p1_corr_1",
      interactive: false
    },
    
    // ========== CAMINHO MILITAR ==========
    {
      id: "p1_mili_1",
      type: "PerformAction",
      message: "📋 Recupere todos os dados de ação que foram usados na rodada anterior.",
      nexts: ["p1_mili_2"],
      interactive: true
    },
    {
      id: "p1_mili_2",
      type: "PerformAction",
      message: "🃏 Compre cartas de evento até ter 6 cartas na mão.<br><br><small>Se o baralho acabar, embaralhe o descarte para formar um novo baralho.</small>",
      nexts: ["p1_mili_3"],
      interactive: true
    },
    {
      id: "p1_mili_3",
      type: "BinaryCondition",
      message: "❓ Você está segurando mais de 6 cartas?",
      nextYes: "p1_mili_discard",
      nextNo: "p1_mili_end",
      nexts: ["p1_mili_discard", "p1_mili_end"],
      interactive: true
    },
    {
      id: "p1_mili_discard",
      type: "PerformAction",
      message: "🗑️ Descartar cartas de evento até ter 6 cartas.<br><br><strong>Prioridade de descarte (Militar):</strong><br>1. Cartas que NÃO usam \"Sociedade revelada\"<br>2. Cartas de personagem<br>3. Cartas de estratégia<br>4. Ordem decrescente de iniciativa<br>5. Cartas que NÃO colocam peça<br>6. Aleatório",
      nexts: ["p1_mili_end"],
      interactive: true
    },
    {
      id: "p1_mili_end",
      type: "End",
      interactive: false
    },
    
    // ========== CAMINHO CORRUPÇÃO ==========
    {
      id: "p1_corr_1",
      type: "PerformAction",
      message: "📋 Recupere todos os dados de ação que foram usados na rodada anterior.",
      nexts: ["p1_corr_2"],
      interactive: true
    },
    {
      id: "p1_corr_2",
      type: "PerformAction",
      message: "🃏 Compre cartas de evento até ter 6 cartas na mão.<br><br><small>Se o baralho acabar, embaralhe o descarte para formar um novo baralho.</small>",
      nexts: ["p1_corr_3"],
      interactive: true
    },
    {
      id: "p1_corr_3",
      type: "BinaryCondition",
      message: "❓ Você está segurando mais de 6 cartas?",
      nextYes: "p1_corr_discard",
      nextNo: "p1_corr_end_1",
      nexts: ["p1_corr_discard", "p1_corr_end_1"],
      interactive: true
    },
    {
      id: "p1_corr_discard",
      type: "BinaryCondition",
      message: "❓ Você está segurando mais de 1 carta de estratégia?",
      nextYes: "p1_corr_discard_1",
      nextNo: "p1_corr_discard_2",
      nexts: ["p1_corr_discard_1", "p1_corr_discard_2"],
      interactive: true
    },
    {
      id: "p1_corr_discard_1",
      type: "PerformAction",
      message: "🗑️ Descartar cartas de evento até ter 6 cartas.<br><br><strong>Prioridade de descarte (Corrupção - com múltiplas cartas de estratégia):</strong><br>1. Cartas que NÃO usam \"Sociedade revelada\"<br>2. Cartas que NÃO colocam peça<br>3. Cartas de estratégia<br>4. Cartas de personagem<br>5. Ordem decrescente de iniciativa<br>6. Aleatório",
      nexts: ["p1_corr_end_2"],
      interactive: true
    },
    {
      id: "p1_corr_discard_2",
      type: "PerformAction",
      message: "🗑️ Descartar cartas de evento até ter 6 cartas.<br><br><strong>Prioridade de descarte (Corrupção - 1 ou nenhuma carta de estratégia):</strong><br>1. Cartas que NÃO usam \"Sociedade revelada\"<br>2. Cartas que NÃO colocam peça<br>3. Cartas de personagem<br>4. Cartas de estratégia<br>5. Ordem decrescente de iniciativa<br>6. Aleatório",
      nexts: ["p1_corr_end_2"],
      interactive: true
    },
    {
      id: "p1_corr_end_1",
      type: "End",
      interactive: false
    },
    {
      id: "p1_corr_end_2",
      type: "End",
      interactive: false
    }
  ]
};
