/**
 * Extend the base Item document for our tabletop RPG system.
 * @extends {Item}
 */
export class TabletopItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
        // As with the actor class, items are documents that can have their data
        // preparation methods overridden (such as prepareBaseData()).
        super.prepareData();
    }

    /**
     * Prepare a data object which defines the data schema of the Item type
     */
    prepareBaseData() {
        // Get the Item's data
        const itemData = this.system;
        const data = itemData;

        // Weapon-specific preparations
        if (this.type === 'weapon') {
            // Ensure weapon has properties array
            if (!data.weaponProperties) {
                data.weaponProperties = [];
            }

            // Ensure damage has default values
            if (!data.damage) {
                data.damage = {
                    formula: "1d6",
                    type: "slashing"
                };
            }

            // Ensure range has default values
            if (!data.range) {
                data.range = {
                    value: 5,
                    max: 5,
                    units: "ft"
                };
            }

            // Ensure attackBonus has default values
            if (!data.attackBonus) {
                data.attackBonus = {
                    formula: "@attributes.str.mod",
                    type: "melee",
                    attribute: "str"
                };
            }

            // Set attack type based on range
            if (data.range.max > 5) {
                data.attackBonus.type = "ranged";
                data.attackBonus.attribute = "dex";
                data.attackBonus.formula = "@attributes.dex.mod";
            } else {
                data.attackBonus.type = "melee";
                data.attackBonus.attribute = "str";
                data.attackBonus.formula = "@attributes.str.mod";
            }
        }

        // Armor-specific preparations
        if (this.type === 'armor') {
            // Ensure armorType has a default value
            if (!data.armorType) {
                data.armorType = "light";
            }

            // Ensure armorBonus has a default value
            if (data.armorBonus === undefined) {
                data.armorBonus = 1;
            }

            // Set dexterity limit based on armor type
            if (data.armorType === "light") {
                data.dexLimit = null; // No limit
            } else if (data.armorType === "medium") {
                data.dexLimit = 2;
            } else if (data.armorType === "heavy") {
                data.dexLimit = 0;
            }
        }

        // Spell-specific preparations
        if (this.type === 'spell') {
            // Ensure level has a default value
            if (data.level === undefined) {
                data.level = 1;
            }

            // Ensure range has default values
            if (!data.range) {
                data.range = {
                    value: 30,
                    units: "ft"
                };
            }

            // Ensure components has default values
            if (!data.components) {
                data.components = {
                    verbal: false,
                    somatic: false,
                    material: false,
                    materialDescription: ""
                };
            }

            // Ensure wpCost has a default value
            if (data.wpCost === undefined) {
                data.wpCost = 1;
            }
        }

        // Ability-specific preparations
        if (this.type === 'ability') {
            // Ensure wpCost has a default value
            if (data.wpCost === undefined) {
                data.wpCost = 1;
            }
        }
    }

    /**
     * Prepare derived data for the Item
     */
    prepareDerivedData() {
        const itemData = this.system;

        // Nothing to derive yet
    }

    /**
     * Create a chat card for Items. This is used mainly by weapons, spells, and
     * abilities to display what happens when the item is used.
     * @returns {Object} Chat data
     */
    async getChatData(htmlOptions = {}) {
        const data = this.system;

        // Initialize chat data
        const chatData = {
            item: this,
            description: await TextEditor.enrichHTML(data.description, htmlOptions)
        };

        // Add weapon-specific data
        if (this.type === 'weapon') {
            chatData.formula = data.damage.formula;
            chatData.damageType = data.damage.type;
            chatData.range = data.range;
            chatData.attackBonus = data.attackBonus;
        }

        // Add spell-specific data
        if (this.type === 'spell') {
            chatData.level = data.level;
            chatData.school = data.school;
            chatData.range = data.range;
            chatData.duration = data.duration;
            chatData.castingTime = data.castingTime;
            chatData.components = data.components;
            chatData.save = data.save;
            chatData.damage = data.damage;
            chatData.wpCost = data.wpCost;
        }

        // Add ability-specific data
        if (this.type === 'ability') {
            chatData.abilityType = data.abilityType;
            chatData.source = data.source;
            chatData.wpCost = data.wpCost;
        }

        return chatData;
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll({ configureDialog = true } = {}) {
        // Basic template rendering data
        const token = this.actor.token;
        const templateData = {
            actor: this.actor,
            tokenId: token ? token.id : null,
            item: this
        };

        // Define template based on item type
        let template = `systems/tabletop/templates/chat/item-card.html`;

        // Render the chat card template
        const html = await renderTemplate(template, templateData);

        // Create the chat message
        const chatData = {
            user: game.user.id,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
            content: html,
            speaker: ChatMessage.getSpeaker({ actor: this.actor })
        };

        ChatMessage.create(chatData);

        // Return the chat data for potential further use
        return chatData;
    }
}
