
/**
 * Extend the basic ActorSheet for our custom tabletop system
 * @extends {ActorSheet}
 */
export class TabletopActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["tabletop", "sheet", "actor"],
            template: "systems/tabletop/templates/actor-sheet.html",
            width: 600,
            height: 680,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }],
            scrollY: [".stats", ".inventory", ".abilities", ".magic", ".biography"],
            dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
        });
    }

    /** @override */
    async getData() {
        const context = await super.getData();
        const actorData = context.data;

        // Add character data
        this._prepareItems(actorData);
        this._prepareCharacterData(actorData);

        // Add roll data for TinyMCE editors
        context.rollData = context.actor.getRollData();
        context.system = actorData.system;

        return context;
    }

    /**
     * Organize and classify Items for Character sheets
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterData(actorData) {
        // Calculate ability modifiers
        const attributes = actorData.system.attributes;
        for (let [key, attribute] of Object.entries(attributes)) {
            attribute.mod = Math.floor((attribute.value - 10) / 2);
        }

        // Calculate derived stats
        const system = actorData.system;

        // HP = 2*Con + Con*level
        const level = system.level?.value || 1;
        const conMod = attributes.con.mod;
        system.resources.hp.max = 2 * attributes.con.value + conMod * level;

        // WP = Int + Int*level
        system.resources.wp.max = attributes.int.value + attributes.int.mod * level;

        // Combat stats
        system.combat.ac.value = 10 + attributes.dex.mod + (this.actor.getFlag("tabletop", "armorBonus") || 0);
        system.combat.initiative.value = attributes.dex.mod;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareItems(actorData) {
        const inventory = {
            weapons: [],
            armor: [],
            gear: []
        };

        const abilities = {
            abilities: [],
            spells: []
        };

        // Iterate through items, allocating to containers
        for (let i of actorData.items) {
            let item = i.system;
            // Append to inventory or abilities
            if (i.type === 'weapon') {
                inventory.weapons.push(i);
            }
            else if (i.type === 'armor') {
                inventory.armor.push(i);
            }
            else if (i.type === 'gear') {
                inventory.gear.push(i);
            }
            else if (i.type === 'ability') {
                abilities.abilities.push(i);
            }
            else if (i.type === 'spell') {
                abilities.spells.push(i);
            }
        }

        // Assign to character data
        actorData.inventory = inventory;
        actorData.abilities = abilities;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        html.find('.item-create').click(this._onItemCreate.bind(this));

        // Item controls (edit/delete)
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
            li.slideUp(200, () => this.render(false));
        });

        // Item equip/unequip
        html.find('.item-equip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.update({ "system.equipped": !item.system.equipped });
        });

        // Roll handlers
        html.find('.rollable').click(this._onRoll.bind(this));

        // Drag events for macros
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);

        const name = `New ${type.capitalize()}`;

        const itemData = {
            name: name,
            type: type,
            system: data
        };

        delete itemData.system.type;
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;

        if (dataset.roll) {
            let roll = new Roll(dataset.roll, this.actor.getRollData());
            let label = dataset.label ? `Rolling ${dataset.label}` : '';

            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: label
            });
        }
    }
}
