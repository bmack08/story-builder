# D&D Adventure Creator

A comprehensive tool for creating professional D&D adventures with official formatting and campaign management features.

## Features

### 🏰 Adventure Bible
A comprehensive campaign management system that helps you organize and track all elements of your D&D campaign:

- **Characters**: Track NPCs, their personalities, appearances, and roles
- **Locations**: Manage cities, dungeons, and wilderness areas
- **Items**: Catalog magic items, equipment, and treasures
- **Lore & History**: Document world-building elements and backstories
- **Organizations**: Track guilds, factions, and political groups
- **Quests**: Manage objectives, rewards, and quest progression

### 📜 D&D Content Templates
Professional templates following official D&D 5e formatting standards:

#### Monster Templates
- **Basic Monster**: Standard stat blocks with AC, HP, abilities, and actions
- **Spellcaster Monster**: Monsters with full spellcasting abilities and spell lists

#### NPC Templates
- **Basic NPC**: Non-combat characters with personality traits, ideals, bonds, and flaws
- Includes appearance descriptions and roleplay information

#### Item Templates
- **Magic Item**: Properly formatted magic items with rarity, attunement requirements, and properties
- **Mundane Item**: Regular equipment and adventuring gear

#### Encounter Templates
- **Combat Encounter**: Tactical encounters with XP budgets, enemy tactics, and environmental factors
- **Social Encounter**: Roleplay encounters with NPC motivations and skill challenges

#### Trap Templates
- **Mechanical Trap**: Physical traps with detection DCs and disarm procedures
- **Magic Trap**: Spell-based traps with magical effects

#### Location Templates
- **Dungeon Room**: Detailed room descriptions with read-aloud text and interactive elements
- **Settlement**: Towns and cities with demographics, notable locations, and NPCs

#### Shop Templates
- **Shop/Business**: Complete shops with proprietors, inventory, and services

#### Quest Templates
- **Quest/Mission**: Structured quests with objectives, challenges, and rewards

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the `dnd-adventure-creator` directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Usage

### Creating Adventures
1. Open the application and start with a new adventure
2. Use the rich text editor to write your adventure content
3. Click "D&D Templates" to see available official content templates
4. Click "Adventure Bible" to manage campaign elements

### Adventure Bible
- Click the "Adventure Bible" button to open the campaign management interface
- Use tabs to navigate between different content categories
- Click "Add New" to create entries in each category
- Edit or delete existing entries using the action buttons

### D&D Templates
- Click "D&D Templates" to see all available templates
- Templates follow official D&D 5e formatting standards
- Each template includes proper stat blocks, formatting, and structure
- Templates cover all major content types: monsters, NPCs, items, encounters, traps, locations, shops, and quests

## Official D&D Formatting

All templates follow the official Wizards of the Coast formatting guidelines:

- **Monster Stat Blocks**: Include proper AC, HP, speed, ability scores, skills, senses, languages, and challenge ratings
- **Spell Formatting**: Proper spell level notation and save DC formatting
- **Item Descriptions**: Correct rarity classifications and attunement requirements
- **Encounter Design**: XP budgeting and tactical considerations
- **Location Descriptions**: Read-aloud text separated from DM information

## Technology Stack

- **Frontend**: React + TypeScript
- **UI Library**: Chakra UI
- **Rich Text Editor**: TipTap
- **Icons**: React Icons (Font Awesome)
- **Build Tool**: Vite

## Project Structure

```
dnd-adventure-creator/
├── src/
│   ├── components/
│   │   ├── campaign/
│   │   │   └── AdventureBible.tsx      # Campaign management interface
│   │   └── editor/
│   │       ├── EditorPage.tsx          # Main editor interface
│   │       ├── RichTextEditor.tsx      # Text editing component
│   │       └── DnDContentTemplates.tsx # D&D content templates
│   ├── theme/
│   │   └── theme.ts                    # Chakra UI theme configuration
│   └── App.tsx                         # Main application component
└── README.md
```

## Features in Development

- Template insertion directly into the editor
- Adventure export (PDF, HTML)
- Campaign sharing and collaboration
- Advanced search and filtering in Adventure Bible
- Integration with D&D Beyond API
- Dice rolling integration
- Initiative tracker

## Contributing

This project follows official D&D 5e formatting standards. When contributing new templates or features, please ensure they align with Wizards of the Coast guidelines.

## License

This project is for educational and personal use. D&D content and formatting standards are property of Wizards of the Coast.

---

**Note**: This tool is designed to help DMs create professional-quality adventures while respecting official D&D formatting standards. All content templates follow the style guide used in official D&D publications. 