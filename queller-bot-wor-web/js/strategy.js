/**
 * SISTEMA DE ESTRATÉGIAS
 * 
 * Define as estratégias que o Queller Bot pode adotar durante o jogo:
 * - Militar: Foco em conquista militar
 * - Corrupção: Foco em corromper os Povos Livres
 * 
 * Baseado em: Queller/src/dice_and_strategy.jl (Strategy module)
 */

const Strategy = {
    // Tipos de estratégia
    TYPES: {
        MILITAR: 'MILITAR',
        CORRUPCAO: 'CORRUPCAO'
    },

    // Nomes para exibição
    NAMES: {
        'MILITAR': 'Militar',
        'CORRUPCAO': 'Corrupção'
    },

    // Descrições das estratégias
    DESCRIPTIONS: {
        'MILITAR': 'Foco em conquista territorial e combate',
        'CORRUPCAO': 'Foco em corromper a Sociedade do Anel'
    },

    // Emojis para cada estratégia
    ICONS: {
        'MILITAR': '⚔️',
        'CORRUPCAO': '🔥'
    },

    /**
     * Valida se uma string é uma estratégia válida
     * @param {string} str - String a validar
     * @returns {boolean}
     */
    isValid(str) {
        if (!str) return false;
        const upper = str.toUpperCase().trim();
        return Object.values(this.TYPES).includes(upper);
    },

    /**
     * Converte string para tipo de estratégia
     * @param {string} str - String da estratégia
     * @returns {string|null} - Tipo da estratégia ou null se inválido
     */
    parse(str) {
        if (!str) return null;
        
        const normalized = str.toUpperCase().trim();
        
        // Se já é um tipo válido, retorna
        if (Object.values(this.TYPES).includes(normalized)) {
            return normalized;
        }

        // Mapeamento de aliases
        const aliases = {
            'MILITAR': 'MILITAR',
            'MILITARY': 'MILITAR',
            'M': 'MILITAR',
            
            'CORRUPCAO': 'CORRUPCAO',
            'CORRUPÇÃO': 'CORRUPCAO',
            'CORRUPTION': 'CORRUPCAO',
            'C': 'CORRUPCAO'
        };

        return aliases[normalized] || null;
    },

    /**
     * Escolhe uma estratégia aleatória
     * @returns {string} - Uma estratégia aleatória
     */
    random() {
        const strategies = Object.values(this.TYPES);
        const index = Math.floor(Math.random() * strategies.length);
        return strategies[index];
    },

    /**
     * Obtém nome legível de uma estratégia
     * @param {string} type - Tipo da estratégia
     * @returns {string}
     */
    getName(type) {
        return this.NAMES[type] || type;
    },

    /**
     * Obtém descrição de uma estratégia
     * @param {string} type - Tipo da estratégia
     * @returns {string}
     */
    getDescription(type) {
        return this.DESCRIPTIONS[type] || '';
    },

    /**
     * Obtém ícone de uma estratégia
     * @param {string} type - Tipo da estratégia
     * @returns {string}
     */
    getIcon(type) {
        return this.ICONS[type] || '🎯';
    },

    /**
     * Formata uma estratégia para exibição
     * @param {string} type - Tipo da estratégia
     * @param {boolean} includeIcon - Se deve incluir emoji
     * @param {boolean} includeDescription - Se deve incluir descrição
     * @returns {string}
     */
    format(type, includeIcon = true, includeDescription = false) {
        const name = this.getName(type);
        const icon = this.getIcon(type);
        
        let result = includeIcon ? `${icon} ${name}` : name;
        
        if (includeDescription) {
            const desc = this.getDescription(type);
            result += ` - ${desc}`;
        }
        
        return result;
    },

    /**
     * Retorna todas as estratégias disponíveis
     * @returns {string[]}
     */
    getAll() {
        return Object.values(this.TYPES);
    },

    /**
     * Verifica qual estratégia é oposta à fornecida
     * @param {string} type - Estratégia atual
     * @returns {string}
     */
    getOpposite(type) {
        if (type === this.TYPES.MILITAR) {
            return this.TYPES.CORRUPCAO;
        }
        return this.TYPES.MILITAR;
    }
};

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Strategy;
}
