/**
 * graph.js
 * Sistema de Grafos de Decisão para Queller Bot
 * Baseado em graph.jl do projeto original
 */

// ============================================================================
// CLASSES BASE
// ============================================================================

/**
 * Classe base para todos os nós do grafo
 */
class Node {
    constructor(id) {
        this.id = id;
        this.type = 'Node';
    }

    /**
     * Valida se o nó está configurado corretamente
     */
    validate() {
        if (!this.id) {
            throw new Error('Node must have an ID');
        }
        return true;
    }
}

/**
 * Classe base para nós não-interativos (execução automática)
 */
class NonInteractiveNode extends Node {
    constructor(id, next = null) {
        super(id);
        this.next = next; // ID do próximo nó
        this.interactive = false;
    }

    validate() {
        super.validate();
        if (this.next === undefined) {
            throw new Error(`NonInteractiveNode ${this.id} must have a 'next' property`);
        }
        return true;
    }
}

/**
 * Classe base para nós interativos (requerem input do usuário)
 */
class InteractiveNode extends Node {
    constructor(id, message, nexts = []) {
        super(id);
        this.message = message; // Mensagem a exibir
        this.nexts = nexts;     // Array de IDs dos próximos nós
        this.interactive = true;
    }

    validate() {
        super.validate();
        if (!this.message) {
            throw new Error(`InteractiveNode ${this.id} must have a message`);
        }
        if (!Array.isArray(this.nexts)) {
            throw new Error(`InteractiveNode ${this.id} nexts must be an array`);
        }
        return true;
    }
}

// ============================================================================
// TIPOS DE NÓS ESPECÍFICOS
// ============================================================================

/**
 * 1. Start - Início de um grafo
 */
class StartNode extends NonInteractiveNode {
    constructor(id, next) {
        super(id, next);
        this.type = 'Start';
    }
}

/**
 * 2. End - Fim de uma ação/fase
 */
class EndNode extends Node {
    constructor(id) {
        super(id);
        this.type = 'End';
        this.next = null; // End não tem próximo
        this.interactive = false;
    }
}

/**
 * 3. PerformAction - Executar uma ação no tabuleiro
 * Requer confirmação do usuário após executar
 */
class PerformActionNode extends InteractiveNode {
    constructor(id, message, next) {
        super(id, message, [next]);
        this.type = 'PerformAction';
    }

    validate() {
        super.validate();
        if (this.nexts.length !== 1) {
            throw new Error(`PerformActionNode ${this.id} must have exactly one next`);
        }
        return true;
    }
}

/**
 * 4. BinaryCondition - Pergunta Sim/Não
 */
class BinaryConditionNode extends InteractiveNode {
    constructor(id, message, nextYes, nextNo) {
        super(id, message, [nextYes, nextNo]);
        this.type = 'BinaryCondition';
        this.nextYes = nextYes;
        this.nextNo = nextNo;
    }

    validate() {
        super.validate();
        if (this.nexts.length !== 2) {
            throw new Error(`BinaryConditionNode ${this.id} must have exactly 2 nexts (Yes/No)`);
        }
        return true;
    }
}

/**
 * 5. MultipleChoice - Escolha entre múltiplas opções
 */
class MultipleChoiceNode extends InteractiveNode {
    constructor(id, message, options, nexts) {
        super(id, message, nexts);
        this.type = 'MultipleChoice';
        this.options = options; // Array de strings com as opções
    }

    validate() {
        super.validate();
        if (!Array.isArray(this.options)) {
            throw new Error(`MultipleChoiceNode ${this.id} must have options array`);
        }
        if (this.options.length !== this.nexts.length) {
            throw new Error(`MultipleChoiceNode ${this.id} options and nexts must have same length`);
        }
        return true;
    }
}

/**
 * 6. JumpToGraph - Pular para um subgrafo
 */
class JumpToGraphNode extends NonInteractiveNode {
    constructor(id, targetGraph, returnTo) {
        super(id, null);
        this.type = 'JumpToGraph';
        this.targetGraph = targetGraph; // Nome do grafo de destino
        this.returnTo = returnTo;       // ID do nó para retornar
    }

    validate() {
        super.validate();
        if (!this.targetGraph) {
            throw new Error(`JumpToGraphNode ${this.id} must have targetGraph`);
        }
        if (!this.returnTo) {
            throw new Error(`JumpToGraphNode ${this.id} must have returnTo`);
        }
        return true;
    }
}

/**
 * 7. ReturnFromGraph - Voltar de um subgrafo
 */
class ReturnFromGraphNode extends NonInteractiveNode {
    constructor(id) {
        super(id, null);
        this.type = 'ReturnFromGraph';
    }
}

/**
 * 8. CheckStrategy - Verificar estratégia atual
 * Ramifica baseado na estratégia (Militar ou Corrupção)
 */
class CheckStrategyNode extends NonInteractiveNode {
    constructor(id, nextMilitar, nextCorrupcao) {
        super(id, null);
        this.type = 'CheckStrategy';
        this.nextMilitar = nextMilitar;
        this.nextCorrupcao = nextCorrupcao;
    }

    validate() {
        super.validate();
        if (!this.nextMilitar || !this.nextCorrupcao) {
            throw new Error(`CheckStrategyNode ${this.id} must have nextMilitar and nextCorrupcao`);
        }
        return true;
    }

    // Override: next depende da estratégia do jogo
    getNext(strategy) {
        return strategy === 'MILITAR' ? this.nextMilitar : this.nextCorrupcao;
    }
}

/**
 * 9. UseActiveDie - Usar o dado ativo atual
 * Ramifica baseado no tipo de dado
 */
class UseActiveDieNode extends NonInteractiveNode {
    constructor(id, dieTypeMap) {
        super(id, null);
        this.type = 'UseActiveDie';
        this.dieTypeMap = dieTypeMap; // { 'E': nextId, 'R': nextId, ... }
    }

    validate() {
        super.validate();
        if (!this.dieTypeMap || typeof this.dieTypeMap !== 'object') {
            throw new Error(`UseActiveDieNode ${this.id} must have dieTypeMap object`);
        }
        return true;
    }

    // Override: next depende do tipo do dado ativo
    getNext(activeDie) {
        const dieType = activeDie.type;
        const next = this.dieTypeMap[dieType];
        if (!next) {
            throw new Error(`UseActiveDieNode ${this.id}: no route for die type ${dieType}`);
        }
        return next;
    }
}

/**
 * 10. GetAvailableDice - Solicitar dados disponíveis ao usuário
 * (já implementado no main.js, mas incluído para completude)
 */
class GetAvailableDiceNode extends InteractiveNode {
    constructor(id, next) {
        super(id, 'Por favor, insira os dados disponíveis:', [next]);
        this.type = 'GetAvailableDice';
    }
}

/**
 * 11. SetStrategy - Trocar a estratégia atual
 * Não-interativo, apenas atualiza o estado
 */
class SetStrategyNode extends NonInteractiveNode {
    constructor(id, strategyName, next) {
        super(id, next);
        this.type = 'SetStrategy';
        this.strategyName = strategyName; // "military" ou "corruption"
    }

    validate() {
        super.validate();
        if (!this.strategyName) {
            throw new Error(`SetStrategyNode ${this.id} must have strategyName`);
        }
        return true;
    }
}

/**
 * 12. Dummy - Nó auxiliar para estruturação de grafos
 * Não faz nada, apenas conecta outros nós
 */
class DummyNode extends NonInteractiveNode {
    constructor(id, next) {
        super(id, next);
        this.type = 'Dummy';
    }
}

/**
 * 13. SetRingAvailable - Define disponibilidade de anel élfico
 * Não-interativo, apenas atualiza o estado
 */
class SetRingAvailableNode extends NonInteractiveNode {
    constructor(id, value, next) {
        super(id, next);
        this.type = 'SetRingAvailable';
        this.value = value; // true ou false
    }

    validate() {
        super.validate();
        if (typeof this.value !== 'boolean') {
            throw new Error(`SetRingAvailableNode ${this.id} must have boolean value`);
        }
        return true;
    }
}

/**
 * 14. SetMoDTAvailable - Define disponibilidade de Mensageiro da Torre Negra
 * Não-interativo, apenas atualiza o estado
 */
class SetMoDTAvailableNode extends NonInteractiveNode {
    constructor(id, value, next) {
        super(id, next);
        this.type = 'SetMoDTAvailable';
        this.value = value; // true ou false
    }

    validate() {
        super.validate();
        if (typeof this.value !== 'boolean') {
            throw new Error(`SetMoDTAvailableNode ${this.id} must have boolean value`);
        }
        return true;
    }
}

// ============================================================================
// CLASSE GRAPH - Representa um grafo completo
// ============================================================================

class Graph {
    constructor(name) {
        this.name = name;
        this.nodes = new Map(); // Map<id, Node>
        this.startNode = null;
    }

    /**
     * Adiciona um nó ao grafo
     */
    addNode(node) {
        if (this.nodes.has(node.id)) {
            throw new Error(`Graph ${this.name}: duplicate node ID ${node.id}`);
        }
        
        node.validate();
        this.nodes.set(node.id, node);
        
        // Se for StartNode, marcar como início
        if (node.type === 'Start') {
            if (this.startNode) {
                throw new Error(`Graph ${this.name}: multiple start nodes`);
            }
            this.startNode = node.id;
        }
        
        return this;
    }

    /**
     * Obtém um nó pelo ID
     */
    getNode(id) {
        const node = this.nodes.get(id);
        if (!node) {
            throw new Error(`Graph ${this.name}: node ${id} not found`);
        }
        return node;
    }

    /**
     * Valida o grafo completo
     */
    validate() {
        // Verificar se tem nó de início
        if (!this.startNode) {
            throw new Error(`Graph ${this.name}: no start node`);
        }

        // Verificar se todas as referências existem
        for (const [id, node] of this.nodes) {
            if (node.type === 'End') continue;
            if (node.type === 'ReturnFromGraph') continue;

            // Coletar todos os IDs referenciados
            const referencedIds = [];
            
            if (node.next) {
                referencedIds.push(node.next);
            }
            if (node.nexts) {
                referencedIds.push(...node.nexts);
            }
            if (node.nextYes) {
                referencedIds.push(node.nextYes);
            }
            if (node.nextNo) {
                referencedIds.push(node.nextNo);
            }
            if (node.nextMilitar) {
                referencedIds.push(node.nextMilitar);
            }
            if (node.nextCorrupcao) {
                referencedIds.push(node.nextCorrupcao);
            }
            if (node.dieTypeMap) {
                referencedIds.push(...Object.values(node.dieTypeMap));
            }

            // Verificar se todos existem (exceto se for JumpToGraph)
            for (const refId of referencedIds) {
                if (refId && !this.nodes.has(refId) && node.type !== 'JumpToGraph') {
                    console.warn(`Graph ${this.name}: node ${id} references non-existent node ${refId}`);
                }
            }
        }

        return true;
    }

    /**
     * Exporta o grafo para JSON
     */
    toJSON() {
        const nodesArray = Array.from(this.nodes.values()).map(node => {
            const obj = { ...node };
            // Remover propriedades desnecessárias
            delete obj.validate;
            return obj;
        });

        return {
            name: this.name,
            startNode: this.startNode,
            nodes: nodesArray
        };
    }

    /**
     * Importa um grafo de JSON
     */
    static fromJSON(json) {
        const graph = new Graph(json.name);
        
        // Criar instâncias dos nós baseado no tipo
        for (const nodeData of json.nodes) {
            let node;
            
            switch (nodeData.type) {
                case 'Start':
                    node = new StartNode(nodeData.id, nodeData.next);
                    break;
                case 'End':
                    node = new EndNode(nodeData.id);
                    break;
                case 'PerformAction':
                    node = new PerformActionNode(nodeData.id, nodeData.message, nodeData.nexts[0]);
                    break;
                case 'BinaryCondition':
                    // nexts[0] = Yes, nexts[1] = No
                    node = new BinaryConditionNode(nodeData.id, nodeData.message, nodeData.nexts[0], nodeData.nexts[1]);
                    break;
                case 'MultipleChoice':
                    node = new MultipleChoiceNode(nodeData.id, nodeData.message, nodeData.options, nodeData.nexts);
                    break;
                case 'JumpToGraph':
                    node = new JumpToGraphNode(nodeData.id, nodeData.targetGraph, nodeData.returnTo);
                    break;
                case 'ReturnFromGraph':
                    node = new ReturnFromGraphNode(nodeData.id);
                    break;
                case 'CheckStrategy':
                    node = new CheckStrategyNode(nodeData.id, nodeData.nextMilitar, nodeData.nextCorrupcao);
                    break;
                case 'SetStrategy':
                    node = new SetStrategyNode(nodeData.id, nodeData.strategyName, nodeData.next);
                    break;
                case 'SetRingAvailable':
                    node = new SetRingAvailableNode(nodeData.id, nodeData.value, nodeData.next);
                    break;
                case 'SetMoDTAvailable':
                    node = new SetMoDTAvailableNode(nodeData.id, nodeData.value, nodeData.next);
                    break;
                case 'UseActiveDie':
                    node = new UseActiveDieNode(nodeData.id, nodeData.dieTypeMap);
                    break;
                case 'GetAvailableDice':
                    node = new GetAvailableDiceNode(nodeData.id, nodeData.nexts[0]);
                    break;
                case 'Dummy':
                    node = new DummyNode(nodeData.id, nodeData.next);
                    break;
                default:
                    throw new Error(`Unknown node type: ${nodeData.type}`);
            }
            
            graph.addNode(node);
        }
        
        graph.validate();
        return graph;
    }
}

// ============================================================================
// GRAPH MANAGER - Gerencia todos os grafos carregados
// ============================================================================

class GraphManager {
    constructor() {
        this.graphs = new Map(); // Map<name, Graph>
    }

    /**
     * Adiciona um grafo ao gerenciador
     */
    addGraph(graph) {
        if (this.graphs.has(graph.name)) {
            throw new Error(`GraphManager: duplicate graph name ${graph.name}`);
        }
        this.graphs.set(graph.name, graph);
        return this;
    }

    /**
     * Obtém um grafo pelo nome
     */
    getGraph(name) {
        const graph = this.graphs.get(name);
        if (!graph) {
            throw new Error(`GraphManager: graph ${name} not found`);
        }
        return graph;
    }

    /**
     * Retorna lista de nomes de todos os grafos
     */
    getAllGraphNames() {
        return Array.from(this.graphs.keys());
    }

    /**
     * Carrega grafos de um array de JSON
     */
    loadGraphsFromJSON(graphsJSON) {
        for (const json of graphsJSON) {
            const graph = Graph.fromJSON(json);
            this.addGraph(graph);
        }
        return this;
    }

    /**
     * Lista todos os grafos carregados
     */
    listGraphs() {
        return Array.from(this.graphs.keys());
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Singleton do gerenciador de grafos
const graphManager = new GraphManager();

// Exportar classes e singleton
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = {
        Node,
        NonInteractiveNode,
        InteractiveNode,
        StartNode,
        EndNode,
        PerformActionNode,
        BinaryConditionNode,
        MultipleChoiceNode,
        JumpToGraphNode,
        ReturnFromGraphNode,
        CheckStrategyNode,
        UseActiveDieNode,
        GetAvailableDiceNode,
        DummyNode,
        Graph,
        GraphManager,
        graphManager
    };
}
