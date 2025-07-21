// D&D Content Types for Backend
export interface Monster {
  name: string
  size: string
  type: string
  alignment: string
  armorClass: number
  hitPoints: number
  speed: string
  abilities: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  savingThrows?: Record<string, number>
  skills?: Record<string, number>
  damageResistances?: string[]
  damageImmunities?: string[]
  conditionImmunities?: string[]
  senses: string
  languages: string
  challengeRating: string
  proficiencyBonus: number
  actions: Action[]
  legendaryActions?: Action[]
  reactions?: Action[]
  description?: string
}

export interface Action {
  name: string
  description: string
  attackBonus?: number
  damage?: string
  damageType?: string
}

export interface NPC {
  name: string
  race: string
  class?: string
  level?: number
  background?: string
  alignment: string
  appearance: string
  personality: string
  ideals?: string
  bonds?: string
  flaws?: string
  stats?: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  skills?: string[]
  equipment?: string[]
  notes?: string
}

export interface Item {
  name: string
  type: ItemType
  rarity: ItemRarity
  requiresAttunement: boolean
  description: string
  properties?: string[]
  damage?: string
  damageType?: string
  armorClass?: number
  weight?: number
  cost?: {
    amount: number
    currency: string
  }
  magicalProperties?: string[]
}

export type ItemType = 
  | 'weapon' 
  | 'armor' 
  | 'shield' 
  | 'potion' 
  | 'scroll' 
  | 'wondrous' 
  | 'tool' 
  | 'treasure'

export type ItemRarity = 
  | 'common' 
  | 'uncommon' 
  | 'rare' 
  | 'very rare' 
  | 'legendary' 
  | 'artifact'

export interface Spell {
  name: string
  level: number
  school: SpellSchool
  castingTime: string
  range: string
  components: {
    verbal: boolean
    somatic: boolean
    material: boolean
    materialComponent?: string
  }
  duration: string
  concentration: boolean
  ritual: boolean
  description: string
  higherLevels?: string
  classes: string[]
}

export type SpellSchool = 
  | 'abjuration' 
  | 'conjuration' 
  | 'divination' 
  | 'enchantment' 
  | 'evocation' 
  | 'illusion' 
  | 'necromancy' 
  | 'transmutation'

export interface Encounter {
  name: string
  description: string
  difficulty: EncounterDifficulty
  environment: string
  creatures: EncounterCreature[]
  treasures?: Item[]
  experience: number
  notes?: string
}

export interface EncounterCreature {
  monsterId: string
  name: string
  quantity: number
  hitPoints?: number
  initiative?: number
  conditions?: string[]
  notes?: string
}

export type EncounterDifficulty = 'easy' | 'medium' | 'hard' | 'deadly'

export interface Trap {
  name: string
  type: TrapType
  trigger: string
  effect: string
  detectDC: number
  disarmDC: number
  damage?: string
  damageType?: string
  savingThrow?: {
    ability: string
    dc: number
    effect: string
  }
  description: string
}

export type TrapType = 'mechanical' | 'magical' | 'natural'

// AI Generation Request Types
export interface AIGenerationRequest {
  prompt: string
  provider?: 'openai' | 'anthropic'
  contentType: 'monster' | 'npc' | 'encounter' | 'item' | 'trap' | 'spell'
  partyLevel?: number
  partySize?: number
}

export interface AIGenerationResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  provider: string
  tokensUsed?: number
} 