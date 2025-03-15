/**
 * A simple and flexible tabletop RPG system for Foundry VTT
 */

// Import Modules
import { TabletopActorSheet } from "./actor-sheet.js";
import { TabletopActor } from "./actor.js";
import { TABLETOP } from "./config.js";
import { TabletopItemSheet } from "./item-sheet.js";
import { TabletopItem } from "./item.js";
import { preloadHandlebarsTemplates } from "./templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
    console.log("Initializing Tabletop RPG System");

    // Define custom Document classes
    CONFIG.Actor.documentClass = TabletopActor;
    CONFIG.Item.documentClass = TabletopItem;

    // Store configuration data
    CONFIG.TABLETOP = TABLETOP;

    // Define custom Roll formulas
    CONFIG.Combat.initiative = {
        formula: "1d20 + @combat.initiative.value",
        decimals: 2
    };

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("tabletop", TabletopActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("tabletop", TabletopItemSheet, { makeDefault: true });

    // Register system settings
    game.settings.register("tabletop", "macroShorthand", {
        name: "Shortened Macro Syntax",
        hint: "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value.",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    // Register initiative formula setting
    game.settings.register("tabletop", "initiativeFormula", {
        name: "Initiative Formula",
        hint: "Enter a formula for calculating initiative at the start of combat.",
        scope: "world",
        type: String,
        default: "1d20 + @attributes.dex.mod",
        config: true,
        onChange: formula => {
            CONFIG.Combat.initiative.formula = formula;
        }
    });

    // Set the initiative formula from settings
    CONFIG.Combat.initiative.formula = game.settings.get("tabletop", "initiativeFormula");

    // Preload Handlebars templates
    await preloadHandlebarsTemplates();

    // Register Handlebars helpers
    Handlebars.registerHelper('concat', function () {
        let outStr = '';
        for (let arg in arguments) {
            if (typeof arguments[arg] !== 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper('toLowerCase', function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a === b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });
});

/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

// Add additional hooks if necessary
Hooks.on("renderChatMessage", (app, html, data) => {
    // Handle chat card buttons
    html.on('click', '.card-buttons button', ev => {
        ev.preventDefault();

        // Extract card data
        const button = ev.currentTarget;
        const card = button.closest('.chat-card');
        const messageId = card.closest('.message').dataset.messageId;
        const message = game.messages.get(messageId);

        if (button.dataset.action === 'weaponAttack') {
            const actor = game.actors.get(message.speaker.actor);
            const itemId = card.dataset.itemId;
            const item = actor.items.get(itemId);

            // Roll attack
            rollWeaponAttack(actor, item);
        }

        if (button.dataset.action === 'weaponDamage') {
            const actor = game.actors.get(message.speaker.actor);
            const itemId = card.dataset.itemId;
            const item = actor.items.get(itemId);

            // Roll damage
            rollWeaponDamage(actor, item);
        }
    });
});

/* -------------------------------------------- */
/*  Utility Functions                           */
/* -------------------------------------------- */

/**
 * Roll a weapon attack
 * @param {Actor} actor      The actor performing the attack
 * @param {Item} weapon      The weapon item being used
 */
function rollWeaponAttack(actor, weapon) {
    const weaponData = weapon.system;
    const actorData = actor.system;

    // Determine ability modifier
    let mod = weaponData.attackBonus.attribute === "dex"
        ? actorData.attributes.dex.mod
        : actorData.attributes.str.mod;

    // Add bonus from weapon if any
    const bonus = weaponData.attackBonus.value || 0;

    // Build formula and roll attack
    const formula = `1d20 + ${mod} + ${bonus}`;
    let roll = new Roll(formula);
    roll.evaluate({ async: false });

    // Send roll to chat
    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: `${weapon.name} - Attack Roll`
    });
}

/**
 * Roll weapon damage
 * @param {Actor} actor      The actor dealing damage
 * @param {Item} weapon      The weapon item being used
 */
function rollWeaponDamage(actor, weapon) {
    const weaponData = weapon.system;
    const actorData = actor.system;

    // Determine ability modifier for damage
    let mod = weaponData.attackBonus.attribute === "dex"
        ? actorData.attributes.dex.mod
        : actorData.attributes.str.mod;

    // Build formula and roll damage
    const damageFormula = `${weaponData.damage.formula} + ${mod}`;
    let roll = new Roll(damageFormula);
    roll.evaluate({ async: false });

    // Send roll to chat
    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: `${weapon.name} - ${weaponData.damage.type.capitalize()} Damage`
    });
}
