/**
 * Extend the base Actor document for our tabletop RPG system.
 * @extends {Actor}
 */
export class TabletopActor extends Actor {

    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        // Prepare data for the actor. Calling the super version of this executes
        // the following, in order: prepareBaseData(), prepareEmbeddedDocuments(),
        // prepareDerivedData().
        super.prepareData();
    }

    /**
     * Prepare base actor data that doesn't depend on embedded documents
     */
    prepareBaseData() {
        // Get the actor data
        const actorData = this.system;
        const data = actorData;

        // Initialize attributes if they don't exist
        if (!data.attributes) {
            data.attributes = {
                str: { value: 10 },
                dex: { value: 10 },
                con: { value: 10 },
                int: { value: 10 },
                wis: { value: 10 },
                cha: { value: 10 }
            };
        }

        // Initialize resources if they don't exist
        if (!data.resources) {
            data.resources = {
                hp: { value: 10, max: 10, min: 0 },
                wp: { value: 5, max: 5, min: 0 }
            };
        }

        // Initialize combat stats if they don't exist
        if (!data.combat) {
            data.combat = {
                initiative: { value: 0 },
                ac: { value: 10 },
                speed: { value: 30 }
            };
        }

        // Initialize character level if it doesn't exist
        if (!data.level) {
            data.level = { value: 1 };
        }
    }

    /**
     * Prepare derived data based on other actor data
     */
    prepareDerivedData() {
        const actorData = this.system;

        // Calculate ability score modifiers
        for (let [key, attribute] of Object.entries(actorData.attributes)) {
            attribute.mod = Math.floor((attribute.value - 10) / 2);
        }

        // Calculate max HP
        // Formula from glossary: HP = 2*Con + Con*Lvl
        const level = actorData.level?.value || 1;
        const conMod = actorData.attributes.con.mod;
        const conValue = actorData.attributes.con.value;
        actorData.resources.hp.max = 2 * conValue + conMod * level;

        // Calculate max WP (Willpower)
        // Formula from glossary: WP = Int + Int*lvl
        const intValue = actorData.attributes.int.value;
        const intMod = actorData.attributes.int.mod;
        actorData.resources.wp.max = intValue + intMod * level;

        // Calculate AC (Armor Class)
        // Base AC 10 + Dex modifier + armor bonus
        let armorBonus = 0;
        let maxDexMod = null;

        // Find equipped armor
        const equippedArmor = this.items.find(i => {
            return i.type === "armor" && i.system.equipped;
        });

        if (equippedArmor) {
            armorBonus = equippedArmor.system.armorBonus || 0;
            maxDexMod = equippedArmor.system.dexLimit;
        }

        // Find equipped shield
        const equippedShield = this.items.find(i => {
            return i.type === "armor" && i.system.equipped &&
                i.system.armorType === "shield";
        });

        if (equippedShield) {
            armorBonus += equippedShield.system.armorBonus || 0;
        }

        // Calculate final AC
        let dexMod = actorData.attributes.dex.mod;
        if (maxDexMod !== null && dexMod > maxDexMod) {
            dexMod = maxDexMod;
        }

        actorData.combat.ac.value = 10 + dexMod + armorBonus;

        // Calculate initiative
        actorData.combat.initiative.value = actorData.attributes.dex.mod;

        // Calculate saves
        if (!actorData.saves) {
            actorData.saves = {};
        }

        // Dodge (Dex save) = 8 + Dex mod
        actorData.saves.dodge = 8 + actorData.attributes.dex.mod;

        // Resistance (Wis save) = 8 + Wis mod
        actorData.saves.resistance = 8 + actorData.attributes.wis.mod;

        // Fortitude (Con save) = 8 + Con mod
        actorData.saves.fortitude = 8 + actorData.attributes.con.mod;
    }

    /**
     * Override getRollData() to include more data for use in rolls.
     */
    getRollData() {
        const data = super.getRollData();

        // Copy the ability scores to the top level for easier access
        if (data.attributes) {
            for (let [k, v] of Object.entries(data.attributes)) {
                data[k] = v.value;
                data[`${k}_mod`] = v.mod;
            }
        }

        // Add level for easier access
        if (data.level) {
            data.lvl = data.level.value;
        }

        return data;
    }
}
