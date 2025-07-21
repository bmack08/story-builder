interface CampaignConfig {
  partySize: number;
  tone: string;
  length: string;
  villainType: string;
  setting: string;
}

interface CampaignOutline {
  title: string;
  overview: string;
  chapters: ChapterOutline[];
  villainDetails: VillainDetails;
  settingDetails: SettingDetails;
  loreItems: LoreItem[];
}

interface ChapterOutline {
  id: string;
  title: string;
  description: string;
  level: number;
  estimatedSessions: number;
  keyNPCs: string[];
  keyLocations: string[];
  objectives: string[];
}

interface VillainDetails {
  name: string;
  description: string;
  motivation: string;
  methods: string[];
  weaknesses: string[];
  lieutenants: string[];
}

interface SettingDetails {
  name: string;
  description: string;
  atmosphere: string;
  keyLocations: Location[];
  culturalNotes: string[];
}

interface Location {
  name: string;
  type: 'city' | 'dungeon' | 'wilderness' | 'structure';
  description: string;
  importance: 'major' | 'minor';
}

interface LoreItem {
  id: string;
  category: 'rule' | 'fact' | 'relationship' | 'history';
  content: string;
  tags: string[];
}

class CampaignWizardService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate a campaign outline based on wizard configuration
   */
  async generateCampaignOutline(config: CampaignConfig): Promise<CampaignOutline> {
    try {
      const response = await fetch(`${this.baseUrl}/api/campaign/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Campaign generation failed: ${response.statusText}`);
      }

      const outline = await response.json();
      return outline;
    } catch (error) {
      console.error('Error generating campaign:', error);
      
      // Fallback to mock data for development
      return this.getMockCampaignOutline(config);
    }
  }

  /**
   * Generate additional content for existing campaign
   */
  async generateContent(
    campaignId: string, 
    type: 'chapter' | 'npc' | 'location' | 'item' | 'trap', 
    context: any
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/campaign/${campaignId}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, context }),
      });

      if (!response.ok) {
        throw new Error(`Content generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating content:', error);
      return this.getMockContent(type, context);
    }
  }

  /**
   * Check for lore consistency when adding new content
   */
  async checkLoreConsistency(content: string, existingLore: LoreItem[]): Promise<{
    isConsistent: boolean;
    conflicts: string[];
    suggestions: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/lore/check-consistency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, existingLore }),
      });

      if (!response.ok) {
        throw new Error(`Lore check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking lore consistency:', error);
      return {
        isConsistent: true,
        conflicts: [],
        suggestions: []
      };
    }
  }

  /**
   * Mock data for development - remove when backend is ready
   */
  private getMockCampaignOutline(config: CampaignConfig): CampaignOutline {
    const sessionCounts = {
      oneshot: 1,
      short: 4,
      medium: 10,
      long: 20
    };

    const chapters: ChapterOutline[] = [];
    const totalSessions = sessionCounts[config.length as keyof typeof sessionCounts] || 4;
    const numChapters = Math.min(Math.max(2, Math.ceil(totalSessions / 3)), 8);

    for (let i = 1; i <= numChapters; i++) {
      chapters.push({
        id: `chapter-${i}`,
        title: `Chapter ${i}: ${this.getChapterTitle(i, config)}`,
        description: `A pivotal chapter in the ${config.tone} adventure.`,
        level: Math.floor((i - 1) * 3) + 1,
        estimatedSessions: Math.ceil(totalSessions / numChapters),
        keyNPCs: [`NPC-${i}-1`, `NPC-${i}-2`],
        keyLocations: [`Location-${i}-1`],
        objectives: [`Objective ${i}.1`, `Objective ${i}.2`]
      });
    }

    return {
      title: `${this.getSettingName(config.setting)} ${this.getToneAdjective(config.tone)} Campaign`,
      overview: `A ${config.tone} adventure for ${config.partySize} players set in ${this.getSettingName(config.setting)}.`,
      chapters,
      villainDetails: {
        name: this.getVillainName(config.villainType),
        description: `A dangerous ${config.villainType} threatening the realm.`,
        motivation: this.getVillainMotivation(config.villainType),
        methods: [`Method 1`, `Method 2`],
        weaknesses: [`Weakness 1`],
        lieutenants: [`Lieutenant 1`, `Lieutenant 2`]
      },
      settingDetails: {
        name: this.getSettingName(config.setting),
        description: `A ${config.setting} setting perfect for ${config.tone} adventures.`,
        atmosphere: this.getSettingAtmosphere(config.setting, config.tone),
        keyLocations: [
          {
            name: 'Starting Town',
            type: 'city',
            description: 'Where the adventure begins',
            importance: 'major'
          }
        ],
        culturalNotes: ['Cultural note 1', 'Cultural note 2']
      },
      loreItems: [
        {
          id: 'lore-1',
          category: 'rule',
          content: 'Magic is common in this world',
          tags: ['magic', 'worldbuilding']
        }
      ]
    };
  }

  private getMockContent(type: string, context: any): any {
    const mockData = {
      chapter: {
        title: 'New Chapter',
        description: 'An exciting new chapter in the adventure',
        encounters: ['Encounter 1', 'Encounter 2']
      },
      npc: {
        name: 'Mysterious Stranger',
        description: 'A helpful NPC with secrets',
        stats: { level: 1, ac: 12, hp: 8 }
      },
      location: {
        name: 'Ancient Ruins',
        description: 'Crumbling stone halls filled with mystery',
        features: ['Hidden door', 'Magical fountain']
      },
      item: {
        name: 'Enchanted Blade',
        description: 'A sword that glows with inner light',
        rarity: 'uncommon'
      },
      trap: {
        name: 'Pressure Plate',
        description: 'A hidden mechanism that triggers darts',
        difficulty: 15
      }
    };

    return mockData[type as keyof typeof mockData] || { name: 'Unknown', description: 'Generic content' };
  }

  // Helper methods for mock data generation
  private getChapterTitle(chapterNum: number, config: CampaignConfig): string {
    const titles = {
      1: 'The Call to Adventure',
      2: 'Gathering Allies',
      3: 'The First Trial',
      4: 'Deeper Mysteries',
      5: 'The Turning Point',
      6: 'Race Against Time',
      7: 'Final Preparations',
      8: 'The Ultimate Confrontation'
    };
    return titles[chapterNum as keyof typeof titles] || `Chapter ${chapterNum}`;
  }

  private getSettingName(setting: string): string {
    const names = {
      classic: 'Aethermoor',
      desert: 'Sunspear Kingdoms',
      jungle: 'Verdant Empire',
      arctic: 'Frosthold',
      urban: 'Crown City',
      planar: 'The Shifting Realms'
    };
    return names[setting as keyof typeof names] || 'Unknown Realm';
  }

  private getToneAdjective(tone: string): string {
    const adjectives = {
      heroic: 'Heroic',
      gritty: 'Dark',
      comedic: 'Whimsical',
      horror: 'Gothic',
      political: 'Intrigue-filled'
    };
    return adjectives[tone as keyof typeof adjectives] || 'Epic';
  }

  private getVillainName(villainType: string): string {
    const names = {
      cultist: 'Malachar the Devoted',
      noble: 'Lord Blackthorne',
      dragon: 'Pyraxis the Ancient',
      undead: 'Lich King Mortis',
      aberration: 'The Whispering Eye',
      demon: 'Baal\'thuzad the Corrupted'
    };
    return names[villainType as keyof typeof names] || 'The Dark One';
  }

  private getVillainMotivation(villainType: string): string {
    const motivations = {
      cultist: 'To summon their dark deity into the world',
      noble: 'To seize the throne and rule with an iron fist',
      dragon: 'To reclaim ancient dragon territories',
      undead: 'To spread undeath across the living world',
      aberration: 'To bend reality to their alien will',
      demon: 'To corrupt souls and expand the Abyss'
    };
    return motivations[villainType as keyof typeof motivations] || 'Power and domination';
  }

  private getSettingAtmosphere(setting: string, tone: string): string {
    return `A ${tone} atmosphere with ${setting} influences creates a unique blend of mood and environment.`;
  }
}

// Singleton instance
export const campaignWizard = new CampaignWizardService();

// Export types for use in components
export type {
  CampaignConfig,
  CampaignOutline,
  ChapterOutline,
  VillainDetails,
  SettingDetails,
  Location,
  LoreItem
}; 