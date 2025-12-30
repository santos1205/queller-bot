/**
 * INTERFACE COM O USUÁRIO (UI)
 * 
 * Gerencia toda a interação visual: atualização de elementos na tela,
 * criação de botões, exibição de mensagens, etc.
 * 
 * Baseado em: Queller/src/cli.jl (adaptado para web)
 */

const UI = {
    // Referências aos elementos HTML (serão definidas na inicialização)
    elements: {},

    /**
     * Inicializa a UI e captura referências aos elementos
     */
    init() {
        this.elements = {
            // Painel de status
            currentPhase: document.getElementById('current-phase'),
            currentStrategy: document.getElementById('current-strategy'),
            availableDice: document.getElementById('available-dice'),

            // Área de mensagens
            messageDisplay: document.getElementById('message-display'),

            // Área de interação
            interactionPanel: document.getElementById('interaction-panel'),

            // Histórico
            historyList: document.getElementById('history-list'),

            // Botões do rodapé
            btnUndo: document.getElementById('btn-undo'),
            btnResetPhase: document.getElementById('btn-reset-phase'),
            btnNewGame: document.getElementById('btn-new-game'),
            btnHelp: document.getElementById('btn-help'),

            // Modal de ajuda
            helpModal: document.getElementById('help-modal')
        };

        this.setupEventListeners();
        this.updateAll();
    },

    /**
     * Configura event listeners dos botões fixos
     */
    setupEventListeners() {
        // Botão Novo Jogo
        this.elements.btnNewGame.addEventListener('click', () => {
            this.showYesNoQuestion(
                '⚠️ Tem certeza que deseja começar um novo jogo? O progresso atual será perdido.',
                () => {
                    gameState.clearLocalStorage();
                    location.reload();
                },
                () => {
                    // Cancelar
                }
            );
        });

        // Botão de ajuda
        this.elements.btnHelp.addEventListener('click', () => {
            this.showHelpModal();
        });

        // Fechar modal
        const closeBtn = this.elements.helpModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            this.hideHelpModal();
        });

        // Fechar modal clicando fora
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.hideHelpModal();
            }
        });

        // Botão de desfazer
        this.elements.btnUndo.addEventListener('click', () => {
            this.handleUndo();
        });

        // Botão de reiniciar fase
        this.elements.btnResetPhase.addEventListener('click', () => {
            this.handleResetPhase();
        });
    },

    /**
     * Atualiza todos os elementos da UI
     */
    updateAll() {
        this.updateStatus();
        this.updateHistory();
        this.updateButtons();
    },

    /**
     * Atualiza o painel de status
     */
    updateStatus() {
        // Fase atual
        this.elements.currentPhase.textContent = gameState.currentPhase;

        // Estratégia
        if (gameState.strategy) {
            this.elements.currentStrategy.textContent = Strategy.format(gameState.strategy);
        } else {
            this.elements.currentStrategy.textContent = '-';
        }

        // Dados disponíveis
        this.elements.availableDice.textContent = gameState.availableDice.length;
    },

    /**
     * Atualiza o histórico
     */
    updateHistory() {
        const history = gameState.getRecentHistory(10);
        
        if (history.length === 0) {
            this.elements.historyList.innerHTML = '<p style="text-align:center; color:#999;">Nenhuma ação ainda</p>';
            return;
        }

        // Inverte a ordem para mostrar mais recente primeiro
        this.elements.historyList.innerHTML = history.reverse().map(entry => {
            const time = this.formatTime(entry.timestamp);
            return `
                <div class="history-item">
                    <div class="history-item-time">Fase ${entry.phase} - ${time}</div>
                    <div class="history-item-text">${entry.message}</div>
                </div>
            `;
        }).join('');

        // Scroll para o topo (mais recente)
        this.elements.historyList.scrollTop = 0;
    },

    /**
     * Formata timestamp para exibição
     * @param {Date|string} date
     * @returns {string}
     */
    formatTime(date) {
        // Converte string para Date se necessário (após carregar do localStorage)
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    /**
     * Atualiza estado dos botões (habilitado/desabilitado)
     */
    updateButtons() {
        // Botão de desfazer
        this.elements.btnUndo.disabled = !gameState.canUndo();

        // Botão de reiniciar fase
        this.elements.btnResetPhase.disabled = !gameState.gameStarted;
    },

    /**
     * Mostra uma mensagem na área de mensagens
     * @param {string} text - Texto da mensagem
     * @param {string} type - Tipo: 'info', 'success', 'warning', 'question'
     */
    showMessage(text, type = 'info') {
        const colors = {
            'info': '#fff3cd',
            'success': '#d4edda',
            'warning': '#f8d7da',
            'question': '#d1ecf1'
        };

        const borders = {
            'info': '#f39c12',
            'success': '#27ae60',
            'warning': '#e74c3c',
            'question': '#3498db'
        };

        this.elements.messageDisplay.style.background = colors[type] || colors.info;
        this.elements.messageDisplay.style.borderLeft = `4px solid ${borders[type] || borders.info}`;
        this.elements.messageDisplay.innerHTML = `<p>${text}</p>`;
    },

    /**
     * Mostra uma ação para o jogador executar
     * @param {string} action - Descrição da ação
     */
    showAction(action) {
        this.showMessage(`<strong>📋 Execute esta ação:</strong><br>${action}`, 'info');
    },

    /**
     * Limpa o painel de interação
     */
    clearInteractionPanel() {
        this.elements.interactionPanel.innerHTML = '';
    },

    /**
     * Cria um botão simples
     * @param {string} text - Texto do botão
     * @param {Function} onClick - Função ao clicar
     * @param {string} styleClass - Classe CSS (btn-primary, btn-success, etc)
     * @returns {HTMLElement}
     */
    createButton(text, onClick, styleClass = 'btn-primary') {
        const btn = document.createElement('button');
        btn.className = `btn ${styleClass}`;
        btn.textContent = text;
        btn.addEventListener('click', onClick);
        return btn;
    },

    /**
     * Mostra um botão para confirmar uma ação
     * @param {string} actionText - Texto da ação a executar
     * @param {Function} onConfirm - Callback ao confirmar
     */
    showActionWithConfirmation(actionText, onConfirm) {
        this.showAction(actionText);
        
        this.clearInteractionPanel();
        
        const btn = this.createButton('✅ Concluído', () => {
            onConfirm();
            this.updateAll();
        }, 'btn-success btn-large');
        
        this.elements.interactionPanel.appendChild(btn);
    },

    /**
     * Mostra uma pergunta Sim/Não
     * @param {string} question - Texto da pergunta
     * @param {Function} onYes - Callback para Sim
     * @param {Function} onNo - Callback para Não
     */
    showYesNoQuestion(question, onYes, onNo) {
        this.showMessage(`<strong>❓ Pergunta:</strong><br>${question}`, 'question');
        
        this.clearInteractionPanel();
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        
        const btnYes = this.createButton('✅ Sim', () => {
            // Corrige bug: só adiciona ao histórico DEPOIS do load se for continuar jogo salvo
            if (question.includes('Continuar jogo salvo')) {
                if (gameState.loadFromLocalStorage()) {
                    gameState.addToHistory(`Resposta: SIM - ${question}`);
                    resumeSavedGame();
                    this.updateAll();
                }
            } else {
                gameState.addToHistory(`Resposta: SIM - ${question}`);
                onYes();
                this.updateAll();
            }
        }, 'btn-success');
        
        const btnNo = this.createButton('❌ Não', () => {
            gameState.addToHistory(`Resposta: NÃO - ${question}`);
            onNo();
            this.updateAll();
        }, 'btn-danger');
        
        btnGroup.appendChild(btnYes);
        btnGroup.appendChild(btnNo);
        this.elements.interactionPanel.appendChild(btnGroup);
    },

    /**
     * Mostra opções de múltipla escolha
     * @param {string} question - Texto da pergunta
     * @param {Array} options - Array de {text, value}
     * @param {Function} onSelect - Callback(value) ao selecionar
     */
    showMultipleChoice(question, options, onSelect) {
        this.showMessage(`<strong>❓ Escolha uma opção:</strong><br>${question}`, 'question');
        
        this.clearInteractionPanel();
        
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';
        btnGroup.style.flexDirection = 'column';
        btnGroup.style.maxWidth = '500px';
        
        options.forEach((option, index) => {
            const btn = this.createButton(
                `${index + 1}. ${option.text}`,
                () => {
                    gameState.addToHistory(`Escolha: ${option.text}`);
                    onSelect(option.value);
                    this.updateAll();
                },
                'btn-primary'
            );
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btnGroup.appendChild(btn);
        });
        
        this.elements.interactionPanel.appendChild(btnGroup);
    },

    /**
     * Mostra input de texto
     * @param {string} question - Pergunta
     * @param {string} placeholder - Placeholder do input
     * @param {Function} onSubmit - Callback(value) ao enviar
     */
    showTextInput(question, placeholder, onSubmit) {
        this.showMessage(`<strong>❓ Responda:</strong><br>${question}`, 'question');
        
        this.clearInteractionPanel();
        
        const container = document.createElement('div');
        container.className = 'input-group';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.style.maxWidth = '400px';
        
        const btn = this.createButton('✅ Enviar', () => {
            const value = input.value.trim();
            if (value) {
                gameState.addToHistory(`Resposta: ${value}`);
                onSubmit(value);
                this.updateAll();
            }
        }, 'btn-success');
        
        // Permite enviar com Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btn.click();
            }
        });
        
        container.appendChild(input);
        container.appendChild(btn);
        this.elements.interactionPanel.appendChild(container);
        
        // Foca no input
        setTimeout(() => input.focus(), 100);
    },

    /**
     * Mostra modal de ajuda
     */
    showHelpModal() {
        this.elements.helpModal.classList.remove('hidden');
    },

    /**
     * Esconde modal de ajuda
     */
    hideHelpModal() {
        this.elements.helpModal.classList.add('hidden');
    },

    /**
     * Handler para botão de desfazer
     */
    handleUndo() {
        if (gameState.undo()) {
            this.showMessage('⬅️ Ação desfeita!', 'info');
            this.updateAll();
        }
    },

    /**
     * Handler para botão de reiniciar fase
     */
    handleResetPhase() {
        if (confirm(`Deseja reiniciar a Fase ${gameState.currentPhase}?`)) {
            gameState.resetPhase();
            this.showMessage(`🔄 Fase ${gameState.currentPhase} reiniciada!`, 'warning');
            this.updateAll();
            
            // Reinicia a fase (será implementado no main.js)
            if (typeof startPhase === 'function') {
                startPhase(gameState.currentPhase);
            }
        }
    },

    /**
     * Mostra tela de início do jogo
     * @param {Function} onStart - Callback ao iniciar
     */
    showStartScreen(onStart) {
        this.showMessage('Bem-vindo ao Queller Bot!<br>Clique em <strong>Iniciar Jogo</strong> para começar.', 'info');
        
        this.clearInteractionPanel();
        
        const btn = this.createButton('🎮 Iniciar Jogo', () => {
            onStart();
        }, 'btn-primary btn-large');
        
        this.elements.interactionPanel.appendChild(btn);
    },

    /**
     * Mostra seletor de dados com combos
     * @param {Function} onSubmit - Callback(diceArray) ao confirmar
     */
    showDiceSelector(onSubmit) {
        this.showMessage(
            '🎲 <strong>Selecione os dados de ação disponíveis para o bot</strong><br>' +
            '<small>Use os menus dropdown para adicionar cada dado. Clique em "Adicionar Dado" para cada um.</small>',
            'question'
        );
        
        this.clearInteractionPanel();
        
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '20px';
        container.style.alignItems = 'center';
        container.style.maxWidth = '600px';
        container.style.width = '100%';
        
        // Lista de dados selecionados
        const selectedDice = [];
        
        // Container para mostrar dados selecionados
        const selectedContainer = document.createElement('div');
        selectedContainer.style.width = '100%';
        selectedContainer.style.padding = '15px';
        selectedContainer.style.background = '#f8f9fa';
        selectedContainer.style.borderRadius = '8px';
        selectedContainer.style.minHeight = '60px';
        selectedContainer.innerHTML = '<p style="text-align:center; color:#999; margin:0;">Nenhum dado selecionado ainda</p>';
        
        // Área de seleção
        const selectorArea = document.createElement('div');
        selectorArea.style.display = 'flex';
        selectorArea.style.gap = '10px';
        selectorArea.style.alignItems = 'center';
        selectorArea.style.width = '100%';
        selectorArea.style.justifyContent = 'center';
        selectorArea.style.flexWrap = 'wrap';
        
        // Select do tipo de dado
        const select = document.createElement('select');
        select.style.padding = '12px';
        select.style.fontSize = '1rem';
        select.style.borderRadius = '8px';
        select.style.border = '2px solid #ddd';
        select.style.minWidth = '200px';
        select.style.cursor = 'pointer';
        
        const diceTypes = [
            { value: 'E', label: '⚔️ Exército' },
            { value: 'R', label: '🏰 Recrutar' },
            { value: 'ER', label: '⚔️/🏰 Exército/Recrutar' },
            { value: 'P', label: '👤 Personagem' },
            { value: 'EV', label: '📜 Evento' },
            { value: 'O', label: '👁️ Olho' }
        ];
        
        diceTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            select.appendChild(option);
        });
        
        // Botão adicionar dado
        const btnAdd = this.createButton('➕ Adicionar Dado', () => {
            const selectedValue = select.value;
            selectedDice.push(selectedValue);
            updateSelectedDisplay();
        }, 'btn-primary');
        
        // Botão remover último
        const btnRemove = this.createButton('❌ Remover Último', () => {
            if (selectedDice.length > 0) {
                selectedDice.pop();
                updateSelectedDisplay();
            }
        }, 'btn-danger btn-small');
        
        // Botão limpar todos
        const btnClear = this.createButton('🗑️ Limpar Todos', () => {
            selectedDice.length = 0;
            updateSelectedDisplay();
        }, 'btn-warning btn-small');
        
        // Função para atualizar display de dados selecionados
        const updateSelectedDisplay = () => {
            if (selectedDice.length === 0) {
                selectedContainer.innerHTML = '<p style="text-align:center; color:#999; margin:0;">Nenhum dado selecionado ainda</p>';
            } else {
                const diceHTML = selectedDice.map((die, index) => {
                    return `<span style="display:inline-block; background:#fff; padding:8px 12px; margin:4px; border-radius:6px; border:2px solid #3498db; font-size:1.1rem;">
                        ${Dice.format(die, true)}
                    </span>`;
                }).join('');
                
                selectedContainer.innerHTML = `
                    <div style="text-align:center;">
                        <p style="margin:0 0 10px 0; font-weight:600; color:#2c3e50;">
                            Dados Selecionados (${selectedDice.length}):
                        </p>
                        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:5px;">
                            ${diceHTML}
                        </div>
                    </div>
                `;
            }
        };
        
        // Botão confirmar
        const btnConfirm = this.createButton('✅ Confirmar Dados', () => {
            if (selectedDice.length === 0) {
                alert('Por favor, adicione pelo menos um dado!');
                return;
            }
            gameState.addToHistory(`Dados registrados: ${Dice.formatArray(selectedDice)}`);
            onSubmit(selectedDice);
            this.updateAll();
        }, 'btn-success btn-large');
        
        // Montagem
        selectorArea.appendChild(select);
        selectorArea.appendChild(btnAdd);
        
        const controlsArea = document.createElement('div');
        controlsArea.style.display = 'flex';
        controlsArea.style.gap = '10px';
        controlsArea.style.justifyContent = 'center';
        controlsArea.style.flexWrap = 'wrap';
        controlsArea.appendChild(btnRemove);
        controlsArea.appendChild(btnClear);
        
        container.appendChild(selectedContainer);
        container.appendChild(selectorArea);
        container.appendChild(controlsArea);
        container.appendChild(btnConfirm);
        
        this.elements.interactionPanel.appendChild(container);
    }
};

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
