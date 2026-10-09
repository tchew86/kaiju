// KAIJU - Array Utilities
// Shared array manipulation functions

const ArrayUtils = {
    /**
     * Fisher-Yates shuffle algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} New shuffled array (does not modify original)
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    /**
     * Get random element from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random element from array
     */
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Get random elements from array (without duplicates)
     * @param {Array} array - Array to pick from
     * @param {number} count - Number of elements to pick
     * @returns {Array} Array of random elements
     */
    randomElements(array, count) {
        const shuffled = this.shuffle(array);
        return shuffled.slice(0, Math.min(count, array.length));
    },

    /**
     * Group array elements by a key function
     * @param {Array} array - Array to group
     * @param {Function} keyFn - Function to extract grouping key
     * @returns {Object} Object with keys as groups
     */
    groupBy(array, keyFn) {
        return array.reduce((groups, item) => {
            const key = keyFn(item);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.ArrayUtils = ArrayUtils;
}
