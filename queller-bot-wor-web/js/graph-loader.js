/**
 * graph-loader.js
 * Carregador de grafos (sem ES6 modules)
 * Inspirado no sistema load_graphs() do Julia
 * 
 * IMPORTANTE: Este arquivo deve ser carregado APÓS:
 * - graph.js
 * - graphs/phase-1.js (e outros grafos)
 */

/**
 * Carrega todos os grafos no GraphManager
 * Assume que as variáveis globais phase1, phase2, etc. já existem
 */
function loadAllGraphs() {
  // graphManager é a instância singleton global (não GraphManager.getInstance())
  
  try {
    // Fase 1: Recuperar e Comprar
    if (typeof phase1 !== 'undefined') {
      console.log('[GraphLoader] Carregando phase-1...');
      const graph1 = Graph.fromJSON(phase1);
      graphManager.addGraph(graph1);
      console.log('[GraphLoader] phase-1 carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] phase1 não encontrado!');
    }
    
    // Fase 2: Camaradagem e Declaração
    if (typeof phase2 !== 'undefined') {
      console.log('[GraphLoader] Carregando phase-2...');
      const graph2 = Graph.fromJSON(phase2);
      graphManager.addGraph(graph2);
      console.log('[GraphLoader] phase-2 carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] phase2 não encontrado!');
    }
    
    // Fase 3: Ações
    if (typeof phase3 !== 'undefined') {
      console.log('[GraphLoader] Carregando phase-3...');
      const graph3 = Graph.fromJSON(phase3);
      graphManager.addGraph(graph3);
      console.log('[GraphLoader] phase-3 carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] phase3 não encontrado!');
    }
    
    // Fase 4: Olho de Sauron (grafo principal)
    if (typeof phase4 !== 'undefined') {
      console.log('[GraphLoader] Carregando phase-4...');
      const graph4 = Graph.fromJSON(phase4);
      graphManager.addGraph(graph4);
      console.log('[GraphLoader] phase-4 carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] phase4 não encontrado!');
    }
    
    // Grafo auxiliar adjust_dice
    if (typeof adjustDice !== 'undefined') {
      console.log('[GraphLoader] Carregando adjust_dice...');
      const adjustGraph = Graph.fromJSON(adjustDice);
      graphManager.addGraph(adjustGraph);
      console.log('[GraphLoader] adjust_dice carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] adjustDice não encontrado!');
    }
    
    // Fase 5: Verificação de Vitória
    if (typeof phase5 !== 'undefined') {
      console.log('[GraphLoader] Carregando phase-5...');
      const graph5 = Graph.fromJSON(phase5);
      graphManager.addGraph(graph5);
      console.log('[GraphLoader] phase-5 carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] phase5 não encontrado!');
    }
    
    // Subgrafo: Threat Exposed
    if (typeof threatExposed !== 'undefined') {
      console.log('[GraphLoader] Carregando threat_exposed...');
      const graphThreat = Graph.fromJSON(threatExposed);
      graphManager.addGraph(graphThreat);
      console.log('[GraphLoader] threat_exposed carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] threatExposed não encontrado!');
    }
    
    // Subgrafo: Select Action Mili
    if (typeof selectActionMili !== 'undefined') {
      console.log('[GraphLoader] Carregando select_action_mili...');
      const graphSelMili = Graph.fromJSON(selectActionMili);
      graphManager.addGraph(graphSelMili);
      console.log('[GraphLoader] select_action_mili carregado com sucesso!');
    } else {
      console.warn('[GraphLoader] selectActionMili não encontrado!');
    }
    
    console.log(`[GraphLoader] ${graphManager.getAllGraphNames().length} grafo(s) carregado(s):`, 
                graphManager.getAllGraphNames());
    
  } catch (error) {
    console.error('[GraphLoader] Erro ao carregar grafos:', error);
    throw error;
  }
}

/**
 * Verifica se todos os grafos foram carregados corretamente
 * @returns {boolean}
 */
function validateLoadedGraphs() {
  const graphNames = graphManager.getAllGraphNames();
  
  if (graphNames.length === 0) {
    console.warn('[GraphLoader] Nenhum grafo carregado!');
    return false;
  }
  
  let allValid = true;
  for (const name of graphNames) {
    const graph = graphManager.getGraph(name);
    const errors = graph.validate();
    
    if (errors.length > 0) {
      console.error(`[GraphLoader] Grafo "${name}" tem erros:`, errors);
      allValid = false;
    }
  }
  
  if (allValid) {
    console.log('[GraphLoader] ✅ Todos os grafos são válidos!');
  }
  
  return allValid;
}

/**
 * Retorna informações sobre os grafos carregados
 * @returns {Object} Estatísticas dos grafos
 */
function getGraphStats() {
  const graphNames = graphManager.getAllGraphNames();
  
  const stats = {
    total: graphNames.length,
    graphs: {}
  };
  
  for (const name of graphNames) {
    const graph = graphManager.getGraph(name);
    stats.graphs[name] = {
      nodes: graph.nodes.size,
      startNode: graph.startNode,
      valid: graph.validate().length === 0
    };
  }
  
  return stats;
}

// Expor graphManager globalmente para debug no console
window.graphManager = graphManager;
