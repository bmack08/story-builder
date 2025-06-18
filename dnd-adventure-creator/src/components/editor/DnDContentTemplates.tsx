import React from 'react'

export interface DnDTemplate {
  id: string
  name: string
  description: string
  category: 'monster' | 'npc' | 'item' | 'encounter' | 'trap' | 'location' | 'shop' | 'quest'
  template: string
}

export const DND_TEMPLATES: DnDTemplate[] = [
  // Monster Templates
  {
    id: 'monster-basic',
    name: 'Basic Monster',
    description: 'Standard monster stat block following D&D 5e format',
    category: 'monster',
    template: `
<div class="dnd-monster-block">
<h3>Monster Name</h3>
<p><em>Size type, alignment</em></p>
<hr>
<p><strong>Armor Class</strong> 12 (Natural Armor)<br>
<strong>Hit Points</strong> 26 (4d8 + 8)<br>
<strong>Speed</strong> 30 ft.</p>
<table class="ability-scores">
<tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr>
<tr><td>14 (+2)</td><td>12 (+1)</td><td>15 (+2)</td><td>8 (-1)</td><td>13 (+1)</td><td>10 (+0)</td></tr>
</table>
<p><strong>Saving Throws</strong> Con +4<br>
<strong>Skills</strong> Perception +3<br>
<strong>Damage Resistances</strong> Cold<br>
<strong>Senses</strong> Darkvision 60 ft., passive Perception 13<br>
<strong>Languages</strong> Common<br>
<strong>Challenge</strong> 1 (200 XP) <strong>Proficiency Bonus</strong> +2</p>
<hr>
<h4>Actions</h4>
<p><strong>Multiattack.</strong> The monster makes two attacks.</p>
<p><strong>Melee Attack.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 6 (1d8 + 2) slashing damage.</p>
</div>`
  },
  {
    id: 'monster-spellcaster',
    name: 'Spellcaster Monster',
    description: 'Monster with spellcasting abilities',
    category: 'monster',
    template: `
<div class="dnd-monster-block">
<h3>Spellcaster Name</h3>
<p><em>Medium humanoid (any race), any alignment</em></p>
<hr>
<p><strong>Armor Class</strong> 12 (15 with Mage Armor)<br>
<strong>Hit Points</strong> 40 (9d8)<br>
<strong>Speed</strong> 30 ft.</p>
<table class="ability-scores">
<tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr>
<tr><td>9 (-1)</td><td>14 (+2)</td><td>11 (+0)</td><td>17 (+3)</td><td>12 (+1)</td><td>11 (+0)</td></tr>
</table>
<p><strong>Saving Throws</strong> Int +6, Wis +4<br>
<strong>Skills</strong> Arcana +6, History +6<br>
<strong>Senses</strong> passive Perception 11<br>
<strong>Languages</strong> Common plus two others<br>
<strong>Challenge</strong> 6 (2,300 XP) <strong>Proficiency Bonus</strong> +3</p>
<hr>
<p><strong>Spellcasting.</strong> The spellcaster is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The spellcaster has the following wizard spells prepared:</p>
<p><strong>Cantrips (at will):</strong> <em>mage hand</em>, <em>minor illusion</em>, <em>prestidigitation</em>, <em>ray of frost</em><br>
<strong>1st level (4 slots):</strong> <em>detect magic</em>, <em>mage armor</em>, <em>magic missile</em>, <em>shield</em><br>
<strong>2nd level (3 slots):</strong> <em>misty step</em>, <em>suggestion</em><br>
<strong>3rd level (3 slots):</strong> <em>counterspell</em>, <em>fireball</em>, <em>fly</em><br>
<strong>4th level (3 slots):</strong> <em>greater invisibility</em>, <em>ice storm</em><br>
<strong>5th level (1 slot):</strong> <em>cone of cold</em></p>
<hr>
<h4>Actions</h4>
<p><strong>Dagger.</strong> <em>Melee or Ranged Weapon Attack:</em> +5 to hit, reach 5 ft. or range 20/60 ft., one target. <em>Hit:</em> 4 (1d4 + 2) piercing damage.</p>
</div>`
  },

  // NPC Templates
  {
    id: 'npc-basic',
    name: 'Basic NPC',
    description: 'Non-combat NPC with roleplay information',
    category: 'npc',
    template: `
<div class="dnd-npc-block">
<h3>NPC Name</h3>
<p><em>Race, Background/Occupation</em></p>
<hr>
<p><strong>Armor Class</strong> 10<br>
<strong>Hit Points</strong> 4 (1d8)<br>
<strong>Speed</strong> 30 ft.</p>
<table class="ability-scores">
<tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr>
<tr><td>10 (+0)</td><td>10 (+0)</td><td>10 (+0)</td><td>10 (+0)</td><td>10 (+0)</td><td>10 (+0)</td></tr>
</table>
<p><strong>Senses</strong> passive Perception 10<br>
<strong>Languages</strong> Common<br>
<strong>Challenge</strong> 0 (10 XP)</p>
<hr>
<h4>Personality</h4>
<p><strong>Personality Traits:</strong> Describe 1-2 key personality traits that define how this NPC acts.</p>
<p><strong>Ideals:</strong> What drives this character? What do they believe in?</p>
<p><strong>Bonds:</strong> What connections does this NPC have to people, places, or things?</p>
<p><strong>Flaws:</strong> What weakness or vice might cause problems for this NPC?</p>
<hr>
<h4>Appearance & Mannerisms</h4>
<p>Describe the NPC's physical appearance, clothing, and distinctive mannerisms or speech patterns.</p>
<hr>
<h4>Background & Role</h4>
<p>Explain the NPC's history, their role in the adventure, and how they might interact with the party.</p>
</div>`
  },

  // Item Templates
  {
    id: 'magic-item',
    name: 'Magic Item',
    description: 'Magic item with proper D&D formatting',
    category: 'item',
    template: `
<div class="dnd-item-block">
<h4>Magic Item Name</h4>
<p><em>Wondrous item, rarity (requires attunement by [class/race/etc.])</em></p>
<hr>
<p>This item has X charges and regains 1d4 + 1 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the item is destroyed.</p>
<p><strong>Property 1.</strong> While holding this item, you gain a +1 bonus to spell attack rolls and spell save DC.</p>
<p><strong>Property 2.</strong> As an action, you can expend 1 charge to cast <em>spell name</em> (save DC 15).</p>
<p><strong>Curse (Optional).</strong> This item is cursed. Describe the curse and how it affects the bearer.</p>
</div>`
  },
  {
    id: 'mundane-item',
    name: 'Mundane Item',
    description: 'Non-magical item or equipment',
    category: 'item',
    template: `
<div class="dnd-item-block">
<h4>Item Name</h4>
<p><em>Adventuring gear, cost, weight</em></p>
<hr>
<p>Describe the item's appearance, construction, and basic properties.</p>
<p><strong>Special Properties:</strong> Any special non-magical properties or uses the item might have.</p>
</div>`
  },

  // Encounter Templates
  {
    id: 'combat-encounter',
    name: 'Combat Encounter',
    description: 'Combat encounter with tactics and environment',
    category: 'encounter',
    template: `
<div class="dnd-encounter-block">
<h3>Encounter Name</h3>
<p><strong>Encounter Level:</strong> Easy/Medium/Hard/Deadly for X characters of level Y</p>
<p><strong>XP Budget:</strong> X,XXX XP</p>
<hr>
<h4>Creatures</h4>
<ul>
<li>2 × Goblin (CR 1/4, 50 XP each)</li>
<li>1 × Hobgoblin (CR 1/2, 100 XP)</li>
</ul>
<p><strong>Total XP:</strong> 200 XP (Adjusted: 300 XP for multiple enemies)</p>
<hr>
<h4>Environment</h4>
<p>Describe the encounter area, including terrain features, lighting, cover, and any environmental hazards or advantages.</p>
<hr>
<h4>Tactics</h4>
<p><strong>Initial Setup:</strong> Where are the enemies positioned? What are they doing when the encounter begins?</p>
<p><strong>Combat Behavior:</strong> How do the enemies fight? Do they coordinate? Do they retreat?</p>
<p><strong>Morale:</strong> Under what conditions do enemies surrender or flee?</p>
<hr>
<h4>Treasure</h4>
<p>List any treasure found after the encounter, including coin, items, and other rewards.</p>
</div>`
  },
  {
    id: 'social-encounter',
    name: 'Social Encounter',
    description: 'Roleplay encounter with NPCs',
    category: 'encounter',
    template: `
<div class="dnd-encounter-block">
<h3>Social Encounter: [Title]</h3>
<hr>
<h4>Participants</h4>
<p><strong>Primary NPC:</strong> Name and brief description</p>
<p><strong>Secondary NPCs:</strong> Any other characters present</p>
<hr>
<h4>Situation</h4>
<p>Describe the current situation, what the NPCs want, and what conflict or tension exists.</p>
<hr>
<h4>NPC Goals & Motivations</h4>
<p><strong>What they want:</strong> The NPC's immediate goal in this encounter</p>
<p><strong>What they're willing to do:</strong> How far they'll go to achieve their goal</p>
<p><strong>What they won't do:</strong> Lines they won't cross</p>
<hr>
<h4>Possible Outcomes</h4>
<p><strong>Success:</strong> What happens if the party succeeds in their goals</p>
<p><strong>Partial Success:</strong> What happens if they partially succeed</p>
<p><strong>Failure:</strong> What happens if they fail or make enemies</p>
<hr>
<h4>Skill Challenges</h4>
<p>List relevant skills and DCs for different approaches (Persuasion DC 15, Intimidation DC 12, Deception DC 18, etc.)</p>
</div>`
  },

  // Trap Templates
  {
    id: 'mechanical-trap',
    name: 'Mechanical Trap',
    description: 'Physical trap with detection and disarm information',
    category: 'trap',
    template: `
<div class="dnd-trap-block">
<h4>Trap Name</h4>
<p><em>Mechanical trap, [Simple/Complex]</em></p>
<hr>
<p><strong>Trigger:</strong> Describe what activates the trap (pressure plate, tripwire, opening a door, etc.)</p>
<p><strong>Detection:</strong> DC 15 Wisdom (Perception) check to notice [specific details about what can be seen]</p>
<p><strong>Disarm:</strong> DC 15 Dexterity check using thieves' tools</p>
<hr>
<h4>Effect</h4>
<p>When triggered, the trap [describe the effect]. Each creature in the area must make a DC 15 Dexterity saving throw. On a failed save, a creature takes 10 (3d6) [damage type] damage and [additional effect]. On a successful save, the creature takes half damage and [reduced effect].</p>
<hr>
<h4>Countermeasures</h4>
<p><strong>Avoid:</strong> How the trap can be avoided or bypassed</p>
<p><strong>Disable:</strong> How the trap can be permanently disabled</p>
<p><strong>Trigger Safely:</strong> Ways to trigger the trap from a safe distance</p>
</div>`
  },
  {
    id: 'magic-trap',
    name: 'Magic Trap',
    description: 'Magical trap with spell effects',
    category: 'trap',
    template: `
<div class="dnd-trap-block">
<h4>Magic Trap Name</h4>
<p><em>Magic trap, [Simple/Complex]</em></p>
<hr>
<p><strong>Trigger:</strong> Describe what activates the trap</p>
<p><strong>Detection:</strong> DC 17 Intelligence (Investigation) check reveals magical aura; <em>detect magic</em> reveals [school] magic</p>
<p><strong>Disarm:</strong> DC 17 Intelligence (Arcana) check or <em>dispel magic</em> (DC 15)</p>
<hr>
<h4>Effect</h4>
<p>The trap casts <em>[spell name]</em> (save DC 15) centered on the triggering creature. [Describe the spell's effect in the context of the trap]</p>
<hr>
<h4>Spell Details</h4>
<p><strong>Spell Level:</strong> [X]th level<br>
<strong>Casting Time:</strong> 1 action<br>
<strong>Range/Area:</strong> [Range or area of effect]<br>
<strong>Duration:</strong> [Duration]</p>
</div>`
  },

  // Location Templates
  {
    id: 'dungeon-room',
    name: 'Dungeon Room',
    description: 'Dungeon room with proper D&D formatting',
    category: 'location',
    template: `
<div class="dnd-location-block">
<h3>Room Name</h3>
<hr>
<div class="read-aloud">
<p><em>Read-aloud text describing what the characters see, hear, and smell when they first enter the room. Keep this to immediate, obvious details only.</em></p>
</div>
<hr>
<h4>Features</h4>
<p><strong>Ceiling:</strong> Height and any notable features</p>
<p><strong>Walls:</strong> Material, condition, and decorations</p>
<p><strong>Floor:</strong> Material, condition, and any notable features</p>
<p><strong>Lighting:</strong> Light sources and visibility conditions</p>
<hr>
<h4>Contents</h4>
<p><strong>Creatures:</strong> Any monsters or NPCs in the room</p>
<p><strong>Treasure:</strong> Hidden or obvious treasure</p>
<p><strong>Interactable Objects:</strong> Furniture, doors, switches, etc.</p>
<hr>
<h4>Exits</h4>
<p><strong>North:</strong> Door to [location]</p>
<p><strong>South:</strong> Stairs leading down to [location]</p>
<p><strong>East:</strong> Secret door (DC 15 Perception) to [location]</p>
</div>`
  },
  {
    id: 'settlement',
    name: 'Settlement',
    description: 'Town, city, or village description',
    category: 'location',
    template: `
<div class="dnd-location-block">
<h3>Settlement Name</h3>
<p><em>[Type] • Population: [X] • Government: [Type]</em></p>
<hr>
<h4>Overview</h4>
<p>Brief description of the settlement's appearance, atmosphere, and general character.</p>
<hr>
<h4>Demographics</h4>
<p><strong>Population:</strong> [X] ([X]% human, [X]% halfling, [X]% other races)</p>
<p><strong>Government:</strong> Describe the local government structure</p>
<p><strong>Defense:</strong> Military forces, walls, guards, etc.</p>
<hr>
<h4>Notable Locations</h4>
<p><strong>The [Inn Name]:</strong> Description and proprietor</p>
<p><strong>[Shop Name]:</strong> Type of business and owner</p>
<p><strong>[Temple Name]:</strong> Religious site and clergy</p>
<hr>
<h4>Important NPCs</h4>
<p><strong>[NPC Name], [Title]:</strong> Role and personality</p>
<p><strong>[NPC Name], [Occupation]:</strong> Role and personality</p>
<hr>
<h4>Adventure Hooks</h4>
<p>• Plot hook or rumor available in this settlement</p>
<p>• Another potential adventure lead</p>
</div>`
  },

  // Shop Template
  {
    id: 'shop',
    name: 'Shop/Business',
    description: 'Shop with inventory and proprietor',
    category: 'shop',
    template: `
<div class="dnd-shop-block">
<h3>Shop Name</h3>
<p><em>[Type of Business] • [Settlement Name]</em></p>
<hr>
<h4>Proprietor</h4>
<p><strong>[NPC Name]</strong> ([Race] [Class/Background])</p>
<p>Brief personality description and appearance. Include their attitude toward customers and any quirks.</p>
<hr>
<h4>Shop Description</h4>
<p>Describe the shop's appearance, atmosphere, and general layout. What does it smell like? What catches the eye?</p>
<hr>
<h4>Inventory</h4>
<p><strong>Always Available:</strong></p>
<ul>
<li>Common items from the Player's Handbook</li>
<li>Specific items this shop specializes in</li>
</ul>
<p><strong>Special Items (Limited Stock):</strong></p>
<ul>
<li>[Item Name] - [Price] - [Description]</li>
<li>[Magic Item] - [Price] - [Description and properties]</li>
</ul>
<hr>
<h4>Services</h4>
<p>• [Service Name]: [Cost] - [Description]</p>
<p>• [Service Name]: [Cost] - [Description]</p>
<hr>
<h4>Buying & Selling</h4>
<p><strong>Buys:</strong> Types of items the shop will purchase</p>
<p><strong>Selling Price:</strong> [X]% of market value</p>
<p><strong>Buying Price:</strong> [X]% of market value</p>
</div>`
  },

  // Quest Template
  {
    id: 'quest',
    name: 'Quest/Mission',
    description: 'Quest with objectives and rewards',
    category: 'quest',
    template: `
<div class="dnd-quest-block">
<h3>Quest Name</h3>
<p><em>Level: [X-Y] • Type: [Main/Side/Fetch/Escort/etc.] • Estimated Duration: [X] sessions</em></p>
<hr>
<h4>Quest Giver</h4>
<p><strong>[NPC Name]</strong> - [Title/Occupation]</p>
<p>Brief description of the quest giver and their motivation for offering this quest.</p>
<hr>
<h4>Background</h4>
<p>Explain the situation that led to this quest. What problem needs solving? What's the history behind it?</p>
<hr>
<h4>Objectives</h4>
<p><strong>Primary Objective:</strong> The main goal the party must accomplish</p>
<p><strong>Secondary Objectives (Optional):</strong></p>
<ul>
<li>Optional goal that provides additional rewards</li>
<li>Another optional objective</li>
</ul>
<hr>
<h4>Challenges & Obstacles</h4>
<p>• [Challenge Type]: Brief description of a major obstacle</p>
<p>• [Challenge Type]: Another significant challenge</p>
<p>• [Challenge Type]: Environmental or social challenge</p>
<hr>
<h4>Rewards</h4>
<p><strong>Payment:</strong> [X] gp per character</p>
<p><strong>Items:</strong> Specific magic items or equipment</p>
<p><strong>Other:</strong> Reputation, titles, property, or other benefits</p>
<hr>
<h4>Consequences</h4>
<p><strong>Success:</strong> What happens if the quest succeeds</p>
<p><strong>Failure:</strong> What happens if the quest fails</p>
<p><strong>Partial Success:</strong> What happens if some objectives are met</p>
</div>`
  }
]

export const getTemplatesByCategory = (category: string): DnDTemplate[] => {
  return DND_TEMPLATES.filter(template => template.category === category)
}

export const getTemplateById = (id: string): DnDTemplate | undefined => {
  return DND_TEMPLATES.find(template => template.id === id)
} 