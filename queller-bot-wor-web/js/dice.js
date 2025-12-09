/**
 * SISTEMA DE DADOS
 * 
 * Este arquivo define os tipos de dados de ação disponíveis no jogo
 * e funções para trabalhar com eles.
 * 
 * Baseado em: Queller/src/dice_and_strategy.jl
 */

const Dice = {
    // Tipos de dados (faces)
    TYPES: {
        EXERCITO: 'E',           // Exército
        RECRUTAR: 'R',           // Recrutar (Muster)
        EXERCITO_RECRUTAR: 'ER', // Exército/Recrutar (dado especial)
        PERSONAGEM: 'P',         // Personagem (Character)
        EVENTO: 'EV',            // Evento (Event)
        OLHO: 'O'                // Olho/Palantír
    },

    // Nomes legíveis para exibição
    NAMES: {
        'E': 'Exército',
        'R': 'Recrutar',
        'ER': 'Exército/Recrutar',
        'P': 'Personagem',
        'EV': 'Evento',
        'O': 'Olho'
    },

    // Emojis para cada tipo de dado (visual)
    ICONS: {
        'E': '⚔️',
        'R': '🏰',
        'ER': '⚔️/🏰',
        'P': '👤',
        'EV': '📜',
        'O': '👁️'
    },

    /**
     * Valida se uma string representa um dado válido
     * @param {string} str - String a validar (ex: "E", "R", "ER")
     * @returns {boolean}
     */
    isValid(str) {
        if (!str) return false;
        const upper = str.toUpperCase().trim();
        return Object.values(this.TYPES).includes(upper);
    },

    /**
     * Converte string para tipo de dado
     * @param {string} str - String do dado (ex: "E", "exercito", "exército")
     * @returns {string|null} - Tipo do dado ou null se inválido
     */
    parse(str) {
        if (!str) return null;
        
        const normalized = str.toUpperCase().trim();
        
        // Se já é um tipo válido, retorna
        if (Object.values(this.TYPES).includes(normalized)) {
            return normalized;
        }

        // Mapeamento de nomes em português para tipos
        const aliases = {
            'EXERCITO': 'E',
            'EXÉRCITO': 'E',
            'ARMY': 'E',
            'A': 'E',
            
            'RECRUTAR': 'R',
            'MUSTER': 'R',
            'M': 'R',
            
            'EXERCITO/RECRUTAR': 'ER',
            'EXÉRCITO/RECRUTAR': 'ER',
            'ARMY/MUSTER': 'ER',
            'AM': 'ER',
            
            'PERSONAGEM': 'P',
            'CHARACTER': 'P',
            'C': 'P',
            
            'EVENTO': 'EV',
            'EVENT': 'EV',
            
            'OLHO': 'O',
            'PALANTIR': 'O',
            'PALANTÍR': 'O',
            'EYE': 'O'
        };

        return aliases[normalized] || null;
    },

    /**
     * Converte array de strings em array de dados
     * @param {string[]} strings - Array de strings
     * @returns {string[]} - Array de tipos de dados válidos
     */
    parseArray(strings) {
        if (!Array.isArray(strings)) return [];
        
        return strings
            .map(s => this.parse(s))
            .filter(d => d !== null);
    },

    /**
     * Converte string com múltiplos dados em array
     * Ex: "E E R P" -> ['E', 'E', 'R', 'P']
     * @param {string} str - String com dados separados por espaço
     * @returns {string[]} - Array de tipos de dados
     */
    parseString(str) {
        if (!str) return [];
        
        const parts = str.trim().split(/\s+/);
        return this.parseArray(parts);
    },

    /**
     * Obtém nome legível de um dado
     * @param {string} type - Tipo do dado
     * @returns {string}
     */
    getName(type) {
        return this.NAMES[type] || type;
    },

    /**
     * Obtém ícone de um dado
     * @param {string} type - Tipo do dado
     * @returns {string}
     */
    getIcon(type) {
        return this.ICONS[type] || '🎲';
    },

    /**
     * Formata um dado para exibição
     * @param {string} type - Tipo do dado
     * @param {boolean} includeIcon - Se deve incluir emoji
     * @returns {string}
     */
    format(type, includeIcon = true) {
        const name = this.getName(type);
        const icon = this.getIcon(type);
        return includeIcon ? `${icon} ${name}` : name;
    },

    /**
     * Formata array de dados para exibição
     * @param {string[]} diceArray - Array de dados
     * @param {boolean} includeIcons - Se deve incluir emojis
     * @returns {string}
     */
    formatArray(diceArray, includeIcons = true) {
        if (!diceArray || diceArray.length === 0) {
            return 'Nenhum dado disponível';
        }

        if (includeIcons) {
            return diceArray.map(d => this.format(d, true)).join(', ');
        } else {
            return diceArray.map(d => this.getName(d)).join(', ');
        }
    },

    /**
     * Conta quantos dados de cada tipo existem
     * @param {string[]} diceArray - Array de dados
     * @returns {Object} - Objeto com contagem {type: count}
     */
    count(diceArray) {
        const counts = {};
        
        for (const type of Object.values(this.TYPES)) {
            counts[type] = 0;
        }
        
        for (const die of diceArray) {
            if (counts[die] !== undefined) {
                counts[die]++;
            }
        }
        
        return counts;
    },

    /**
     * Verifica se um dado está disponível no array
     * @param {string} type - Tipo do dado procurado
     * @param {string[]} diceArray - Array de dados disponíveis
     * @returns {boolean}
     */
    hasType(type, diceArray) {
        return diceArray.includes(type);
    },

    /**
     * Remove um dado do array (retorna novo array)
     * @param {string} type - Tipo do dado a remover
     * @param {string[]} diceArray - Array de dados
     * @returns {string[]} - Novo array sem o dado
     */
    remove(type, diceArray) {
        const index = diceArray.indexOf(type);
        if (index === -1) return [...diceArray];
        
        const newArray = [...diceArray];
        newArray.splice(index, 1);
        return newArray;
    }
};

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dice;
}
