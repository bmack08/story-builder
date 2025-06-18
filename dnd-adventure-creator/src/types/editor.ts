import { Editor } from '@tiptap/react'

// Core editor types
export interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
}

// D&D Content Types
export interface DnDContent {
  id: string
  type: DnDContentType
  name: string
  data: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export type DnDContentType = 
  | 'monster' 
  | 'npc' 
  | 'item' 
  | 'spell' 
  | 'trap' 
  | 'encounter' 
  | 'location'
  | 'condition'

// Monster data structure
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

// NPC data structure
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

// Item data structure
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

// Spell data structure
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

// Encounter data structure
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

// Trap data structure
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

// Slash command types
export interface SlashCommand {
  name: string
  description: string
  icon: string
  command: string
  category: SlashCommandCategory
  action: (editor: Editor) => void
}

export type SlashCommandCategory = 
  | 'content' 
  | 'formatting' 
  | 'structure' 
  | 'ai'

// Editor extension types
export interface DnDTooltipOptions {
  contentType: DnDContentType
  contentId: string
  inline?: boolean
}

export interface SlashCommandOptions {
  commands: SlashCommand[]
  onCommand?: (command: SlashCommand) => void
}

// Adventure document structure
export interface Adventure {
  id: string
  title: string
  description: string
  content: string
  authorId: string
  campaignId?: string
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  version: number
}

// Editor state
export interface EditorState {
  content: string
  selection: {
    from: number
    to: number
  }
  isEditable: boolean
  hasChanges: boolean
  lastSaved?: Date
}

// Collaboration types
export interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor?: {
    from: number
    to: number
  }
}

export interface CollaborationState {
  users: CollaborationUser[]
  isConnected: boolean
  roomId: string
} 