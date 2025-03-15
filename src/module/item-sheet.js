
/**
 * Extend the basic ItemSheet for our tabletop system
 * @extends {ItemSheet}
 */
export class TabletopItemSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["tabletop", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    get template() {
        const path = "systems/tabletop/templates";
        return `${path}/item-${this.item.type}-sheet.html`;
    }

    /** @override */
    async getData() {
        const context = await super.getData();
        const itemData = context.data;

        // Apply specific data for item types
        context.rollData = {};
        let actor = this.object?.parent ?? null;
        if (actor) {
            context.rollData = actor.getRollData();
        }

        // Add item specific data
        this._prepareItemData(context);

        // Enrich HTML descriptions
        context.descriptionHTML = await TextEditor.enrichHTML(itemData.system.description, { async: true });

        context.system = itemData.system;
        return context;
    }

    /**
     * Prepare specific data for each item type
     * @param {Object} context The context data for the sheet
     * @private
     */
    _prepareItemData(context) {
        // Define constants
        const weaponTypes = [
            "Axe", "Bow", "Blunderbuss", "Dagger", "Fist Weapon", "Heavy Gun", "Katana",
            "Mace", "Pistol", "Polearm", "Rifle", "Shield", "Sniper", "Spear", "Staff",
            "Sword", "Thrown"
        ];

        const damageTypes = [
            "slashing", "piercing", "bludgeoning", "fire", "cold", "lightning",
            "acid", "poison", "necrotic", "radiant", "force", "psychic"
        ];

        const armorTypes = ["light", "medium", "heavy", "shield"];

        const magicSchools = [
            "Light", "Fire", "Arcana", "Dark", "Frost", "Nature",
            "Divine", "Elemental", "Psychic", "Supernatural", "Primal"
        ];

        // Apply specific data based on item type
        const item = context.item;

        // Add lists for drop-down selection
        context.weaponTypes = weaponTypes;
        context.damageTypes = damageTypes;
        context.armorTypes = armorTypes;
        context.magicSchools = magicSchools;

        // Specific properties for weapons
        if (item.type === 'weapon') {
            context.isRanged = (context.system.range.max > 5);

            // Set attack attribute based on weapon type
            if (context.isRanged) {
                context.system.attackBonus.attribute = "dex";
                context.system.attackBonus.formula = "@attributes.dex.mod";
            } else {
                context.system.attackBonus.attribute = "str";
                context.system.attackBonus.formula = "@attributes.str.mod";
            }
        }

        // Specific properties for spells
        if (item.type === 'spell') {
            // Calculate spell DC based on caster's attributes
            if (context.rollData.attributes) {
                const intMod = context.rollData.attributes.int.mod;
                const wisMod = context.rollData.attributes.wis.mod;
                const chaMod = context.rollData.attributes.cha.mod;

                // Use highest of Int, Wis, or Cha for spell DC
                const spellMod = Math.max(intMod, wisMod, chaMod);
                context.system.save.dc = 8 + spellMod;
            }
        }
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
    }

    /** @override */
    _updateObject(event, formData) {
        // Update the Item with the form's data
        return this.object.update(formData);
    }
}
