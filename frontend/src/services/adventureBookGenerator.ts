import { aiService } from './aiService'
import type { 
  AdventureBook, 
  AdventureChapter, 
  ChapterSection, 
  AdventureHook,
  NPCReference,
  MonsterReference,
  MagicItemReference,
  HandoutReference
} from '../components/editor/AdventureBookTemplate'

export interface AdventureBookRequirements {
  // Basic metadata
  title: string
  subtitle?: string
  author: string
  levelRange: string
  partySize: string
  duration: string
  setting: string
  theme: string
  tone: string
  
  // Story elements
  plotType: string
  mainVillain: string
  majorLocations: string[]
  keyNPCs: string[]
  
  // Adventure preferences
  includeElements: string[]
  difficultyPreference: string
  specialMechanics: string[]
  customRequests?: string
  inspirations?: string
  
  // Structure preferences
  numberOfChapters: number
  includeCampaignGuide: boolean
  includeHandouts: boolean
  includeCustomMonsters: boolean
  includeCustomMagicItems: boolean
}

export class AdventureBookGenerator {
  private static instance: AdventureBookGenerator
  
  public static getInstance(): AdventureBookGenerator {
    if (!AdventureBookGenerator.instance) {
      AdventureBookGenerator.instance = new AdventureBookGenerator()
    }
    return AdventureBookGenerator.instance
  }
  
  /**
   * Generate a complete adventure book based on requirements
   */
  public async generateAdventureBook(
    requirements: AdventureBookRequirements,
    onProgress?: (step: string, progress: number) => void
  ): Promise<AdventureBook> {
    try {
      onProgress?.('Generating adventure overview...', 10)
      
      // Step 1: Generate the overall adventure structure
      const adventureStructure = await this.generateAdventureStructure(requirements)
      
      onProgress?.('Creating adventure hooks...', 20)
      
      // Step 2: Generate adventure hooks
      const adventureHooks = await this.generateAdventureHooks(requirements, adventureStructure)
      
      onProgress?.('Generating chapters...', 30)
      
      // Step 3: Generate each chapter
      const chapters = await this.generateChapters(requirements, adventureStructure)
      
      onProgress?.('Creating NPCs and monsters...', 70)
      
      // Step 4: Generate appendices content
      const appendices = await this.generateAppendices(requirements, chapters)
      
      onProgress?.('Finalizing adventure book...', 90)
      
      // Step 5: Generate campaign guide (if requested)
      const campaignGuide = requirements.includeCampaignGuide 
        ? await this.generateCampaignGuide(requirements, adventureStructure)
        : undefined
      
      // Step 6: Assemble the complete adventure book
      const adventureBook: AdventureBook = {
        metadata: {
          title: requirements.title,
          subtitle: requirements.subtitle,
          author: requirements.author,
          version: '1.0',
          createdAt: new Date().toISOString(),
          levelRange: requirements.levelRange,
          partySize: requirements.partySize,
          duration: requirements.duration,
          setting: requirements.setting,
          theme: requirements.theme,
          tone: requirements.tone
        },
        introduction: {
          overview: adventureStructure.overview,
          adventureSummary: adventureStructure.summary,
          adventureHooks,
          backgroundInformation: adventureStructure.background,
          runningTheAdventure: adventureStructure.runningGuide,
          characterCreation: adventureStructure.characterCreation
        },
        chapters,
        appendices,
        campaignGuide
      }
      
      onProgress?.('Adventure book generated successfully!', 100)
      
      return adventureBook
      
    } catch (error) {
      console.error('Error generating adventure book:', error)
      throw new Error('Failed to generate adventure book. Please try again.')
    }
  }
  
  /**
   * Generate the overall adventure structure and outline
   */
  private async generateAdventureStructure(requirements: AdventureBookRequirements) {
    const prompt = `Generate the overall structure for a D&D 5e adventure with these requirements:
    
    Title: ${requirements.title}
    Level Range: ${requirements.levelRange}
    Party Size: ${requirements.partySize}
    Duration: ${requirements.duration}
    Theme: ${requirements.theme}
    Tone: ${requirements.tone}
    Setting: ${requirements.setting}
    Plot Type: ${requirements.plotType}
    Main Villain: ${requirements.mainVillain}
    Major Locations: ${requirements.majorLocations.join(', ')}
    Key NPCs: ${requirements.keyNPCs.join(', ')}
    
    Generate a comprehensive adventure structure that includes:
    - Overview (2-3 paragraphs describing the adventure)
    - Summary (1 paragraph plot summary)
    - Background information (the history and context)
    - Running the adventure guide (DM tips for this specific adventure)
    - Character creation notes (if relevant)
    - Chapter outline with titles and objectives
    
    Return as valid JSON with the structure:
    {
      "overview": "string",
      "summary": "string", 
      "background": "string",
      "runningGuide": "string",
      "characterCreation": "string",
      "chapterOutline": [
        {
          "number": 1,
          "title": "string",
          "objectives": ["string"],
          "summary": "string",
          "estimatedTime": "string",
          "levelRange": "string"
        }
      ]
    }`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are an expert D&D adventure designer creating professional adventure modules.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      maxTokens: 3000
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate adventure structure: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate adventure hooks
   */
  private async generateAdventureHooks(
    requirements: AdventureBookRequirements,
    structure: any
  ): Promise<AdventureHook[]> {
    const prompt = `Generate 4-6 different adventure hooks for this D&D adventure:
    
    Title: ${requirements.title}
    Theme: ${requirements.theme}
    Tone: ${requirements.tone}
    Setting: ${requirements.setting}
    Plot Summary: ${structure.summary}
    
    Each hook should:
    - Be suitable for different campaign types
    - Have clear integration instructions
    - Appeal to different player motivations
    - Fit the theme and tone
    
    Return as valid JSON array:
    [
      {
        "title": "Hook Title",
        "description": "Detailed description of the hook",
        "suitableFor": ["New campaigns", "Ongoing campaigns", "One-shots"],
        "integration": "How to integrate this hook into the adventure"
      }
    ]`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are an expert D&D adventure designer creating engaging adventure hooks.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      maxTokens: 2000
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate adventure hooks: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate all chapters for the adventure
   */
  private async generateChapters(
    requirements: AdventureBookRequirements,
    structure: any
  ): Promise<AdventureChapter[]> {
    const chapters: AdventureChapter[] = []
    
    for (const chapterOutline of structure.chapterOutline) {
      const chapter = await this.generateChapter(requirements, chapterOutline, structure)
      chapters.push(chapter)
    }
    
    return chapters
  }
  
  /**
   * Generate a single chapter
   */
  private async generateChapter(
    requirements: AdventureBookRequirements,
    chapterOutline: any,
    structure: any
  ): Promise<AdventureChapter> {
    const prompt = `Generate a complete D&D 5e adventure chapter with these specifications:
    
    Chapter ${chapterOutline.number}: ${chapterOutline.title}
    Objectives: ${chapterOutline.objectives.join(', ')}
    Summary: ${chapterOutline.summary}
    Level Range: ${chapterOutline.levelRange}
    Estimated Time: ${chapterOutline.estimatedTime}
    
    Adventure Context:
    - Theme: ${requirements.theme}
    - Tone: ${requirements.tone}
    - Setting: ${requirements.setting}
    - Main Villain: ${requirements.mainVillain}
    - Overall Plot: ${structure.summary}
    
    Generate a complete chapter with:
    - Overview paragraph
    - 3-6 sections (locations, encounters, social interactions, etc.)
    - Milestone achievements
    - DM guidance (pacing, common mistakes, alternatives, flow control)
    
    Each section should include:
    - Read-aloud text (if appropriate)
    - Detailed description
    - Features, creatures, treasure, secrets (as relevant)
    - Specific encounter details
    
    Return as valid JSON matching this structure:
    {
      "number": ${chapterOutline.number},
      "title": "${chapterOutline.title}",
      "summary": "${chapterOutline.summary}",
      "levelRange": "${chapterOutline.levelRange}",
      "estimatedTime": "${chapterOutline.estimatedTime}",
      "objectives": ${JSON.stringify(chapterOutline.objectives)},
      "overview": "string",
      "sections": [
        {
          "id": "section-1",
          "title": "Section Title",
          "type": "location|encounter|social|exploration|narrative",
          "readAloud": "Read-aloud text (optional)",
          "description": "Detailed description",
          "features": ["feature1", "feature2"],
          "creatures": [{"name": "Creature Name", "quantity": 1, "statBlock": null, "tactics": "tactics"}],
          "treasure": [{"name": "Treasure Name", "type": "coins", "value": 100, "description": "desc"}],
          "secrets": ["secret1"],
          "connections": ["connection1"],
          "encounters": [{"title": "Encounter", "difficulty": "medium", "xp": 200, "creatures": ["creature"], "tactics": "tactics"}],
          "areaNumber": "1"
        }
      ],
      "milestones": [
        {
          "trigger": "When players complete objective",
          "reward": "XP or story reward",
          "levelUp": false,
          "story": "Story significance"
        }
      ],
      "dmGuidance": {
        "pacing": "Pacing advice",
        "commonMistakes": ["mistake1", "mistake2"],
        "alternatives": ["alternative1", "alternative2"],
        "flowControl": "Flow control advice"
      }
    }`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are an expert D&D adventure designer creating professional adventure chapters with proper structure and formatting.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 4000
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate chapters: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate appendices content
   */
  private async generateAppendices(
    requirements: AdventureBookRequirements,
    chapters: AdventureChapter[]
  ) {
    // Extract all references from chapters
    const allNPCs: Set<string> = new Set()
    const allMonsters: Set<string> = new Set()
    const allMagicItems: Set<string> = new Set()
    
    chapters.forEach(chapter => {
      chapter.sections.forEach(section => {
        section.creatures?.forEach(creature => allMonsters.add(creature.name))
        section.treasure?.forEach(treasure => {
          if (treasure.type === 'magic') allMagicItems.add(treasure.name)
        })
        section.npcs?.forEach(npc => allNPCs.add(npc.name))
      })
    })
    
    // Generate custom content if requested
    const monsters: MonsterReference[] = []
    const npcs: NPCReference[] = []
    const magicItems: MagicItemReference[] = []
    const handouts: HandoutReference[] = []
    
    if (requirements.includeCustomMonsters) {
      for (const monsterName of allMonsters) {
        const monster = await this.generateMonsterReference(monsterName, requirements)
        monsters.push(monster)
      }
    }
    
    if (requirements.includeCustomMagicItems) {
      for (const itemName of allMagicItems) {
        const item = await this.generateMagicItemReference(itemName, requirements)
        magicItems.push(item)
      }
    }
    
    if (requirements.includeHandouts) {
      const generatedHandouts = await this.generateHandouts(requirements, chapters)
      handouts.push(...generatedHandouts)
    }
    
    return {
      npcs,
      monsters,
      magicItems,
      handouts,
      maps: [] // Maps would be generated separately
    }
  }
  
  /**
   * Generate monster reference
   */
  private async generateMonsterReference(
    monsterName: string,
    requirements: AdventureBookRequirements
  ): Promise<MonsterReference> {
    const prompt = `Generate a monster reference for "${monsterName}" in the context of:
    Theme: ${requirements.theme}
    Tone: ${requirements.tone}
    Setting: ${requirements.setting}
    
    Provide source information, tactics, and any modifications needed.
    
    Return as JSON:
    {
      "name": "${monsterName}",
      "page": "MM 123",
      "source": "Monster Manual",
      "modifications": ["modification1", "modification2"],
      "tactics": "Tactical advice",
      "environment": ["environment1", "environment2"]
    }`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are a D&D monster expert providing tactical advice and references.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      maxTokens: 800
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate appendices: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate magic item reference
   */
  private async generateMagicItemReference(
    itemName: string,
    requirements: AdventureBookRequirements
  ): Promise<MagicItemReference> {
    const response = await aiService.generateItem(
      `Create a magic item called "${itemName}" suitable for ${requirements.theme} theme and ${requirements.tone} tone`
    )
    
    if (response.success && response.data) {
      return {
        name: response.data.name,
        type: response.data.type,
        rarity: response.data.rarity,
        attunement: response.data.requiresAttunement,
        description: response.data.description,
        properties: response.data.magicalProperties || []
      }
    }
    
    throw new Error(`Failed to generate magic item: ${itemName}`)
  }
  
  /**
   * Generate handouts
   */
  private async generateHandouts(
    requirements: AdventureBookRequirements,
    chapters: AdventureChapter[]
  ): Promise<HandoutReference[]> {
    const prompt = `Generate 3-5 player handouts for this D&D adventure:
    
    Title: ${requirements.title}
    Theme: ${requirements.theme}
    Tone: ${requirements.tone}
    Setting: ${requirements.setting}
    
    Create handouts such as:
    - Letters or documents
    - Maps or diagrams
    - Riddles or puzzles
    - Images or illustrations
    - Clues or evidence
    
    Each handout should enhance the story and provide useful information to players.
    
    Return as JSON array:
    [
      {
        "title": "Handout Title",
        "type": "letter|map|document|image|riddle",
        "content": "Content to show players",
        "whenToUse": "When to give this to players",
        "notes": "DM notes about this handout"
      }
    ]`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are a D&D adventure designer creating engaging player handouts.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 2000
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate magic item reference: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate campaign guide
   */
  private async generateCampaignGuide(
    requirements: AdventureBookRequirements,
    structure: any
  ) {
    const prompt = `Generate a campaign guide for this D&D adventure:
    
    Title: ${requirements.title}
    Theme: ${requirements.theme}
    Setting: ${requirements.setting}
    Plot: ${structure.summary}
    
    Include:
    - What happens after the adventure ends
    - How to expand this into a longer campaign
    - Connections to other published adventures
    - Sequel hooks and continuing storylines
    
    Return as JSON:
    {
      "afterTheAdventure": "What happens after completion",
      "expansion": "How to expand into a campaign",
      "connections": "Connections to other adventures"
    }`
    
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: 'You are a D&D campaign expert providing guidance for long-term play.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1500
    })
    
    if (!response.success || !response.data) {
      throw new Error(`Failed to generate campaign guide: ${response.error || 'Unknown error'}`)
    }
    
    return JSON.parse(response.data)
  }
  
  /**
   * Generate a sample adventure book for testing
   */
  public generateSampleAdventureBook(): AdventureBook {
    return {
      metadata: {
        title: "The Cursed Mines of Shadowhollow",
        subtitle: "A Classic Dungeon Crawl",
        author: "AI Adventure Generator",
        version: "1.0",
        createdAt: new Date().toISOString(),
        levelRange: "1st-3rd level",
        partySize: "4-6 characters",
        duration: "4-6 hours",
        setting: "Forgotten Realms",
        theme: "Horror",
        tone: "Dark and Mysterious"
      },
      introduction: {
        overview: "The Cursed Mines of Shadowhollow is a classic dungeon crawl adventure designed for 1st to 3rd level characters. The party must investigate a mining operation that has gone silent, discovering an ancient evil that has been awakened by the miners' excavations.",
        adventureSummary: "When the prosperous mining town of Shadowhollow suddenly goes silent, the party is hired to investigate. They discover that the miners have uncovered an ancient burial chamber containing a powerful undead creature that has corrupted the entire mine system.",
        adventureHooks: [
          {
            title: "The Desperate Merchant",
            description: "A wealthy merchant who invested heavily in the Shadowhollow mines approaches the party, offering substantial payment to investigate why his shipments have stopped arriving.",
            suitableFor: ["New campaigns", "Ongoing campaigns"],
            integration: "This hook works well for parties motivated by gold and straightforward objectives."
          },
          {
            title: "The Missing Caravan",
            description: "A caravan carrying supplies to Shadowhollow has disappeared. The party is hired to find it and discover what happened to the mining settlement.",
            suitableFor: ["Ongoing campaigns", "One-shots"],
            integration: "Use this hook if the party has experience with missing person investigations."
          }
        ],
        backgroundInformation: "Shadowhollow was once a thriving mining town built around rich deposits of iron and silver. Three months ago, the miners broke through into a sealed chamber that had been hidden for centuries. Unknown to them, this chamber contained the tomb of an ancient necromancer whose spirit has now been released.",
        runningTheAdventure: "This adventure is designed as a classic dungeon crawl with horror elements. Emphasize the growing sense of dread as the party descends deeper into the mines. Use lighting and sound effects to create atmosphere."
      },
      chapters: [
        {
          number: 1,
          title: "The Silent Town",
          summary: "The party arrives at Shadowhollow to find it eerily quiet, with signs of recent habitation but no living souls.",
          levelRange: "1st level",
          estimatedTime: "1-2 hours",
          objectives: ["Investigate the town", "Find clues about what happened", "Locate the mine entrance"],
          overview: "This chapter serves as an introduction to the adventure, allowing the party to explore the abandoned town and gather clues about the mining operation.",
          sections: [
            {
              id: "shadowhollow-town",
              title: "The Abandoned Town",
              type: "location",
              readAloud: "As you crest the hill, Shadowhollow spreads before you—a collection of sturdy stone buildings nestled in a valley. Smoke should be rising from chimneys, but the town sits in eerie silence. No people move through the streets, and an unsettling stillness hangs over everything.",
              description: "The town shows signs of recent habitation but has been abandoned for several days. Meals sit half-eaten on tables, and personal belongings are scattered about as if people left in a hurry.",
              features: ["Abandoned buildings", "Mining equipment", "Empty streets"],
              creatures: [],
              treasure: [
                {
                  name: "Scattered Coins",
                  type: "coins",
                  value: 25,
                  description: "Various coins dropped in the hasty evacuation"
                }
              ],
              secrets: ["Hidden diary describing strange sounds from the mines"],
              connections: ["Path leads to the mine entrance"],
              areaNumber: "1"
            }
          ],
          milestones: [
            {
              trigger: "When the party discovers the mine entrance",
              reward: "100 XP per character",
              levelUp: false,
              story: "The party is ready to enter the dangerous mines"
            }
          ],
          dmGuidance: {
            pacing: "Allow players to explore at their own pace. Build tension gradually through empty buildings and scattered clues.",
            commonMistakes: ["Rushing players through the investigation", "Not emphasizing the eerie atmosphere"],
            alternatives: ["If players are hesitant, have them find a survivor who can provide information"],
            flowControl: "Use the discovery of the mine entrance as a natural transition to Chapter 2"
          }
        }
      ],
      appendices: {
        npcs: [],
        monsters: [
          {
            name: "Shadow Zombie",
            page: "MM 316",
            source: "Monster Manual",
            modifications: ["Vulnerable to radiant damage", "Necrotic aura"],
            tactics: "Move slowly but relentlessly toward living creatures",
            environment: ["Underground mines", "Dark passages"]
          }
        ],
        magicItems: [
          {
            name: "Miner's Lantern of Revealing",
            type: "Wondrous item",
            rarity: "uncommon",
            attunement: false,
            description: "This sturdy lantern was enchanted by the miners to help them navigate dangerous passages.",
            properties: ["Sheds bright light in 30-foot radius", "Reveals hidden doors and traps within the light"]
          }
        ],
        handouts: [
          {
            title: "Miner's Journal",
            type: "document",
            content: "Day 47: We broke through into something... old. The foreman wants to keep digging but the sounds coming from below aren't natural. Marcus refuses to go back down after what he saw in the shadows.",
            whenToUse: "When players investigate the mining office",
            notes: "This provides the first hint about the supernatural threat"
          }
        ],
        maps: []
      }
    }
  }
}

// Export singleton instance
export const adventureBookGenerator = AdventureBookGenerator.getInstance() 