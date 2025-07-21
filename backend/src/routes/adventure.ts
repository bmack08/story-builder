import { Router } from 'express';
import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

const router = Router();

interface AdventureRequirements {
  // Basic Adventure Info
  title: string;
  description: string;
  theme: string;
  tone: string;
  
  // Campaign Details
  playerLevels: string;
  partySize: number;
  duration: string;
  setting: string;
  
  // Story Structure
  plotType: string;
  mainVillain: string;
  majorLocations: string[];
  keyNPCs: string[];
  
  // Adventure Elements
  includeElements: string[];
  difficultyPreference: string;
  specialMechanics: string[];
  
  // Customization
  customRequests: string;
  inspirations: string;
}

interface AdventureBookResponse {
  id: string;
  title: string;
  description: string;
  metadata: {
    playerLevels: string;
    partySize: number;
    duration: string;
    setting: string;
    theme: string;
    tone: string;
  };
  chapters: AdventureChapter[];
  appendices: AdventureAppendix[];
  createdAt: string;
}

interface AdventureChapter {
  id: string;
  title: string;
  order: number;
  content: string;
  readAloudText: string;
  dmNotes: string;
  encounters: Encounter[];
  npcs: NPC[];
  locations: Location[];
  treasures: Treasure[];
  statBlocks: StatBlock[];
}

interface AdventureAppendix {
  id: string;
  title: string;
  type: 'monsters' | 'npcs' | 'items' | 'handouts' | 'maps' | 'tables';
  content: string;
  data: any;
}

interface Encounter {
  id: string;
  name: string;
  type: 'combat' | 'social' | 'exploration' | 'puzzle';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  xpBudget: number;
  creatures: any[];
  environment: string;
  tactics: string;
}

interface NPC {
  id: string;
  name: string;
  race: string;
  class?: string;
  background?: string;
  appearance: string;
  personality: string;
  goals: string;
  secrets?: string;
  statBlock?: any;
}

interface Location {
  id: string;
  name: string;
  type: 'settlement' | 'dungeon' | 'wilderness' | 'landmark';
  description: string;
  features: string[];
  encounters: string[];
  secrets?: string;
}

interface Treasure {
  id: string;
  name: string;
  type: 'mundane' | 'magic' | 'artifact';
  rarity?: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
  description: string;
  value?: number;
  properties?: string[];
}

interface StatBlock {
  id: string;
  name: string;
  type: 'monster' | 'npc';
  data: any;
}

// Generate AI advice for specific questions
router.post('/advice', async (req: Request, res: Response) => {
  try {
    const { question, context, currentRequirements } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    const advice = await generateAIAdvice(question, context, currentRequirements);
    
    res.json({
      success: true,
      advice,
      provider: 'openai'
    });
  } catch (error) {
    console.error('Error generating AI advice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI advice'
    });
  }
});

// Generate complete adventure book
router.post('/generate-book', async (req: Request, res: Response) => {
  try {
    const requirements: AdventureRequirements = req.body;

    if (!requirements.title || !requirements.description || !requirements.theme) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and theme are required'
      });
    }

    const adventureBook = await generateAdventureBook(requirements);
    
    res.json({
      success: true,
      adventure: adventureBook,
      provider: 'openai'
    });
  } catch (error) {
    console.error('Error generating adventure book:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate adventure book'
    });
  }
});

// Generate specific chapter content
router.post('/generate-chapter', async (req: Request, res: Response) => {
  try {
    const { chapterTitle, chapterType, context, requirements } = req.body;

    if (!chapterTitle || !chapterType) {
      return res.status(400).json({
        success: false,
        error: 'Chapter title and type are required'
      });
    }

    const chapter = await generateChapterContent(chapterTitle, chapterType, context, requirements);
    
    res.json({
      success: true,
      chapter,
      provider: 'openai'
    });
  } catch (error) {
    console.error('Error generating chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate chapter'
    });
  }
});

// Helper function to generate AI advice
async function generateAIAdvice(question: string, context: any, requirements: AdventureRequirements): Promise<string> {
  const systemPrompt = `You are a professional D&D adventure designer and DM with extensive experience creating engaging campaigns. 
  You are helping a user plan their adventure by providing specific, actionable advice.
  
  Current adventure context:
  - Title: ${requirements.title || 'Not specified'}
  - Theme: ${requirements.theme || 'Not specified'}
  - Tone: ${requirements.tone || 'Not specified'}
  - Setting: ${requirements.setting || 'Not specified'}
  - Player Levels: ${requirements.playerLevels || 'Not specified'}
  - Duration: ${requirements.duration || 'Not specified'}
  
  Provide specific, creative suggestions that fit the adventure concept. Be concise but detailed.
  Include 2-3 specific examples or options when possible.`;

  const userPrompt = `Question: ${question}
  
  ${context ? `Additional context: ${context}` : ''}
  
  Please provide specific, actionable advice that fits the adventure concept.`;

  try {
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      maxTokens: 400
    });

    return response.content;
  } catch (error) {
    console.error('Error in AI advice generation:', error);
    return 'I apologize, but I\'m having trouble generating advice right now. Please try again.';
  }
}

// Helper function to generate complete adventure book
async function generateAdventureBook(requirements: AdventureRequirements): Promise<AdventureBookResponse> {
  const systemPrompt = `You are a professional D&D 5e adventure designer creating a complete adventure book.
  
  Follow these principles from official D&D 5e adventures:
  1. Clear chapter structure with introduction, rising action, climax, and resolution
  2. Include boxed read-aloud text for atmosphere
  3. Provide DM notes and guidance
  4. Balance encounters for the specified party level and size
  5. Include memorable NPCs with clear motivations
  6. Create interesting locations with secrets and features
  7. Maintain consistent tone and theme throughout
  8. Include appropriate treasures and rewards
  9. Provide multiple adventure hooks and optional content
  10. Support different play styles (combat, roleplay, exploration)
  
  Generate a complete adventure book structure with 5-7 chapters plus appendices.
  Return valid JSON matching the AdventureBookResponse interface.`;

  const userPrompt = `Create a complete D&D 5e adventure book based on these requirements:

  **Basic Info:**
  - Title: ${requirements.title}
  - Description: ${requirements.description}
  - Theme: ${requirements.theme}
  - Tone: ${requirements.tone}
  
  **Campaign Details:**
  - Player Levels: ${requirements.playerLevels}
  - Party Size: ${requirements.partySize}
  - Duration: ${requirements.duration}
  - Setting: ${requirements.setting}
  
  **Story Structure:**
  - Plot Type: ${requirements.plotType}
  - Main Villain: ${requirements.mainVillain}
  - Major Locations: ${requirements.majorLocations.join(', ')}
  - Key NPCs: ${requirements.keyNPCs.join(', ')}
  
  **Adventure Elements:**
  - Include: ${requirements.includeElements.join(', ')}
  - Difficulty: ${requirements.difficultyPreference}
  - Special Mechanics: ${requirements.specialMechanics.join(', ')}
  
  **Customization:**
  - Custom Requests: ${requirements.customRequests}
  - Inspirations: ${requirements.inspirations}
  
  Generate the complete adventure book with proper D&D 5e formatting and structure.`;

  try {
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      maxTokens: 4000
    });

    const adventureBook = JSON.parse(response.content);
    
    // Add generated metadata
    adventureBook.id = `adventure-${Date.now()}`;
    adventureBook.createdAt = new Date().toISOString();
    
    return adventureBook;
  } catch (error) {
    console.error('Error generating adventure book:', error);
    
    // Return fallback structure if AI fails
    return createFallbackAdventureBook(requirements);
  }
}

// Helper function to generate specific chapter content
async function generateChapterContent(
  title: string, 
  type: string, 
  context: any, 
  requirements: AdventureRequirements
): Promise<AdventureChapter> {
  const systemPrompt = `You are a professional D&D 5e adventure designer creating a specific chapter.
  
  Follow D&D 5e conventions:
  - Include compelling read-aloud text
  - Provide clear DM guidance
  - Balance encounters appropriately
  - Include interesting NPCs and locations
  - Maintain the adventure's tone and theme
  - Provide tactical notes for encounters
  
  Return valid JSON matching the AdventureChapter interface.`;

  const userPrompt = `Create a D&D 5e adventure chapter with these specifications:

  **Chapter Details:**
  - Title: ${title}
  - Type: ${type}
  - Context: ${JSON.stringify(context)}
  
  **Adventure Requirements:**
  - Theme: ${requirements.theme}
  - Tone: ${requirements.tone}
  - Player Levels: ${requirements.playerLevels}
  - Party Size: ${requirements.partySize}
  - Setting: ${requirements.setting}
  
  Generate a complete chapter with encounters, NPCs, locations, and appropriate content.`;

  try {
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      maxTokens: 2000
    });

    const chapter = JSON.parse(response.content);
    chapter.id = `chapter-${Date.now()}`;
    
    return chapter;
  } catch (error) {
    console.error('Error generating chapter:', error);
    
    // Return fallback chapter
    return createFallbackChapter(title, type, requirements);
  }
}

// Fallback adventure book structure
function createFallbackAdventureBook(requirements: AdventureRequirements): AdventureBookResponse {
  return {
    id: `adventure-${Date.now()}`,
    title: requirements.title,
    description: requirements.description,
    metadata: {
      playerLevels: requirements.playerLevels,
      partySize: requirements.partySize,
      duration: requirements.duration,
      setting: requirements.setting,
      theme: requirements.theme,
      tone: requirements.tone
    },
    chapters: [
      {
        id: `chapter-intro-${Date.now()}`,
        title: 'Introduction',
        order: 0,
        content: 'Adventure introduction and background...',
        readAloudText: 'Welcome to your adventure...',
        dmNotes: 'This chapter provides the setup for your adventure.',
        encounters: [],
        npcs: [],
        locations: [],
        treasures: [],
        statBlocks: []
      },
      {
        id: `chapter-1-${Date.now()}`,
        title: 'Chapter 1: The Beginning',
        order: 1,
        content: 'The adventure begins...',
        readAloudText: 'Your adventure starts here...',
        dmNotes: 'Chapter 1 sets the tone and introduces the main conflict.',
        encounters: [],
        npcs: [],
        locations: [],
        treasures: [],
        statBlocks: []
      }
    ],
    appendices: [],
    createdAt: new Date().toISOString()
  };
}

// Fallback chapter structure
function createFallbackChapter(title: string, type: string, requirements: AdventureRequirements): AdventureChapter {
  return {
    id: `chapter-${Date.now()}`,
    title: title,
    order: 0,
    content: `This is a ${type} chapter for your ${requirements.theme} adventure.`,
    readAloudText: `You can read this aloud to your players...`,
    dmNotes: `DM notes for running this chapter...`,
    encounters: [],
    npcs: [],
    locations: [],
    treasures: [],
    statBlocks: []
  };
}

export { router as adventureRouter }; 