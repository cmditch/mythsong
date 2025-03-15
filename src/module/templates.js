/**
 * Define a set of template paths to preload
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
    // Define template paths to load
    const templatePaths = [
        // Actor sheet partials
        "systems/tabletop/templates/parts/actor-stats.html",
        "systems/tabletop/templates/parts/actor-inventory.html",
        "systems/tabletop/templates/parts/actor-abilities.html",
        "systems/tabletop/templates/parts/actor-spells.html",
        "systems/tabletop/templates/parts/actor-biography.html",

        // Item sheet partials
        "systems/tabletop/templates/parts/item-description.html",
        "systems/tabletop/templates/parts/item-weapon-details.html",
        "systems/tabletop/templates/parts/item-armor-details.html",
        "systems/tabletop/templates/parts/item-spell-details.html",
        "systems/tabletop/templates/parts/item-ability-details.html",

        // Chat message partials
        "systems/tabletop/templates/chat/item-card.html",
        "systems/tabletop/templates/chat/weapon-card.html",
        "systems/tabletop/templates/chat/spell-card.html",
        "systems/tabletop/templates/chat/ability-card.html"
    ];

    // Load those templates
    return loadTemplates(templatePaths);
};
