/**
 * Helper functions for the Tabletop RPG system
 */

export class EntitySheetHelper {
    /**
     * Handles parsing and organizing attribute data for actors and items
     * @param {Object} data Data from the actor or item sheet
     * @returns {Object} Processed data ready for the sheet
     */
    static getAttributeData(data) {
        // Process the attributes and add useful computed properties
        for (const [key, attribute] of Object.entries(data.system.attributes || {})) {
            // Calculate the modifier for each attribute
            attribute.mod = Math.floor((attribute.value - 10) / 2);

            // Add properties for display
            attribute.label = attribute.label || CONFIG.TABLETOP.attributes[key] || key.capitalize();
        }

        return data;
    }

    /**
     * Handle clicking on an attribute control (for custom sections)
     * @param {Event} event The originating click event
     * @private
     */
    static onClickAttributeControl(event) {
        event.preventDefault();
        const a = event.currentTarget;
        const action = a.dataset.action;
        const section = a.closest(".attributes") || a.closest(".inventory") || a.closest(".abilities");
        const sectionType = section.dataset.type;

        // Different actions
        switch (action) {
            case "create":
                this._onCreateAttribute(event, section, sectionType);
                break;
            case "delete":
                this._onDeleteAttribute(event, section, sectionType);
                break;
            case "edit":
                this._onEditAttribute(event, section, sectionType);
                break;
        }
    }

    /**
     * Handles creating a new attribute
     * @param {Event} event The originating click event
     * @param {HTMLElement} section The section containing the attributes
     * @param {String} sectionType The type of section (attributes, inventory, etc.)
     * @private
     */
    static _onCreateAttribute(event, section, sectionType) {
        // Implementation depends on your specific attributes structure
        // For simple attributes, you could generate a dialog with a form
        switch (sectionType) {
            case "attribute":
                // Handle attribute creation
                break;
            case "custom":
                // Handle custom attribute creation
                break;
        }
    }

    /**
     * Handles deleting an attribute
     * @param {Event} event The originating click event
     * @param {HTMLElement} section The section containing the attributes
     * @param {String} sectionType The type of section (attributes, inventory, etc.)
     * @private
     */
    static _onDeleteAttribute(event, section, sectionType) {
        const li = event.currentTarget.closest(".attribute");
        if (li) {
            li.remove();
        }
    }

    /**
     * Handles editing an attribute
     * @param {Event} event The originating click event
     * @param {HTMLElement} section The section containing the attributes
     * @param {String} sectionType The type of section (attributes, inventory, etc.)
     * @private
     */
    static _onEditAttribute(event, section, sectionType) {
        const li = event.currentTarget.closest(".attribute");
        // Implementation depends on your specific attributes structure
    }

    /**
     * Listen for roll buttons on attributes
     * @param {Event} event The originating click event
     */
    static onAttributeRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        const actorId = this.actor.id;

        // Create roll data
        let rollData = this.actor.getRollData();

        // Handle different roll types
        let label = dataset.label ? dataset.label : '';
        let roll = new Roll(dataset.roll, rollData);

        // Send the roll to chat
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
            rollMode: game.settings.get('core', 'rollMode')
        });
    }

    /**
     * Handles updating actor data when the form is submitted
     * @param {Object} formData The form data object
     * @param {Object} document The actor or item document
     * @returns {Object} Updated form data
     */
    static updateAttributes(formData, document) {
        // For systems with custom attributes, process them here
        return formData;
    }

    /**
     * Helper method to ensure resource values are properly constrained
     * @param {Object} resources The resources object (hp, wp, etc.)
     */
    static clampResourceValues(resources) {
        for (const [key, resource] of Object.entries(resources)) {
            if (resource.value === undefined) continue;

            // Ensure value is between min and max
            resource.value = Math.clamped(
                resource.value,
                resource.min || 0,
                resource.max || 0
            );
        }
    }

    /**
     * Creates chat message with roll data
     * @param {Object} rollData The roll data to include
     * @param {Object} speaker The speaker data
     * @param {String} flavor Text to include in the message
     * @returns {Promise} A promise that resolves when the chat message is created
     */
    static async createChatMessage(rollData, speaker, flavor) {
        const chatData = {
            user: game.user.id,
            speaker,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            content: rollData.roll.total,
            roll: rollData.roll,
            sound: CONFIG.sounds.dice,
            flavor: flavor
        };

        return ChatMessage.create(chatData);
    }

    /**
     * Helper to format a number with sign
     * @param {Number} value The number to format
     * @returns {String} The formatted number with sign
     */
    static formatModifier(value) {
        if (value >= 0) {
            return `+${value}`;
        }
        return `${value}`;
    }

    /**
     * Calculate effect values applying modifiers
     * @param {Number} baseValue The base value
     * @param {Array} modifiers Array of modifier objects
     * @returns {Number} The final value after applying modifiers
     */
    static calculateEffectValue(baseValue, modifiers) {
        let total = baseValue;

        // Apply flat modifiers
        let flatMods = modifiers.filter(m => m.type === 'flat').reduce((sum, mod) => sum + mod.value, 0);
        total += flatMods;

        // Apply percentage modifiers
        let percentMods = modifiers.filter(m => m.type === 'percent');
        for (let mod of percentMods) {
            total = total * (1 + (mod.value / 100));
        }

        return Math.round(total);
    }

    /**
     * Verify a formula is well-formed
     * @param {String} formula The formula to check
     * @returns {Boolean} Whether the formula is valid
     */
    static validateFormula(formula) {
        try {
            new Roll(formula).evaluate({ async: false });
            return true;
        } catch (e) {
            return false;
        }
    }
}
