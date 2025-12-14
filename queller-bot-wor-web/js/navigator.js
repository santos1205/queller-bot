/**
 * navigator.js
 * Navegador de Grafos de Decisão
 * Baseado em crawler.jl do projeto original
 */

// ============================================================================
// GRAPH NAVIGATOR - Navegação automática por grafos
// ============================================================================

class GraphNavigator {
    constructor(gameState = null) {
        // Usa o graphManager global (singleton)
        this.graphManager = graphManager;
        this.gameState = gameState || (typeof window !== 'undefined' && window.gameState ? window.gameState : null);
        
        // Pilha de contextos (para JumpToGraph/ReturnFromGraph)
        this.contextStack = [];
        
        // Estado atual da navegação
        this.currentGraph = null;
        this.currentNode = null;
        
        // Buffer de mensagens acumuladas durante autocrawl
        this.messageBuffer = [];
    }

    /**
     * Inicia navegação em um grafo
     */
    startGraph(graphName) {
        this.currentGraph = this.graphManager.getGraph(graphName);
        this.currentNode = this.currentGraph.getNode(this.currentGraph.startNode);
        this.messageBuffer = [];
        
        console.log(`📍 Navigator: Starting graph "${graphName}" at node ${this.currentNode.id}`);
        
        // Iniciar autocrawl
        return this.autocrawl();
    }

    /**
     * Autocrawl - Navega automaticamente por nós não-interativos
     * até encontrar um nó interativo ou fim
     */
    autocrawl() {
        let iterations = 0;
        const MAX_ITERATIONS = 1000; // Prevenir loops infinitos
        
        while (iterations < MAX_ITERATIONS) {
            iterations++;
            
            // Se chegou no fim, retornar
            if (this.currentNode.type === 'End') {
                console.log(`🏁 Navigator: Reached End node`);
                return {
                    type: 'End',
                    messages: this.messageBuffer,
                    node: this.currentNode
                };
            }
            
            // Se é nó interativo, parar e retornar
            if (this.currentNode.interactive) {
                console.log(`⏸️  Navigator: Paused at interactive node ${this.currentNode.id} (${this.currentNode.type})`);
                return {
                    type: 'Interactive',
                    messages: this.messageBuffer,
                    node: this.currentNode
                };
            }
            
            // Processar nó não-interativo
            const result = this.processNonInteractiveNode();
            
            // Se retornou mensagem de erro ou fim especial, retornar
            if (result && result.stop) {
                return result;
            }
        }
        
        throw new Error('Navigator: Maximum iterations exceeded - possible infinite loop');
    }

    /**
     * Processa um nó não-interativo
     */
    processNonInteractiveNode() {
        const node = this.currentNode;
        
        console.log(`  🔄 Processing ${node.type} node: ${node.id}`);
        
        switch (node.type) {
            case 'Start':
                // Start apenas avança
                this.moveToNext(node.next);
                break;
                
            case 'Dummy':
                // Dummy apenas avança
                this.moveToNext(node.next);
                break;
                
            case 'CheckStrategy':
                // Verificar estratégia e escolher caminho
                const strategy = this.gameState.strategy;
                const nextNode = node.getNext(strategy);
                console.log(`  ⚡ CheckStrategy: ${strategy} → ${nextNode}`);
                this.moveToNext(nextNode);
                break;
                
            case 'SetStrategy':
                // Trocar estratégia atual
                const newStrategy = node.strategyName;
                const oldStrategy = this.gameState.strategy;
                this.gameState.strategy = newStrategy;
                console.log(`  🔄 SetStrategy: ${oldStrategy} → ${newStrategy}`);
                this.messageBuffer.push(`🔄 <strong>Estratégia alterada:</strong> ${oldStrategy === 'military' ? '⚔️ Militar' : '🔥 Corrupção'} → ${newStrategy === 'military' ? '⚔️ Militar' : '🔥 Corrupção'}`);
                this.moveToNext(node.next);
                break;
                
            case 'SetRingAvailable':
                // Configurar disponibilidade de anel élfico
                this.gameState.ringAvailable = node.value;
                console.log(`  💍 SetRingAvailable: ${node.value}`);
                this.messageBuffer.push(`💍 <strong>Anel élfico:</strong> ${node.value ? 'Disponível' : 'Não disponível'}`);
                this.moveToNext(node.next);
                break;
                
            case 'SetMoDTAvailable':
                // Configurar disponibilidade de Mensageiro da Torre Negra
                this.gameState.modtAvailable = node.value;
                console.log(`  📜 SetMoDTAvailable: ${node.value}`);
                this.messageBuffer.push(`📜 <strong>Mensageiro da Torre Negra:</strong> ${node.value ? 'Disponível' : 'Não disponível'}`);
                this.moveToNext(node.next);
                break;
                
            case 'SetActiveDie':
                // Tentar pegar um dado do tipo especificado
                const dieType = node.dieType;
                const availableDice = this.gameState.dice || [];
                const foundDie = availableDice.find(d => d === dieType);
                
                if (foundDie) {
                    this.gameState.activeDie = foundDie;
                    console.log(`  🎲 SetActiveDie: ${dieType} encontrado → ${node.next}`);
                    this.messageBuffer.push(`🎲 <strong>Dado ativo:</strong> ${Dice.format(foundDie)}`);
                    this.moveToNext(node.next);
                } else if (node.noDie) {
                    console.log(`  🎲 SetActiveDie: ${dieType} não encontrado → ${node.noDie}`);
                    this.gameState.activeDie = null;
                    this.moveToNext(node.noDie);
                } else {
                    throw new Error(`SetActiveDie: No die of type ${dieType} available and no noDie path`);
                }
                break;
                
            case 'CheckActiveDie':
                // Verificar se dado ativo é de um tipo específico
                const currentDie = this.gameState.activeDie;
                const checkType = node.dieType;
                const nextPath = node.getNext(currentDie);
                console.log(`  🔍 CheckActiveDie: ${currentDie || 'none'} === ${checkType}? → ${nextPath}`);
                this.moveToNext(nextPath);
                break;
                
            case 'UseActiveDie':
                // Usar dado ativo (remove dos disponíveis)
                const activeDie = this.gameState.activeDie;
                if (!activeDie) {
                    throw new Error('UseActiveDie: No active die set');
                }
                // Remover dado dos disponíveis (dados são strings como 'E', 'R', 'P')
                const diceArray = this.gameState.dice || [];
                const index = diceArray.indexOf(activeDie);
                if (index >= 0) {
                    diceArray.splice(index, 1);
                    this.gameState.dice = diceArray;
                    console.log(`  ✔️ UseActiveDie: ${activeDie} removido (${diceArray.length} restantes)`);
                } else {
                    console.warn(`  ⚠️ UseActiveDie: Dado ativo ${activeDie} não encontrado na lista`);
                }
                // Limpar dado ativo após uso
                this.gameState.activeDie = null;
                this.moveToNext(node.next);
                break;
                
            case 'JumpToGraph':
                // Salvar contexto atual e pular para subgrafo
                console.log(`  ↗️  JumpToGraph: ${node.targetGraph}`);
                this.contextStack.push({
                    graph: this.currentGraph.name,
                    returnTo: node.returnTo
                });
                this.currentGraph = this.graphManager.getGraph(node.targetGraph);
                this.currentNode = this.currentGraph.getNode(this.currentGraph.startNode);
                break;
                
            case 'ReturnFromGraph':
                // Voltar para o grafo anterior
                if (this.contextStack.length === 0) {
                    console.log(`  ↙️  ReturnFromGraph: No context (standalone execution)`);
                    // Em standalone, tratar como End e parar o autocrawl
                    return {
                        type: 'End',
                        messages: this.messageBuffer,
                        node: node,
                        stop: true
                    };
                }
                const context = this.contextStack.pop();
                console.log(`  ↙️  ReturnFromGraph: back to ${context.graph}`);
                this.currentGraph = this.graphManager.getGraph(context.graph);
                this.currentNode = this.currentGraph.getNode(context.returnTo);
                break;
                
            default:
                throw new Error(`Unknown non-interactive node type: ${node.type}`);
        }
        
        return null; // Continuar crawling
    }

    /**
     * Move para o próximo nó
     */
    moveToNext(nextId) {
        if (!nextId) {
            throw new Error(`Navigator: cannot move to null next from node ${this.currentNode.id}`);
        }
        this.currentNode = this.currentGraph.getNode(nextId);
    }

    /**
     * Processa resposta do usuário a um nó interativo
     */
    processUserResponse(response) {
        const node = this.currentNode;
        
        if (!node.interactive) {
            throw new Error('processUserResponse: current node is not interactive');
        }
        
        console.log(`✅ Navigator: User responded to ${node.type} node ${node.id}`);
        
        let nextNodeId;
        
        switch (node.type) {
            case 'PerformAction':
                // PerformAction tem apenas um caminho
                nextNodeId = node.nexts[0];
                break;
                
            case 'BinaryCondition':
                // Sim/Não - response é o nextNodeId já processado pelo main.js
                // O main.js envia nexts[0] ou nexts[1] diretamente
                nextNodeId = response;
                console.log(`  → Response: ${nextNodeId}`);
                break;
                
            case 'MultipleChoice':
                // Escolha múltipla (response é o índice)
                if (typeof response !== 'number' || response < 0 || response >= node.nexts.length) {
                    throw new Error(`Invalid choice index: ${response}`);
                }
                nextNodeId = node.nexts[response];
                console.log(`  → Choice: ${response} (${node.options[response]}) → ${nextNodeId}`);
                break;
                
            case 'GetAvailableDice':
                // Response são os dados inseridos
                console.log(`  → Dice received: ${response.length} dice`);
                nextNodeId = node.nexts[0];
                break;
                
            default:
                throw new Error(`Unknown interactive node type: ${node.type}`);
        }
        
        // Mover para próximo nó
        this.moveToNext(nextNodeId);
        
        // Limpar buffer de mensagens
        this.messageBuffer = [];
        
        // Continuar autocrawl
        return this.autocrawl();
    }

    /**
     * Obtém informação do nó atual para a UI
     */
    getCurrentNodeInfo() {
        const node = this.currentNode;
        
        return {
            id: node.id,
            type: node.type,
            message: node.message,
            options: node.options,
            interactive: node.interactive,
            graph: this.currentGraph.name
        };
    }

    /**
     * Verifica se a navegação terminou
     */
    isFinished() {
        return this.currentNode && this.currentNode.type === 'End';
    }

    /**
     * Reseta o navegador
     */
    reset() {
        this.currentGraph = null;
        this.currentNode = null;
        this.contextStack = [];
        this.messageBuffer = [];
        console.log('🔄 Navigator: Reset');
    }

    /**
     * Obtém status de debug
     */
    getDebugInfo() {
        return {
            currentGraph: this.currentGraph?.name,
            currentNode: this.currentNode?.id,
            nodeType: this.currentNode?.type,
            stackDepth: this.contextStack.length,
            messageBufferSize: this.messageBuffer.length
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraphNavigator };
}
