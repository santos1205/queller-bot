/**
 * SISTEMA DE ESTADO DO JOGO
 * 
 * Gerencia o estado completo da partida: fase atual, estratégia,
 * dados disponíveis, histórico de ações, etc.
 * 
 * Baseado em: Queller/src/quellerstate.jl e Queller/src/Queller.jl (ProgramState)
 */

class GameState {
    constructor() {
        this.reset();
    }

    /**
     * Reseta o jogo para o estado inicial
     */
    reset() {
        // Fase atual (1 a 5)
        this.currentPhase = 1;
        this.totalPhases = 5;

        // Estratégia escolhida (será definida no início)
        this.strategy = null;

        // Dados de ação disponíveis
        this.availableDice = [];

        // Histórico de ações
        this.history = [];

        // Estado do grafo de decisão atual
        this.currentNode = null;
        this.currentGraph = null;

        // Flags de controle
        this.gameStarted = false;
        this.phaseComplete = false;

        // Habilidades especiais disponíveis
        this.ringAvailable = true; // Anéis Élficos disponíveis
        this.modtAvailable = true; // Mensageiro da Torre Negra disponível

        // Dado ativo (o que está sendo usado agora)
        this.activeDie = null;

        // Stack para desfazer ações
        this.stateStack = [];
    }

    /**
     * Salva estado atual na pilha (para desfazer)
     */
    saveState() {
        const snapshot = {
            currentPhase: this.currentPhase,
            strategy: this.strategy,
            availableDice: [...this.availableDice],
            history: [...this.history],
            currentNode: this.currentNode,
            currentGraph: this.currentGraph,
            gameStarted: this.gameStarted,
            phaseComplete: this.phaseComplete,
            ringAvailable: this.ringAvailable,
            modtAvailable: this.modtAvailable,
            activeDie: this.activeDie ? { ...this.activeDie } : null
        };

        this.stateStack.push(snapshot);

        // Limita o tamanho da pilha (últimas 20 ações)
        if (this.stateStack.length > 20) {
            this.stateStack.shift();
        }
    }

    /**
     * Restaura o último estado salvo (desfazer)
     * @returns {boolean} - true se conseguiu desfazer
     */
    undo() {
        if (this.stateStack.length === 0) {
            return false;
        }

        const snapshot = this.stateStack.pop();

        this.currentPhase = snapshot.currentPhase;
        this.strategy = snapshot.strategy;
        this.availableDice = [...snapshot.availableDice];
        this.history = [...snapshot.history];
        this.currentNode = snapshot.currentNode;
        this.currentGraph = snapshot.currentGraph;
        this.gameStarted = snapshot.gameStarted;
        this.phaseComplete = snapshot.phaseComplete;
        this.ringAvailable = snapshot.ringAvailable;
        this.modtAvailable = snapshot.modtAvailable;
        this.activeDie = snapshot.activeDie ? { ...snapshot.activeDie } : null;

        return true;
    }

    /**
     * Verifica se pode desfazer
     * @returns {boolean}
     */
    canUndo() {
        return this.stateStack.length > 0;
    }

    /**
     * Inicia o jogo com uma estratégia
     * @param {string} strategy - Estratégia escolhida
     */
    startGame(strategy) {
        this.strategy = strategy;
        this.gameStarted = true;
        this.currentPhase = 1;
        this.addToHistory(`🎮 Jogo iniciado! Estratégia: ${Strategy.format(strategy)}`);
    }

    /**
     * Define os dados disponíveis
     * @param {string[]} dice - Array de tipos de dados
     */
    setAvailableDice(dice) {
        this.availableDice = [...dice];
    }

    /**
     * Remove um dado da lista de disponíveis
     * @param {string} dieType - Tipo do dado a remover
     * @returns {boolean} - true se removeu com sucesso
     */
    removeDie(dieType) {
        const index = this.availableDice.indexOf(dieType);
        if (index === -1) return false;

        this.availableDice.splice(index, 1);
        return true;
    }

    /**
     * Adiciona um dado à lista de disponíveis
     * @param {string} dieType - Tipo do dado
     */
    addDie(dieType) {
        this.availableDice.push(dieType);
    }

    /**
     * Avança para a próxima fase
     */
    nextPhase() {
        if (this.currentPhase < this.totalPhases) {
            this.currentPhase++;
            this.phaseComplete = false;
            this.addToHistory(`📍 Fase ${this.currentPhase} iniciada`);
        }
    }

    /**
     * Reinicia a fase atual
     */
    resetPhase() {
        this.phaseComplete = false;
        this.currentNode = null;
        this.currentGraph = null;
        this.addToHistory(`🔄 Fase ${this.currentPhase} reiniciada`);
    }

    /**
     * Vai para uma fase específica
     * @param {number} phaseNumber - Número da fase (1-5)
     */
    goToPhase(phaseNumber) {
        if (phaseNumber >= 1 && phaseNumber <= this.totalPhases) {
            this.currentPhase = phaseNumber;
            this.phaseComplete = false;
            this.currentNode = null;
            this.currentGraph = null;
            this.addToHistory(`📍 Indo para Fase ${phaseNumber}`);
        }
    }

    /**
     * Marca a fase como completa
     */
    completePhase() {
        this.phaseComplete = true;
        this.addToHistory(`✅ Fase ${this.currentPhase} completa!`);
    }

    /**
     * Define o dado ativo (que está sendo usado agora)
     * @param {Object} dieInfo - Informações do dado ativo
     */
    setActiveDie(dieInfo) {
        this.activeDie = dieInfo;
    }

    /**
     * Limpa o dado ativo
     */
    clearActiveDie() {
        this.activeDie = null;
    }

    /**
     * Adiciona uma entrada ao histórico
     * @param {string} message - Mensagem a adicionar
     * @param {string} type - Tipo da mensagem (info, action, question, etc)
     */
    addToHistory(message, type = 'info') {
        const entry = {
            timestamp: new Date(),
            message: message,
            type: type,
            phase: this.currentPhase
        };

        this.history.push(entry);

        // Limita histórico a 100 entradas
        if (this.history.length > 100) {
            this.history.shift();
        }
    }

    /**
     * Obtém o histórico recente
     * @param {number} count - Quantidade de entradas (padrão: 10)
     * @returns {Array}
     */
    getRecentHistory(count = 10) {
        return this.history.slice(-count);
    }

    /**
     * Usa um Anel Élfico
     */
    useRing() {
        if (this.ringAvailable) {
            this.ringAvailable = false;
            this.addToHistory('💍 Anel Élfico usado');
        }
    }

    /**
     * Usa habilidade Mensageiro da Torre Negra
     */
    useModt() {
        if (this.modtAvailable) {
            this.modtAvailable = false;
            this.addToHistory('🗼 Mensageiro da Torre Negra usado');
        }
    }

    /**
     * Restaura habilidades especiais
     */
    restoreAbilities() {
        this.ringAvailable = true;
        this.modtAvailable = true;
    }

    /**
     * Exporta o estado para JSON (salvar partida)
     * @returns {string}
     */
    exportToJSON() {
        return JSON.stringify({
            currentPhase: this.currentPhase,
            strategy: this.strategy,
            availableDice: this.availableDice,
            history: this.history,
            currentNode: this.currentNode,
            currentGraph: this.currentGraph,
            gameStarted: this.gameStarted,
            phaseComplete: this.phaseComplete,
            ringAvailable: this.ringAvailable,
            modtAvailable: this.modtAvailable,
            activeDie: this.activeDie
        }, null, 2);
    }

    /**
     * Importa estado de JSON (carregar partida)
     * @param {string} json - JSON do estado
     * @returns {boolean} - true se importou com sucesso
     */
    importFromJSON(json) {
        try {
            const data = JSON.parse(json);

            this.currentPhase = data.currentPhase || 1;
            this.strategy = data.strategy;
            this.availableDice = data.availableDice || [];
            this.history = data.history || [];
            this.currentNode = data.currentNode;
            this.currentGraph = data.currentGraph;
            this.gameStarted = data.gameStarted || false;
            this.phaseComplete = data.phaseComplete || false;
            this.ringAvailable = data.ringAvailable !== undefined ? data.ringAvailable : true;
            this.modtAvailable = data.modtAvailable !== undefined ? data.modtAvailable : true;
            this.activeDie = data.activeDie;

            return true;
        } catch (error) {
            console.error('Erro ao importar estado:', error);
            return false;
        }
    }

    /**
     * Obtém informações resumidas do estado
     * @returns {Object}
     */
    getSummary() {
        return {
            phase: this.currentPhase,
            strategy: this.strategy ? Strategy.getName(this.strategy) : 'Não definida',
            diceCount: this.availableDice.length,
            gameStarted: this.gameStarted,
            canUndo: this.canUndo(),
            ringAvailable: this.ringAvailable,
            modtAvailable: this.modtAvailable
        };
    }
}

// Instância global do estado do jogo
const gameState = new GameState();

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState, gameState };
}
