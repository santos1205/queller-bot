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
    // Carregar todos os grafos silenciosamente
    if (typeof phase1 !== 'undefined') graphManager.addGraph(Graph.fromJSON(phase1));
    if (typeof phase2 !== 'undefined') graphManager.addGraph(Graph.fromJSON(phase2));
    if (typeof phase3 !== 'undefined') graphManager.addGraph(Graph.fromJSON(phase3));
    if (typeof phase4 !== 'undefined') graphManager.addGraph(Graph.fromJSON(phase4));
    if (typeof adjustDice !== 'undefined') graphManager.addGraph(Graph.fromJSON(adjustDice));
    if (typeof phase5 !== 'undefined') graphManager.addGraph(Graph.fromJSON(phase5));
    if (typeof threatExposed !== 'undefined') graphManager.addGraph(Graph.fromJSON(threatExposed));
    if (typeof selectActionMili !== 'undefined') graphManager.addGraph(Graph.fromJSON(selectActionMili));
    if (typeof selectActionCorr !== 'undefined') graphManager.addGraph(Graph.fromJSON(selectActionCorr));
    if (typeof battle !== 'undefined') graphManager.addGraph(Graph.fromJSON(battle));
    if (typeof battleResolve !== 'undefined') graphManager.addGraph(Graph.fromJSON(battleResolve));
    if (typeof battleRoundEnd !== 'undefined') graphManager.addGraph(Graph.fromJSON(battleRoundEnd));
    if (typeof movementAttackBesiege !== 'undefined') graphManager.addGraph(Graph.fromJSON(movementAttackBesiege));
    if (typeof movementAttackCorr !== 'undefined') graphManager.addGraph(Graph.fromJSON(movementAttackCorr));
    if (typeof movementAttackBasic !== 'undefined') graphManager.addGraph(Graph.fromJSON(movementAttackBasic));
    if (typeof movementAttackCard !== 'undefined') graphManager.addGraph(Graph.fromJSON(movementAttackCard));
    if (typeof musterMinion !== 'undefined') graphManager.addGraph(Graph.fromJSON(musterMinion));
    if (typeof musterMinionSelection !== 'undefined') graphManager.addGraph(Graph.fromJSON(musterMinionSelection));
    if (typeof musterPolitics !== 'undefined') graphManager.addGraph(Graph.fromJSON(musterPolitics));
    if (typeof musterMuster !== 'undefined') graphManager.addGraph(Graph.fromJSON(musterMuster));
    if (typeof musterCard !== 'undefined') graphManager.addGraph(Graph.fromJSON(musterCard));
    if (typeof eventCardsPreferred !== 'undefined') graphManager.addGraph(Graph.fromJSON(eventCardsPreferred));
    if (typeof eventCardsGeneral !== 'undefined') graphManager.addGraph(Graph.fromJSON(eventCardsGeneral));
    if (typeof eventCardsCorruption !== 'undefined') graphManager.addGraph(Graph.fromJSON(eventCardsCorruption));
    if (typeof eventCardsResolveEffect !== 'undefined') graphManager.addGraph(Graph.fromJSON(eventCardsResolveEffect));
    // Character graphs (4 grafos: 1 consolidado + 3 prio)
    if (typeof characterArmy !== 'undefined') graphManager.addGraph(Graph.fromJSON(characterArmy));
    if (typeof characterWkPrio !== 'undefined') graphManager.addGraph(Graph.fromJSON(characterWkPrio));
    if (typeof characterNazgulPrio !== 'undefined') graphManager.addGraph(Graph.fromJSON(characterNazgulPrio));
    if (typeof characterMosPrio !== 'undefined') graphManager.addGraph(Graph.fromJSON(characterMosPrio));
    
    console.log(`✅ ${graphManager.getAllGraphNames().length} grafos carregados`);
    
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
