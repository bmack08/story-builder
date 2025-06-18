import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type { 
  Monster, 
  NPC, 
  Item, 
  Spell, 
  Encounter, 
  Trap 
} from '../types/dnd'

export interface AIProvider {
  name: 'openai' | 'anthropic'
  generateMonster: (prompt: string) => Promise<Monster>
  generateNPC: (prompt: string) => Promise<NPC>
  generateEncounter: (prompt: string, partyLevel: number, partySize: number) => Promise<Encounter>
  generateItem: (prompt: string) => Promise<Item>
  generateTrap: (prompt: string) => Promise<Trap>
  generateSpell: (prompt: string) => Promise<Spell>
}

class OpenAIProvider implements AIProvider {
  name: 'openai' = 'openai'
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async generateMonster(prompt: string): Promise<Monster> {
    const systemPrompt = `You are a D&D 5e monster designer. Generate a complete monster stat block based on the user's request. 
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "Monster Name",
      "size": "Medium",
      "type": "humanoid",
      "alignment": "neutral evil",
      "armorClass": 15,
      "hitPoints": 58,
      "speed": "30 ft.",
      "abilities": {
        "strength": 16,
        "dexterity": 14,
        "constitution": 16,
        "intelligence": 10,
        "wisdom": 13,
        "charisma": 12
      },
      "savingThrows": {"dex": 4, "wis": 3},
      "skills": {"perception": 3, "stealth": 4},
      "damageResistances": ["fire"],
      "damageImmunities": [],
      "conditionImmunities": [],
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "Common, Goblin",
      "challengeRating": "3",
      "proficiencyBonus": 2,
      "actions": [
        {
          "name": "Multiattack",
          "description": "The monster makes two attacks."
        },
        {
          "name": "Longsword",
          "description": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage.",
          "attackBonus": 5,
          "damage": "1d8 + 3",
          "damageType": "slashing"
        }
      ],
      "description": "A detailed description of the monster's appearance and behavior."
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as Monster
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  async generateNPC(prompt: string): Promise<NPC> {
    const systemPrompt = `You are a D&D 5e NPC creator. Generate a complete NPC based on the user's request.
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "NPC Name",
      "race": "Human",
      "class": "Fighter",
      "level": 5,
      "background": "Soldier",
      "alignment": "lawful good",
      "appearance": "A tall, weathered human with scars from many battles",
      "personality": "Gruff but honorable, speaks in short sentences",
      "ideals": "Protect the innocent at all costs",
      "bonds": "My old regiment is my family",
      "flaws": "I have trouble trusting magic users",
      "stats": {
        "strength": 16,
        "dexterity": 13,
        "constitution": 14,
        "intelligence": 10,
        "wisdom": 12,
        "charisma": 11
      },
      "skills": ["Athletics", "Intimidation", "Perception"],
      "equipment": ["Plate armor", "Longsword", "Shield", "50 gp"],
      "notes": "Additional roleplay notes and hooks"
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 1000
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as NPC
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  async generateEncounter(prompt: string, partyLevel: number, partySize: number): Promise<Encounter> {
    const systemPrompt = `You are a D&D 5e encounter designer. Create a balanced encounter for a party of ${partySize} level ${partyLevel} characters.
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "Encounter Name",
      "description": "Detailed description of the encounter setup and environment",
      "difficulty": "medium",
      "environment": "Forest clearing",
      "creatures": [
        {
          "monsterId": "goblin-1",
          "name": "Goblin Scout",
          "quantity": 2,
          "hitPoints": 7,
          "initiative": 0,
          "conditions": [],
          "notes": "Hidden behind trees initially"
        }
      ],
      "treasures": [
        {
          "name": "Potion of Healing",
          "type": "potion",
          "rarity": "common",
          "requiresAttunement": false,
          "description": "A character who drinks this potion regains 2d4 + 2 hit points."
        }
      ],
      "experience": 200,
      "notes": "Tactical notes and special conditions for the encounter"
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${prompt} (Party: ${partySize} level ${partyLevel} characters)` }
      ],
      temperature: 0.8,
      max_tokens: 1200
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as Encounter
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  async generateItem(prompt: string): Promise<Item> {
    const systemPrompt = `You are a D&D 5e magic item creator. Generate a complete magic item based on the user's request.
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "Item Name",
      "type": "weapon",
      "rarity": "uncommon",
      "requiresAttunement": true,
      "description": "Detailed description of the item's appearance and magical properties",
      "properties": ["Versatile", "Magical"],
      "damage": "1d8",
      "damageType": "slashing",
      "armorClass": 0,
      "weight": 3,
      "cost": {
        "amount": 500,
        "currency": "gp"
      },
      "magicalProperties": [
        "You gain a +1 bonus to attack and damage rolls made with this weapon.",
        "As a bonus action, you can cause the blade to shed bright light in a 10-foot radius."
      ]
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as Item
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  async generateTrap(prompt: string): Promise<Trap> {
    const systemPrompt = `You are a D&D 5e trap designer. Create a trap based on the user's request.
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "Trap Name",
      "type": "mechanical",
      "trigger": "Pressure plate activated when stepped on",
      "effect": "Darts shoot from hidden holes in the walls",
      "detectDC": 15,
      "disarmDC": 15,
      "damage": "2d4",
      "damageType": "piercing",
      "savingThrow": {
        "ability": "dexterity",
        "dc": 15,
        "effect": "Half damage on success"
      },
      "description": "Detailed description of the trap's appearance and mechanics"
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 600
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as Trap
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }

  async generateSpell(prompt: string): Promise<Spell> {
    const systemPrompt = `You are a D&D 5e spell creator. Generate a complete spell based on the user's request.
    Return ONLY valid JSON matching this exact structure:
    {
      "name": "Spell Name",
      "level": 3,
      "school": "evocation",
      "castingTime": "1 action",
      "range": "120 feet",
      "components": {
        "verbal": true,
        "somatic": true,
        "material": false,
        "materialComponent": ""
      },
      "duration": "Instantaneous",
      "concentration": false,
      "ritual": false,
      "description": "Detailed spell description including effects and mechanics",
      "higherLevels": "When you cast this spell using a spell slot of 4th level or higher...",
      "classes": ["Wizard", "Sorcerer"]
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content) as Spell
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI')
    }
  }
}

class AnthropicProvider implements AIProvider {
  name: 'anthropic' = 'anthropic'
  private client: Anthropic

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required')
    }
    
    this.client = new Anthropic({
      apiKey: apiKey
    })
  }

  async generateMonster(prompt: string): Promise<Monster> {
    const systemPrompt = `You are a D&D 5e monster designer. Generate a complete monster stat block based on the user's request. 
    Return ONLY valid JSON matching the Monster interface structure. Include all required fields: name, size, type, alignment, armorClass, hitPoints, speed, abilities, senses, languages, challengeRating, proficiencyBonus, actions, and description.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as Monster
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate monster with Anthropic')
    }
  }

  async generateNPC(prompt: string): Promise<NPC> {
    const systemPrompt = `You are a D&D 5e NPC creator. Generate a complete NPC based on the user's request.
    Return ONLY valid JSON matching the NPC interface structure. Include personality, appearance, background, and roleplay elements.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.9,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as NPC
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate NPC with Anthropic')
    }
  }

  async generateEncounter(prompt: string, partyLevel: number, partySize: number): Promise<Encounter> {
    const systemPrompt = `You are a D&D 5e encounter designer. Create a balanced encounter for a party of ${partySize} level ${partyLevel} characters.
    Return ONLY valid JSON matching the Encounter interface structure. Balance the encounter appropriately for the party level and size.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1200,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `${prompt} (Party: ${partySize} level ${partyLevel} characters)` }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as Encounter
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate encounter with Anthropic')
    }
  }

  async generateItem(prompt: string): Promise<Item> {
    const systemPrompt = `You are a D&D 5e magic item creator. Generate a complete magic item based on the user's request.
    Return ONLY valid JSON matching the Item interface structure. Include appropriate rarity, properties, and magical effects.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 800,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as Item
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate item with Anthropic')
    }
  }

  async generateTrap(prompt: string): Promise<Trap> {
    const systemPrompt = `You are a D&D 5e trap designer. Create a trap based on the user's request.
    Return ONLY valid JSON matching the Trap interface structure. Include trigger, effect, detection/disarm DCs, and damage.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 600,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as Trap
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate trap with Anthropic')
    }
  }

  async generateSpell(prompt: string): Promise<Spell> {
    const systemPrompt = `You are a D&D 5e spell creator. Generate a complete spell based on the user's request.
    Return ONLY valid JSON matching the Spell interface structure. Include level, school, components, duration, and detailed description.`

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 800,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      })

      const content = response.content[0]
      if (content.type !== 'text') throw new Error('Invalid response type from Anthropic')

      return JSON.parse(content.text) as Spell
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw new Error('Failed to generate spell with Anthropic')
    }
  }
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map()
  private defaultProvider: string = 'openai'

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider())
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicProvider())
    }

    // Set default provider based on availability
    if (this.providers.has('anthropic')) {
      this.defaultProvider = 'anthropic'
    } else if (this.providers.has('openai')) {
      this.defaultProvider = 'openai'
    } else {
      throw new Error('No AI providers configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY')
    }
  }

  private getProvider(providerName?: string): AIProvider {
    const provider = this.providers.get(providerName || this.defaultProvider)
    if (!provider) {
      throw new Error(`AI provider '${providerName || this.defaultProvider}' not available`)
    }
    return provider
  }

  async generateMonster(prompt: string, provider?: string): Promise<Monster> {
    return this.getProvider(provider).generateMonster(prompt)
  }

  async generateNPC(prompt: string, provider?: string): Promise<NPC> {
    return this.getProvider(provider).generateNPC(prompt)
  }

  async generateEncounter(prompt: string, partyLevel: number, partySize: number, provider?: string): Promise<Encounter> {
    return this.getProvider(provider).generateEncounter(prompt, partyLevel, partySize)
  }

  async generateItem(prompt: string, provider?: string): Promise<Item> {
    return this.getProvider(provider).generateItem(prompt)
  }

  async generateTrap(prompt: string, provider?: string): Promise<Trap> {
    return this.getProvider(provider).generateTrap(prompt)
  }

  async generateSpell(prompt: string, provider?: string): Promise<Spell> {
    return this.getProvider(provider).generateSpell(prompt)
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  setDefaultProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider '${provider}' not available`)
    }
    this.defaultProvider = provider
  }
}

export const aiService = new AIService() 