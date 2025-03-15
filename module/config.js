/**
 * System configuration settings
 */

// Define constants here
export const TABLETOP = {};

// Attribute Types
TABLETOP.attributes = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma"
};

// Damage Types
TABLETOP.damageTypes = {
    slashing: "Slashing",
    piercing: "Piercing",
    bludgeoning: "Bludgeoning",
    fire: "Fire",
    cold: "Cold",
    lightning: "Lightning",
    acid: "Acid",
    poison: "Poison",
    necrotic: "Necrotic",
    radiant: "Radiant",
    force: "Force",
    psychic: "Psychic"
};

// Weapon Types
TABLETOP.weaponTypes = {
    axe: "Axe",
    bow: "Bow",
    blunderbuss: "Blunderbuss",
    dagger: "Dagger",
    fist: "Fist Weapon",
    heavyGun: "Heavy Gun",
    katana: "Katana",
    mace: "Mace",
    pistol: "Pistol",
    polearm: "Polearm",
    rifle: "Rifle",
    shield: "Shield",
    sniper: "Sniper",
    spear: "Spear",
    staff: "Staff",
    sword: "Sword",
    thrown: "Thrown"
};

// Weapon Subtypes from CSV data
TABLETOP.weaponSubtypes = {
    axe: {
        battleaxe: "Battleaxe",
        greataxe: "Greataxe",
        handaxe: "Axe",
        pick: "Pick/Kama"
    },
    bow: {
        shortbow: "Short Bow",
        longbow: "Long Bow"
    },
    dagger: {
        dagger: "Dagger",
        maingauche: "Main Gauche/Sai"
    },
    fist: {
        knuckles: "Unarmed/Knuckles",
        claws: "Claws",
        katars: "Katars",
        gauntlets: "Heavy Gauntlets"
    },
    heavyGun: {
        heavygun: "Heavy Gun"
    },
    katana: {
        katana: "Katana"
    },
    mace: {
        mace: "Mace",
        morningstar: "Morning Star",
        maul: "Maul",
        hammer: "Hammer",
        battlehammer: "Battlehammer",
        flail: "Flail",
        chain: "Chain Weapon/Whip"
    },
    pistol: {
        pistol: "Pistol",
        handcannon: "Hand Cannon"
    },
    polearm: {
        halberd: "Halberd",
        glaive: "Glaive",
        scythe: "Scythe"
    },
    rifle: {
        rifle: "Rifle"
    },
    shield: {
        shield: "Shield"
    },
    sniper: {
        sniper: "Sniper",
        crossbow: "Crossbow"
    },
    spear: {
        spear: "Spear",
        lance: "Lance/Pike",
        javelin: "Javelin/Trident"
    },
    staff: {
        staff: "Staff/Quarterstaff"
    },
    sword: {
        greatsword: "Greatsword",
        longsword: "Longsword",
        shortsword: "Shortsword",
        scimitar: "Scimitar",
        rapier: "Rapier"
    },
    thrown: {
        thrown: "Thrown"
    }
};

// Weapon Properties
TABLETOP.weaponProperties = {
    block: "Block",
    finesse: "Finesse",
    heavy: "Heavy",
    light: "Light",
    loading: "Loading",
    reach: "Reach",
    twoHanded: "Two-Handed",
    versatile: "Versatile",
    thrown: "Thrown",
    ammunition: "Ammunition",
    stance: "Stance",
    guarding: "Guarding",
    swift: "Swift",
    piercing: "Piercing",
    slashing: "Slashing",
    impact: "Impact",
    sweeping: "Sweeping"
};

// Armor Types
TABLETOP.armorTypes = {
    light: "Light Armor",
    medium: "Medium Armor",
    heavy: "Heavy Armor",
    shield: "Shield"
};

// Magic Schools
TABLETOP.magicSchools = {
    light: "Light",
    fire: "Fire",
    arcana: "Arcana",
    dark: "Dark",
    frost: "Frost",
    nature: "Nature",
    divine: "Divine",
    elemental: "Elemental",
    psychic: "Psychic",
    supernatural: "Supernatural",
    primal: "Primal"
};

// Magic Sources
TABLETOP.magicSources = {
    divine: "Divine",
    elemental: "Elemental",
    arcana: "Arcana",
    psychic: "Psychic",
    supernatural: "Supernatural",
    primal: "Primal",
    martial: "Martial"
};

// Materials System from CSV Data
TABLETOP.materials = {
    // Metals
    metals: {
        silver: "Silver Ore",
        truesilver: "Truesilver",
        gold: "Gold Ore",
        puregold: "Puregold",
        iron: "Iron Ore",
        mythril: "Mythril",
        starmetal: "Starmetal",
        veilcobalt: "Veil Cobalt/Titanium",
        tin: "Tin Ore",
        copper: "Copper Ore",
        petricite: "Petricite"
    },
    // Stones
    stones: {
        marble: "Marble",
        obsidian: "Obsidian",
        quartz: "Quartz",
        basalt: "Basalt",
        permafrost: "Permafrost",
        limestone: "Limestone"
    },
    // Gems
    gems: {
        topaz: "Topaz",
        amber: "Amber",
        ruby: "Ruby",
        amethyst: "Amethyst",
        sapphire: "Sapphire",
        emerald: "Emerald"
    },
    // Woods
    woods: {
        oak: "Oak",
        paleoak: "Pale Oak",
        palm: "Palm",
        sunpalm: "Sunpalm",
        bamboo: "Bamboo",
        leyleaf: "Leyleaf",
        ebony: "Ebony",
        ebonbough: "Ebonbough",
        pine: "Pine",
        soulpine: "Soulpine",
        teak: "Teak",
        heartwood: "Heartwood"
    },
    // Animal Materials
    animal: {
        feathers: "Feathers",
        scales: "Scales",
        flamescale: "Flamescale",
        chitin: "Chitin",
        starshell: "Starshell",
        bone: "Bone",
        umbralivoryvory: "Umbral Ivory",
        fur: "Fur",
        frosthide: "Frosthide",
        leather: "Leather",
        direleather: "Dire Leather"
    },
    // Fabrics
    fabrics: {
        cotton: "Cotton",
        linen: "Linen",
        silk: "Silk",
        runesilk: "Runesilk",
        samite: "Blessed Samite",
        suncloth: "Suncloth",
        lacebark: "Lacebark",
        darklace: "Darklace",
        wool: "Wool",
        tundrawool: "Tundrawool",
        hemp: "Hemp",
        vineweave: "Vineweave"
    },
    // Magical Essences
    essences: {
        divine: "Divine Essence",
        elemental: "Elemental Essence",
        arcane: "Arcane Essence",
        psychic: "Psychic Essence",
        veil: "Veil Essence",
        primal: "Primal Essence"
    }
};

// Creature/Monster Types from CSV
TABLETOP.creatureTypes = {
    fallenAngel: "Fallen Angel",
    wyrm: "Wyrm",
    chimera: "Chimera",
    beholder: "Beholder",
    leviathan: "Leviathan",
    behemoth: "Behemoth"
};

// Character Classes from CSV
TABLETOP.classes = {
    // Core Classes
    oracle: "Oracle",
    monk: "Monk",
    shaman: "Shaman",
    wizard: "Wizard",
    warlock: "Warlock",
    spellbreaker: "Spellbreaker",
    warden: "Warden",
    ninja: "Ninja",

    // Specialization Classes
    armsWarrior: "Arms Warrior",
    protWarrior: "Protection Warrior",
    demolitionist: "Demolitionist",
    dragoon: "Dragoon",
    shaolin: "Shaolin",
    reaper: "Reaper",
    rogue: "Rogue",
    ranger: "Ranger",
    gunner: "Gunner",
    soldier: "Soldier",
    gunslinger: "Gunslinger",

    // Magic Specializations
    spiritualist: "Spiritualist",
    arcanist: "Arcanist",
    occultist: "Occultist",
    sorcerer: "Sorcerer",
    necromancer: "Necromancer",
    bloodKnight: "Blood Knight",
    elementalist: "Elementalist"
};

// Character Ancestries/Races from CSV
TABLETOP.ancestries = {
    human: "Human",
    orc: "Orc",
    elf: "Elf",
    dwarf: "Dwarf",
    jotnyr: "Jotnyr",
    vanaqi: "Vanaqi",
    goblin: "Goblin",
    troll: "Troll",
    dire: "Dire"
};

// Ability Types
TABLETOP.abilityTypes = {
    active: "Active",
    passive: "Passive",
    reaction: "Reaction"
};
