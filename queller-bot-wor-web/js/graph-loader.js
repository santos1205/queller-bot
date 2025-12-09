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
    
    // TODO: Adicionar phases 2-5 quando transpilados
    // if (typeof phase2 !== 'undefined') { ... }
    // if (typeof phase3 !== 'undefined') { ... }
    // if (typeof phase4 !== 'undefined') { ... }
    // if (typeof phase5 !== 'undefined') { ... }
    
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
