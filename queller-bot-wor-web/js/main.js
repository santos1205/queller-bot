/**
 * MAIN - INICIALIZAÇÃO DO APLICATIVO
 * 
 * Ponto de entrada principal. Inicializa todos os sistemas
 * e gerencia o fluxo geral do jogo.
 * 
 * Baseado em: Queller/src/Queller.jl (função main)
 */

/**
 * Inicializa o aplicativo quando a página carrega
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎲 Queller Bot Web - Iniciando...');
    
    // Inicializa a UI
    UI.init();
    
    // Mostra tela inicial
    UI.showStartScreen(startGame);
    
    console.log('✅ Queller Bot Web - Pronto!');
});

/**
 * Inicia um novo jogo
 */
function startGame() {
    console.log('🎮 Iniciando novo jogo...');
    
    // Salva estado antes de iniciar
    gameState.saveState();
    
    // Escolhe estratégia aleatória
    const strategy = Strategy.random();
    gameState.startGame(strategy);
    
    UI.updateAll();
    
    // Mostra a estratégia escolhida
    UI.showMessage(
        `🎯 <strong>Estratégia escolhida:</strong> ${Strategy.format(strategy, true, true)}<br><br>` +
        `O Queller Bot jogará com foco em <strong>${Strategy.getName(strategy)}</strong> durante esta partida!`,
        'success'
    );
    
    // Após 3 segundos, inicia a Fase 1
    setTimeout(() => {
        startPhase(1);
    }, 3000);
}

/**
 * Inicia uma fase específica
 * @param {number} phaseNumber - Número da fase (1-5)
 */
function startPhase(phaseNumber) {
    console.log(`📍 Iniciando Fase ${phaseNumber}...`);
    
    gameState.saveState();
    gameState.goToPhase(phaseNumber);
    UI.updateAll();
    
    // Mostra mensagem da fase
    const phaseMessages = {
        1: '🌅 <strong>Fase 1: Recuperar Dados e Comprar Cartas</strong><br>O bot irá recuperar seus dados de ação e comprar cartas de evento.',
        2: '🗺️ <strong>Fase 2: Camaradagem e Declaração</strong><br>O bot irá mover a Sociedade e fazer declarações.',
        3: '⚔️ <strong>Fase 3: Ações</strong><br>O bot usará seus dados de ação para realizar ações.',
        4: '👁️ <strong>Fase 4: Olho de Sauron</strong><br>Verificação e ações relacionadas ao Olho.',
        5: '🏆 <strong>Fase 5: Verificação de Vitória</strong><br>Verifica se há um vencedor.'
    };
    
    UI.showMessage(phaseMessages[phaseNumber] || `Fase ${phaseNumber}`, 'info');
    
    // Solicitar dados apenas na Fase 1, depois vai direto para demonstração
    setTimeout(() => {
        if (phaseNumber === 1) {
            // Fase 1: solicitar dados se ainda não tiver
            if (gameState.availableDice.length === 0) {
                requestDiceInput();
            } else {
                startDecisionProcess();
            }
        } else {
            // Fases 2-5: ir direto para demonstração
            startDecisionProcess();
        }
    }, 3000);
}

/**
 * Solicita ao usuário que informe os dados disponíveis
 */
function requestDiceInput() {
    UI.showDiceSelector((dice) => {
        handleDiceInput(dice);
    });
}

/**
 * Processa a entrada de dados do usuário
 * @param {Array} dice - Array com os dados selecionados
 */
function handleDiceInput(dice) {
    if (dice.length === 0) {
        UI.showMessage(
            '❌ <strong>Erro!</strong><br>' +
            'Por favor, adicione pelo menos um dado.',
            'warning'
        );
        
        setTimeout(() => {
            requestDiceInput();
        }, 2000);
        return;
    }
    
    gameState.saveState();
    gameState.setAvailableDice(dice);
    UI.updateAll();
    
    UI.showMessage(
        `✅ <strong>Dados registrados!</strong><br>` +
        `Total: ${dice.length} dados<br>` +
        `${Dice.formatArray(dice)}`,
        'success'
    );
    
    // Após registrar os dados, começa o processo de decisão
    setTimeout(() => {
        startDecisionProcess();
    }, 2000);
}

/**
 * Inicia o processo de decisão (simplificado por enquanto)
 */
function startDecisionProcess() {
    // Por enquanto, vamos fazer uma demonstração simples
    demonstratePhase();
}

/**
 * Demonstração das fases (temporário - será substituído pelo sistema de grafos)
 */
function demonstratePhase() {
    const phase = gameState.currentPhase;
    
    if (phase === 1) {
        demonstratePhase1();
    } else if (phase === 2) {
        demonstratePhase2();
    } else if (phase === 3) {
        demonstratePhase3();
    } else if (phase === 4) {
        demonstratePhase4();
    } else if (phase === 5) {
        demonstratePhase5();
    }
}

/**
 * Demonstração da Fase 1
 */
function demonstratePhase1() {
    UI.showActionWithConfirmation(
        '📋 <strong>Recupere todos os dados de ação</strong> que foram usados na rodada anterior.<br>' +
        '<small>(Se for a primeira rodada, não há dados para recuperar)</small>',
        () => {
            gameState.saveState();
            UI.showActionWithConfirmation(
                '🃏 <strong>Compre cartas de evento</strong> até ter 6 cartas na mão.<br>' +
                '<small>Embaralhe o descarte se necessário.</small>',
                () => {
                    completePhase();
                }
            );
        }
    );
}

/**
 * Demonstração da Fase 2
 */
function demonstratePhase2() {
    UI.showYesNoQuestion(
        'A Sociedade está no tabuleiro?',
        () => {
            // Sim - Sociedade está no tabuleiro
            UI.showActionWithConfirmation(
                '👣 <strong>Mova a Sociedade</strong> de acordo com as regras do jogo.',
                () => {
                    askAboutDeclarations();
                }
            );
        },
        () => {
            // Não - Sociedade não está no tabuleiro
            askAboutDeclarations();
        }
    );
}

function askAboutDeclarations() {
    UI.showYesNoQuestion(
        'O bot precisa fazer alguma declaração especial nesta fase?<br>' +
        '<small>(Ex: declarar Éowyn, revelar Saruman, etc.)</small>',
        () => {
            UI.showTextInput(
                'Descreva qual declaração o bot faz:',
                'Ex: Declarar Éowyn',
                (declaration) => {
                    gameState.addToHistory(`Declaração: ${declaration}`);
                    completePhase();
                }
            );
        },
        () => {
            completePhase();
        }
    );
}

/**
 * Demonstração da Fase 3
 */
function demonstratePhase3() {
    if (gameState.availableDice.length === 0) {
        UI.showMessage(
            '✅ Não há mais dados disponíveis.<br>Fase de Ações completa!',
            'success'
        );
        setTimeout(() => completePhase(), 3000);
        return;
    }
    
    // Escolhe um dado aleatório para usar
    const randomIndex = Math.floor(Math.random() * gameState.availableDice.length);
    const selectedDie = gameState.availableDice[randomIndex];
    
    UI.showMessage(
        `🎲 <strong>Dado selecionado:</strong> ${Dice.format(selectedDie)}<br><br>` +
        `O bot usará este dado para realizar uma ação baseada na estratégia ${Strategy.format(gameState.strategy)}.`,
        'info'
    );
    
    setTimeout(() => {
        performActionWithDie(selectedDie);
    }, 3000);
}

function performActionWithDie(die) {
    const actions = {
        'E': ['Mover exército', 'Atacar', 'Recrutar unidades com exército'],
        'R': ['Recrutar unidades', 'Mover e recrutar'],
        'ER': ['Escolher entre exército ou recrutar'],
        'P': ['Mover personagem', 'Usar habilidade de personagem'],
        'EV': ['Jogar carta de evento', 'Comprar cartas'],
        'O': ['Caçar a Sociedade', 'Mover Nazgûl']
    };
    
    const possibleActions = actions[die] || ['Ação genérica'];
    const action = possibleActions[Math.floor(Math.random() * possibleActions.length)];
    
    UI.showActionWithConfirmation(
        `📋 <strong>Ação do bot:</strong> ${action}<br>` +
        `<small>Usando dado: ${Dice.format(die)}</small>`,
        () => {
            gameState.saveState();
            gameState.removeDie(die);
            gameState.addToHistory(`Ação executada: ${action} (${Dice.getName(die)})`);
            UI.updateAll();
            
            // Continua com próximo dado
            setTimeout(() => demonstratePhase3(), 2000);
        }
    );
}

/**
 * Demonstração da Fase 4
 */
function demonstratePhase4() {
    UI.showYesNoQuestion(
        '👁️ O marcador do Olho de Sauron está em uma posição especial?',
        () => {
            UI.showActionWithConfirmation(
                'Execute os efeitos do Olho de Sauron conforme as regras.',
                () => completePhase()
            );
        },
        () => {
            completePhase();
        }
    );
}

/**
 * Demonstração da Fase 5
 */
function demonstratePhase5() {
    UI.showYesNoQuestion(
        '🏆 Algum jogador venceu o jogo?',
        () => {
            UI.showMultipleChoice(
                'Quem venceu?',
                [
                    { text: '🌟 Povos Livres (jogador)', value: 'fp' },
                    { text: '👁️ Sombra (Queller Bot)', value: 'shadow' }
                ],
                (winner) => {
                    if (winner === 'shadow') {
                        UI.showMessage(
                            '🎉 <strong>Vitória das Sombras!</strong><br>' +
                            'O Queller Bot venceu a partida!<br><br>' +
                            'Parabéns por completar o jogo! Recarregue a página para jogar novamente.',
                            'success'
                        );
                    } else {
                        UI.showMessage(
                            '🎉 <strong>Vitória dos Povos Livres!</strong><br>' +
                            'Você venceu contra o Queller Bot!<br><br>' +
                            'Parabéns! Recarregue a página para jogar novamente.',
                            'success'
                        );
                    }
                    UI.clearInteractionPanel();
                }
            );
        },
        () => {
            UI.showMessage(
                '✅ <strong>Rodada completa!</strong><br>' +
                'Ninguém venceu ainda. Inicie uma nova rodada!',
                'success'
            );
            
            setTimeout(() => {
                UI.showActionWithConfirmation(
                    '🔄 Prepare o tabuleiro para a próxima rodada e clique em Concluído.',
                    () => {
                        gameState.currentPhase = 0;
                        startPhase(1);
                    }
                );
            }, 3000);
        }
    );
}

/**
 * Completa a fase atual e avança
 */
function completePhase() {
    gameState.saveState();
    gameState.completePhase();
    UI.updateAll();
    
    UI.showMessage(
        `✅ <strong>Fase ${gameState.currentPhase} completa!</strong>`,
        'success'
    );
    
    setTimeout(() => {
        if (gameState.currentPhase < 5) {
            startPhase(gameState.currentPhase + 1);
        } else {
            // Rodada completa
            UI.showMessage(
                '🎊 <strong>Todas as fases completas!</strong><br>' +
                'Rodada finalizada!',
                'success'
            );
        }
    }, 3000);
}

// Exporta funções globais
if (typeof window !== 'undefined') {
    window.startGame = startGame;
    window.startPhase = startPhase;
}
