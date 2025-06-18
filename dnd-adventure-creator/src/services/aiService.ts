import type { 
  Monster, 
  NPC, 
  Item, 
  Spell, 
  Encounter, 
  Trap 
} from '../types/editor'
import { DnDStatBlock } from '../stores/adventureStore'
import { DND_TEMPLATES } from '../components/editor/DnDContentTemplates'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface AIGenerationRequest {
  prompt: string
  provider?: 'openai' | 'anthropic'
  contentType?: 'monster' | 'npc' | 'encounter' | 'item' | 'trap' | 'spell'
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

export interface AIProvider {
  providers: string[]
  default: string
}

export interface AICommand {
  command: string
  target?: string
  replacement?: string
  context?: string
}

export interface AIResponse {
  success: boolean
  content?: string
  statBlock?: DnDStatBlock
  error?: string
}

export class AIService {
  private static instance: AIService
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private async makeRequest<T>(endpoint: string, data: any): Promise<AIGenerationResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        provider: data.provider || 'unknown'
      }
    }
  }

  async getProviders(): Promise<AIProvider> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/providers`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Failed to get AI providers:', error)
      return { providers: [], default: '' }
    }
  }

  async generateMonster(prompt: string, provider?: string): Promise<AIGenerationResponse<Monster>> {
    return this.makeRequest<Monster>('/generate/monster', { prompt, provider })
  }

  async generateNPC(prompt: string, provider?: string): Promise<AIGenerationResponse<NPC>> {
    return this.makeRequest<NPC>('/generate/npc', { prompt, provider })
  }

  async generateEncounter(
    prompt: string, 
    partyLevel: number = 1, 
    partySize: number = 4, 
    provider?: string
  ): Promise<AIGenerationResponse<Encounter>> {
    return this.makeRequest<Encounter>('/generate/encounter', { 
      prompt, 
      provider, 
      partyLevel, 
      partySize 
    })
  }

  async generateItem(prompt: string, provider?: string): Promise<AIGenerationResponse<Item>> {
    return this.makeRequest<Item>('/generate/item', { prompt, provider })
  }

  async generateTrap(prompt: string, provider?: string): Promise<AIGenerationResponse<Trap>> {
    return this.makeRequest<Trap>('/generate/trap', { prompt, provider })
  }

  async generateSpell(prompt: string, provider?: string): Promise<AIGenerationResponse<Spell>> {
    return this.makeRequest<Spell>('/generate/spell', { prompt, provider })
  }

  async generateContent<T>(request: AIGenerationRequest): Promise<AIGenerationResponse<T>> {
    return this.makeRequest<T>('/generate', request)
  }

  // Helper methods for common generation patterns
  async generateRandomMonster(challengeRating: string, environment?: string, provider?: string): Promise<AIGenerationResponse<Monster>> {
    const prompt = `Create a ${challengeRating} CR monster${environment ? ` for a ${environment} environment` : ''}. Make it unique and interesting with creative abilities.`
    return this.generateMonster(prompt, provider)
  }

  async generateRandomNPC(role: string, location?: string, provider?: string): Promise<AIGenerationResponse<NPC>> {
    const prompt = `Create a ${role}${location ? ` found in ${location}` : ''}. Give them a compelling personality, background, and potential plot hooks.`
    return this.generateNPC(prompt, provider)
  }

  async generateBalancedEncounter(
    partyLevel: number, 
    partySize: number, 
    difficulty: 'easy' | 'medium' | 'hard' | 'deadly' = 'medium',
    theme?: string,
    provider?: string
  ): Promise<AIGenerationResponse<Encounter>> {
    const prompt = `Create a ${difficulty} encounter for ${partySize} level ${partyLevel} characters${theme ? ` with a ${theme} theme` : ''}. Balance it appropriately and include tactical elements.`
    return this.generateEncounter(prompt, partyLevel, partySize, provider)
  }

  async generateMagicItem(rarity: string, itemType?: string, provider?: string): Promise<AIGenerationResponse<Item>> {
    const prompt = `Create a ${rarity} magic ${itemType || 'item'}. Make it unique with interesting properties that would be useful and fun for players.`
    return this.generateItem(prompt, provider)
  }

  async generateTrapForLevel(level: number, trapType?: string, provider?: string): Promise<AIGenerationResponse<Trap>> {
    const prompt = `Create a ${trapType || 'mechanical'} trap appropriate for level ${level} characters. Make it challenging but fair with clear detection and disarm methods.`
    return this.generateTrap(prompt, provider)
  }

  async generateCustomSpell(level: number, school?: string, provider?: string): Promise<AIGenerationResponse<Spell>> {
    const prompt = `Create a unique ${level}${level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : 'th'} level ${school || ''} spell. Make it balanced and interesting with creative mechanics.`
    return this.generateSpell(prompt, provider)
  }

  // Parse AI commands from text
  parseCommands(text: string): AICommand[] {
    const commands: AICommand[] = []
    const commandRegex = /\/(\w+)(?:\s+([^\/\n]+))?/g
    let match

    while ((match = commandRegex.exec(text)) !== null) {
      const [fullMatch, command, args] = match
      commands.push({
        command: command.toLowerCase(),
        target: args?.trim(),
        context: text
      })
    }

    return commands
  }

  // Process AI commands and return enhanced content
  async processCommands(text: string, commands: AICommand[]): Promise<string> {
    let processedText = text

    for (const cmd of commands) {
      try {
        const response = await this.executeCommand(cmd)
        if (response.success && response.content) {
          // Replace the command with the generated content
          const commandPattern = new RegExp(`/${cmd.command}\\s*${cmd.target || ''}`, 'gi')
          processedText = processedText.replace(commandPattern, response.content)
        }
      } catch (error) {
        console.error('Error processing AI command:', error)
      }
    }

    return processedText
  }

  // Execute individual AI commands
  private async executeCommand(command: AICommand): Promise<AIResponse> {
    switch (command.command) {
      case 'add-monster':
      case 'replace-stats':
        return this.generateMonsterStatBlock(command.target)
      
      case 'add-npc':
      case 'replace-npc':
        return this.generateNPCStatBlock(command.target)
      
      case 'add-item':
        return this.generateMagicItem(command.target)
      
      case 'add-spell':
        return this.generateSpell(command.target)
      
      case 'add-location':
        return this.generateLocation(command.target)
      
      case 'add-encounter':
        return this.generateEncounter(command.target)
      
      case 'add-trap':
        return this.generateTrap(command.target)
      
      default:
        return {
          success: false,
          error: `Unknown command: ${command.command}`
        }
    }
  }

  // Generate monster stat block
  private async generateMonsterStatBlock(monsterName?: string): Promise<AIResponse> {
    const monsters = DND_TEMPLATES.filter(t => t.category === 'Monsters')
    
    if (!monsterName) {
      // Return a random monster
      const randomMonster = monsters[Math.floor(Math.random() * monsters.length)]
      return {
        success: true,
        content: this.formatStatBlockForDisplay(randomMonster),
        statBlock: {
          id: `monster-${Date.now()}`,
          name: randomMonster.name,
          type: 'monster',
          data: randomMonster,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }

    // Try to find a matching monster
    const matchingMonster = monsters.find(m => 
      m.name.toLowerCase().includes(monsterName.toLowerCase()) ||
      monsterName.toLowerCase().includes(m.name.toLowerCase())
    )

    if (matchingMonster) {
      return {
        success: true,
        content: this.formatStatBlockForDisplay(matchingMonster),
        statBlock: {
          id: `monster-${Date.now()}`,
          name: matchingMonster.name,
          type: 'monster',
          data: matchingMonster,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }

    // Generate a custom monster based on the name
    return this.generateCustomMonster(monsterName)
  }

  // Generate NPC stat block
  private async generateNPCStatBlock(npcName?: string): Promise<AIResponse> {
    const npcs = DND_TEMPLATES.filter(t => t.category === 'NPCs')
    
    if (!npcName) {
      const randomNPC = npcs[Math.floor(Math.random() * npcs.length)]
      return {
        success: true,
        content: this.formatStatBlockForDisplay(randomNPC),
        statBlock: {
          id: `npc-${Date.now()}`,
          name: randomNPC.name,
          type: 'npc',
          data: randomNPC,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }

    // Find matching NPC or generate custom
    const matchingNPC = npcs.find(n => 
      n.name.toLowerCase().includes(npcName.toLowerCase()) ||
      npcName.toLowerCase().includes(n.name.toLowerCase())
    )

    if (matchingNPC) {
      return {
        success: true,
        content: this.formatStatBlockForDisplay(matchingNPC),
        statBlock: {
          id: `npc-${Date.now()}`,
          name: matchingNPC.name,
          type: 'npc',
          data: matchingNPC,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }

    return this.generateCustomNPC(npcName)
  }

  // Generate magic item
  private async generateMagicItem(itemName?: string): Promise<AIResponse> {
    const items = DND_TEMPLATES.filter(t => t.category === 'Items')
    
    const randomItem = items[Math.floor(Math.random() * items.length)]
    const customName = itemName || randomItem.name
    
    return {
      success: true,
      content: this.formatStatBlockForDisplay({...randomItem, name: customName}),
      statBlock: {
        id: `item-${Date.now()}`,
        name: customName,
        type: 'item',
        data: {...randomItem, name: customName},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate spell
  private async generateSpell(spellName?: string): Promise<AIResponse> {
    const spells = [
      {
        name: spellName || 'Magic Missile',
        level: '1st-level',
        school: 'Evocation',
        castingTime: '1 action',
        range: '120 feet',
        components: 'V, S',
        duration: 'Instantaneous',
        description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.'
      }
    ]

    const spell = spells[0]
    const content = `
<div class="spell-block" style="border: 2px solid #8B0000; border-radius: 8px; padding: 16px; margin: 16px 0; background: #f9f9f9;">
  <h3 style="color: #8B0000; margin: 0 0 8px 0;">${spell.name}</h3>
  <p style="font-style: italic; margin: 4px 0;"><strong>${spell.level} ${spell.school}</strong></p>
  <p style="margin: 4px 0;"><strong>Casting Time:</strong> ${spell.castingTime}</p>
  <p style="margin: 4px 0;"><strong>Range:</strong> ${spell.range}</p>
  <p style="margin: 4px 0;"><strong>Components:</strong> ${spell.components}</p>
  <p style="margin: 4px 0;"><strong>Duration:</strong> ${spell.duration}</p>
  <p style="margin: 8px 0 0 0;">${spell.description}</p>
</div>
    `

    return {
      success: true,
      content: content.trim(),
      statBlock: {
        id: `spell-${Date.now()}`,
        name: spell.name,
        type: 'spell',
        data: spell,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate location
  private async generateLocation(locationName?: string): Promise<AIResponse> {
    const locations = DND_TEMPLATES.filter(t => t.category === 'Locations')
    const randomLocation = locations[Math.floor(Math.random() * locations.length)]
    const customName = locationName || randomLocation.name

    return {
      success: true,
      content: this.formatStatBlockForDisplay({...randomLocation, name: customName}),
      statBlock: {
        id: `location-${Date.now()}`,
        name: customName,
        type: 'location',
        data: {...randomLocation, name: customName},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate encounter
  private async generateEncounter(encounterType?: string): Promise<AIResponse> {
    const encounters = DND_TEMPLATES.filter(t => t.category === 'Encounters')
    const randomEncounter = encounters[Math.floor(Math.random() * encounters.length)]
    
    return {
      success: true,
      content: this.formatStatBlockForDisplay(randomEncounter),
      statBlock: {
        id: `encounter-${Date.now()}`,
        name: randomEncounter.name,
        type: 'monster', // Encounters are treated as monster types for simplicity
        data: randomEncounter,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate trap
  private async generateTrap(trapName?: string): Promise<AIResponse> {
    const traps = DND_TEMPLATES.filter(t => t.category === 'Traps')
    const randomTrap = traps[Math.floor(Math.random() * traps.length)]
    const customName = trapName || randomTrap.name

    return {
      success: true,
      content: this.formatStatBlockForDisplay({...randomTrap, name: customName}),
      statBlock: {
        id: `trap-${Date.now()}`,
        name: customName,
        type: 'monster', // Traps are treated as monster types for simplicity
        data: {...randomTrap, name: customName},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate custom monster
  private async generateCustomMonster(name: string): Promise<AIResponse> {
    const customMonster = {
      name: name,
      category: 'Monsters',
      description: `A custom ${name} for your adventure`,
      content: `
**${name}**
*Medium humanoid, neutral*

**Armor Class** 12 (Leather Armor)
**Hit Points** 22 (4d8 + 4)
**Speed** 30 ft.

**STR** 13 (+1) **DEX** 14 (+2) **CON** 12 (+1) **INT** 10 (+0) **WIS** 11 (+0) **CHA** 10 (+0)

**Skills** Perception +2
**Senses** passive Perception 12
**Languages** Common
**Challenge** 1/2 (100 XP)

***Actions***
**Scimitar.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) slashing damage.
**Light Crossbow.** *Ranged Weapon Attack:* +4 to hit, range 80/320 ft., one target. *Hit:* 6 (1d8 + 2) piercing damage.
      `
    }

    return {
      success: true,
      content: this.formatStatBlockForDisplay(customMonster),
      statBlock: {
        id: `custom-monster-${Date.now()}`,
        name: customMonster.name,
        type: 'monster',
        data: customMonster,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Generate custom NPC
  private async generateCustomNPC(name: string): Promise<AIResponse> {
    const customNPC = {
      name: name,
      category: 'NPCs',
      description: `A custom NPC named ${name}`,
      content: `
**${name}**
*Medium humanoid (any race), any alignment*

**Personality Traits:** Friendly and helpful, always ready with a smile
**Ideals:** Believes in treating everyone with respect and kindness
**Bonds:** Devoted to their community and family
**Flaws:** Sometimes too trusting of strangers

**Appearance:** Average height with kind eyes and a warm demeanor
**Background:** A local merchant or artisan with deep community ties

**Stats:** Use **Commoner** statistics (AC 10, HP 4, Speed 30 ft.)
      `
    }

    return {
      success: true,
      content: this.formatStatBlockForDisplay(customNPC),
      statBlock: {
        id: `custom-npc-${Date.now()}`,
        name: customNPC.name,
        type: 'npc',
        data: customNPC,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Format stat block for display in the editor
  private formatStatBlockForDisplay(template: any): string {
    return `
<div class="stat-block interactive-stat-block" style="border: 2px solid #8B0000; border-radius: 8px; padding: 16px; margin: 16px 0; background: #f9f9f9; cursor: pointer;" title="Click to view full stat block">
  <h3 style="color: #8B0000; margin: 0 0 8px 0;">${template.name}</h3>
  <p style="font-style: italic; margin: 4px 0; color: #666;">${template.description}</p>
  <div style="margin-top: 8px; padding: 8px; background: #fff; border-radius: 4px; white-space: pre-line; font-family: monospace; font-size: 14px;">
${template.content}
  </div>
  <div style="margin-top: 8px; font-size: 12px; color: #888;">
    <em>Interactive Stat Block - Hover to highlight, click for details</em>
  </div>
</div>
    `.trim()
  }

  // Get available commands
  getAvailableCommands(): string[] {
    return [
      '/add-monster [name] - Add a monster stat block',
      '/replace-stats [name] - Replace with different stats',
      '/add-npc [name] - Add an NPC',
      '/replace-npc [name] - Replace with different NPC',
      '/add-item [name] - Add a magic item',
      '/add-spell [name] - Add a spell',
      '/add-location [name] - Add a location',
      '/add-encounter [type] - Add an encounter',
      '/add-trap [name] - Add a trap'
    ]
  }
}

export const aiService = AIService.getInstance() 