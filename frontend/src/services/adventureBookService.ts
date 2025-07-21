interface AdventureRequirements {
  // Basic Adventure Info
  title: string
  description: string
  theme: string
  tone: string
  
  // Campaign Details
  playerLevels: string
  partySize: number
  duration: string
  setting: string
  
  // Story Structure
  plotType: string
  mainVillain: string
  majorLocations: string[]
  keyNPCs: string[]
  
  // Adventure Elements
  includeElements: string[]
  difficultyPreference: string
  specialMechanics: string[]
  
  // Customization
  customRequests: string
  inspirations: string
}

interface AdventureBookResponse {
  id: string
  title: string
  description: string
  metadata: {
    playerLevels: string
    partySize: number
    duration: string
    setting: string
    theme: string
    tone: string
  }
  chapters: AdventureChapter[]
  appendices: AdventureAppendix[]
  createdAt: string
}

interface AdventureChapter {
  id: string
  title: string
  order: number
  content: string
  readAloudText: string
  dmNotes: string
  encounters: Encounter[]
  npcs: NPC[]
  locations: Location[]
  treasures: Treasure[]
  statBlocks: StatBlock[]
}

interface AdventureAppendix {
  id: string
  title: string
  type: 'monsters' | 'npcs' | 'items' | 'handouts' | 'maps' | 'tables'
  content: string
  data: any
}

interface Encounter {
  id: string
  name: string
  type: 'combat' | 'social' | 'exploration' | 'puzzle'
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  xpBudget: number
  creatures: any[]
  environment: string
  tactics: string
}

interface NPC {
  id: string
  name: string
  race: string
  class?: string
  background?: string
  appearance: string
  personality: string
  goals: string
  secrets?: string
  statBlock?: any
}

interface Location {
  id: string
  name: string
  type: 'settlement' | 'dungeon' | 'wilderness' | 'landmark'
  description: string
  features: string[]
  encounters: string[]
  secrets?: string
}

interface Treasure {
  id: string
  name: string
  type: 'mundane' | 'magic' | 'artifact'
  rarity?: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary'
  description: string
  value?: number
  properties?: string[]
}

interface StatBlock {
  id: string
  name: string
  type: 'monster' | 'npc'
  data: any
}

interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  provider?: string
}

export class AdventureBookService {
  private baseURL: string

  constructor() {
    this.baseURL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'
  }

  /**
   * Generate AI advice for specific questions during the wizard
   */
  async generateAdvice(
    question: string,
    context: any,
    currentRequirements: AdventureRequirements
  ): Promise<APIResponse<string>> {
    try {
      const response = await fetch(`${this.baseURL}/api/adventure/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          context,
          currentRequirements
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        return {
          success: true,
          data: result.advice,
          provider: result.provider
        }
      } else {
        return {
          success: false,
          error: result.error || 'Failed to generate advice'
        }
      }
    } catch (error) {
      console.error('Error generating advice:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Generate complete adventure book based on requirements
   */
  async generateAdventureBook(
    requirements: AdventureRequirements
  ): Promise<APIResponse<AdventureBookResponse>> {
    try {
      const response = await fetch(`${this.baseURL}/api/adventure/generate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requirements)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        return {
          success: true,
          data: result.adventure,
          provider: result.provider
        }
      } else {
        return {
          success: false,
          error: result.error || 'Failed to generate adventure book'
        }
      }
    } catch (error) {
      console.error('Error generating adventure book:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Generate specific chapter content
   */
  async generateChapter(
    chapterTitle: string,
    chapterType: string,
    context: any,
    requirements: AdventureRequirements
  ): Promise<APIResponse<AdventureChapter>> {
    try {
      const response = await fetch(`${this.baseURL}/api/adventure/generate-chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapterTitle,
          chapterType,
          context,
          requirements
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        return {
          success: true,
          data: result.chapter,
          provider: result.provider
        }
      } else {
        return {
          success: false,
          error: result.error || 'Failed to generate chapter'
        }
      }
    } catch (error) {
      console.error('Error generating chapter:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Convert adventure book to our internal adventure format
   */
  convertToAdventure(adventureBook: AdventureBookResponse): any {
    return {
      id: adventureBook.id,
      title: adventureBook.title,
      description: adventureBook.description,
      author: 'Adventure Book Wizard',
      version: '1.0',
      createdAt: adventureBook.createdAt,
      updatedAt: adventureBook.createdAt,
      
      sections: [
        // Introduction section
        {
          id: `intro-${Date.now()}`,
          title: 'Introduction',
          content: `# ${adventureBook.title}\n\n${adventureBook.description}\n\n## Adventure Details\n- **Player Levels:** ${adventureBook.metadata.playerLevels}\n- **Party Size:** ${adventureBook.metadata.partySize}\n- **Duration:** ${adventureBook.metadata.duration}\n- **Setting:** ${adventureBook.metadata.setting}\n- **Theme:** ${adventureBook.metadata.theme}\n- **Tone:** ${adventureBook.metadata.tone}`,
          sectionType: 'introduction' as const,
          order: 0,
          statBlocks: [],
          readAloudText: '',
          dmNotes: 'Welcome to your adventure! Review the overview and prepare for an epic journey.'
        },
        
        // Convert chapters
        ...adventureBook.chapters.map((chapter, index) => ({
          id: chapter.id,
          title: chapter.title,
          content: chapter.content,
          sectionType: 'chapter' as const,
          order: index + 1,
          statBlocks: chapter.statBlocks.map(sb => sb.id),
          readAloudText: chapter.readAloudText,
          dmNotes: chapter.dmNotes
        })),
        
        // Convert appendices
        ...adventureBook.appendices.map((appendix, index) => ({
          id: appendix.id,
          title: appendix.title,
          content: appendix.content,
          sectionType: 'appendix' as const,
          order: adventureBook.chapters.length + index + 1,
          statBlocks: [],
          readAloudText: '',
          dmNotes: 'Reference material for the adventure.'
        }))
      ],
      
      // Convert stat blocks
      statBlocks: adventureBook.chapters.reduce((acc, chapter) => {
        chapter.statBlocks.forEach(statBlock => {
          acc[statBlock.id] = statBlock
        })
        return acc
      }, {} as any),
      
      // Metadata
      playerLevels: adventureBook.metadata.playerLevels,
      duration: adventureBook.metadata.duration,
      setting: adventureBook.metadata.setting,
      themes: [adventureBook.metadata.theme, adventureBook.metadata.tone],
      
      // Export settings
      exportFormat: 'html' as const,
      includeTableOfContents: true,
      includeAppendices: true
    }
  }

  /**
   * Generate pre-filled advice for common questions
   */
  getQuickAdvice(questionType: string, requirements: AdventureRequirements): string {
    const quickAdvice = {
      mainVillain: `Based on your ${requirements.theme} theme with a ${requirements.tone} tone, consider these villain types:
      
      1. **Corrupted Authority Figure** - A fallen paladin, corrupt noble, or twisted religious leader
      2. **Ancient Evil Awakening** - A long-dormant dragon, demon, or undead master
      3. **Misguided Zealot** - Someone with good intentions but terrible methods
      
      For ${requirements.setting} settings, consider local threats that fit the environment.`,
      
      majorLocations: `For a ${requirements.plotType} adventure in ${requirements.setting}, consider these location types:
      
      1. **Starting Hub** - A town, tavern, or safe area where the adventure begins
      2. **Dangerous Wilderness** - Forests, mountains, or wastelands with hidden dangers
      3. **Ancient Ruins** - Temples, castles, or dungeons with history and secrets
      4. **Urban Area** - A city with politics, intrigue, and diverse NPCs
      5. **Climactic Location** - The villain's stronghold or site of final confrontation
      
      Make each location unique with memorable features and NPCs.`,
      
      keyNPCs: `Your adventure needs a mix of helpful allies and interesting characters:
      
      1. **Quest Giver** - Someone who provides the initial hook and guidance
      2. **Mentor Figure** - An experienced ally who can offer advice and support
      3. **Rival/Foil** - A character who challenges the party but isn't evil
      4. **Mysterious Contact** - Someone with hidden knowledge or agenda
      5. **Local Authority** - A guard captain, mayor, or leader the party must work with
      
      Give each NPC distinct personality, goals, and secrets to make them memorable.`
    }
    
    return quickAdvice[questionType as keyof typeof quickAdvice] || 'Consider what would make this element most interesting for your players and story.'
  }
}

export const adventureBookService = new AdventureBookService()

// Export types for use in components
export type {
  AdventureRequirements,
  AdventureBookResponse,
  AdventureChapter,
  AdventureAppendix,
  Encounter,
  NPC,
  Location,
  Treasure,
  StatBlock,
  APIResponse
} 