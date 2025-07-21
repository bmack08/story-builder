from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import json

@dataclass
class CampaignConfig:
    party_size: int
    tone: str
    length: str
    villain_type: str
    setting: str

@dataclass
class LoreItem:
    id: str
    category: str
    content: str
    tags: List[str]

class PromptBuilder:
    """
    Builds structured prompts for OpenAI API calls based on campaign parameters
    and maintains lore consistency across generations.
    """
    
    def __init__(self):
        self.base_system_prompt = """You are an expert D&D Dungeon Master and campaign creator. 
You specialize in creating immersive, balanced, and lore-consistent campaigns.
Always respond with well-structured JSON that matches the requested schema.
Focus on practical, actionable content that DMs can immediately use."""

    def build_campaign_generation_prompt(self, config: CampaignConfig) -> Dict[str, Any]:
        """Generate the main campaign outline prompt"""
        
        tone_guidance = self._get_tone_guidance(config.tone)
        length_guidance = self._get_length_guidance(config.length)
        villain_guidance = self._get_villain_guidance(config.villain_type)
        setting_guidance = self._get_setting_guidance(config.setting)
        
        user_prompt = f"""Create a D&D campaign outline with the following specifications:

**Campaign Parameters:**
- Party Size: {config.party_size} players
- Tone: {config.tone} ({tone_guidance})  
- Length: {config.length} ({length_guidance})
- Main Villain: {config.villain_type} ({villain_guidance})
- Setting: {config.setting} ({setting_guidance})

**Requirements:**
1. Create a compelling campaign title and overview
2. Design {self._get_chapter_count(config.length)} chapters with clear progression
3. Each chapter should have level recommendations, estimated sessions, and key objectives
4. Develop a detailed main villain with motivations, methods, and weaknesses
5. Create rich setting details with key locations and cultural notes
6. Establish foundational lore items that maintain consistency

**Response Format (JSON):**
{{
  "title": "Campaign Title",
  "overview": "2-3 sentence campaign summary",
  "chapters": [
    {{
      "id": "chapter-1",
      "title": "Chapter Title",
      "description": "Detailed chapter description",
      "level": 1,
      "estimatedSessions": 2,
      "keyNPCs": ["NPC Name 1", "NPC Name 2"],
      "keyLocations": ["Location 1", "Location 2"],
      "objectives": ["Objective 1", "Objective 2"]
    }}
  ],
  "villainDetails": {{
    "name": "Villain Name",
    "description": "Physical description and personality",
    "motivation": "Core driving motivation",
    "methods": ["Method 1", "Method 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "lieutenants": ["Lieutenant 1", "Lieutenant 2"]
  }},
  "settingDetails": {{
    "name": "Setting Name",
    "description": "Setting overview",
    "atmosphere": "Atmospheric description",
    "keyLocations": [
      {{
        "name": "Location Name",
        "type": "city|dungeon|wilderness|structure",
        "description": "Location description",
        "importance": "major|minor"
      }}
    ],
    "culturalNotes": ["Cultural detail 1", "Cultural detail 2"]
  }},
  "loreItems": [
    {{
      "id": "lore-1",
      "category": "rule|fact|relationship|history",
      "content": "Lore content",
      "tags": ["tag1", "tag2"]
    }}
  ]
}}

Focus on creating memorable, interconnected content that builds naturally toward the final confrontation."""

        return {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": self.base_system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.8,
            "max_tokens": 3000
        }

    def build_content_generation_prompt(
        self, 
        content_type: str, 
        context: Dict[str, Any],
        existing_lore: Optional[List[LoreItem]] = None
    ) -> Dict[str, Any]:
        """Generate prompts for specific content types (NPCs, locations, etc.)"""
        
        lore_context = ""
        if existing_lore:
            lore_context = f"\n**Existing Lore (maintain consistency):**\n"
            for lore in existing_lore:
                lore_context += f"- {lore.content}\n"

        content_prompts = {
            "chapter": self._build_chapter_prompt(context, lore_context),
            "npc": self._build_npc_prompt(context, lore_context),
            "location": self._build_location_prompt(context, lore_context),
            "item": self._build_item_prompt(context, lore_context),
            "trap": self._build_trap_prompt(context, lore_context)
        }

        user_prompt = content_prompts.get(content_type, "Generate generic D&D content.")

        return {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": self.base_system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1500
        }

    def build_lore_consistency_prompt(
        self, 
        new_content: str, 
        existing_lore: List[LoreItem]
    ) -> Dict[str, Any]:
        """Check if new content conflicts with existing lore"""
        
        lore_list = "\n".join([f"- {lore.content}" for lore in existing_lore])
        
        user_prompt = f"""Analyze the following new content for consistency with existing campaign lore:

**New Content:**
{new_content}

**Existing Lore:**
{lore_list}

**Task:**
Check for any contradictions, inconsistencies, or conflicts between the new content and existing lore.

**Response Format (JSON):**
{{
  "isConsistent": true/false,
  "conflicts": ["Specific conflict description 1", "Specific conflict description 2"],
  "suggestions": ["Suggestion to resolve conflict 1", "Suggestion to resolve conflict 2"]
}}

Be thorough but practical - minor stylistic differences are not conflicts."""

        return {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": self.base_system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 800
        }

    # Helper methods for building specific content prompts
    def _build_chapter_prompt(self, context: Dict[str, Any], lore_context: str) -> str:
        return f"""Create a detailed D&D chapter with the following context:
{json.dumps(context, indent=2)}
{lore_context}

Include encounters, story hooks, and clear progression to the next chapter.
Respond in JSON format with title, description, encounters, and story_hooks fields."""

    def _build_npc_prompt(self, context: Dict[str, Any], lore_context: str) -> str:
        return f"""Create a compelling D&D NPC with the following context:
{json.dumps(context, indent=2)}
{lore_context}

Include personality, background, stats, and potential plot connections.
Respond in JSON format with name, description, personality, background, stats, and plot_hooks fields."""

    def _build_location_prompt(self, context: Dict[str, Any], lore_context: str) -> str:
        return f"""Create an interesting D&D location with the following context:
{json.dumps(context, indent=2)}
{lore_context}

Include atmosphere, key features, potential encounters, and secrets.
Respond in JSON format with name, description, atmosphere, features, encounters, and secrets fields."""

    def _build_item_prompt(self, context: Dict[str, Any], lore_context: str) -> str:
        return f"""Create a balanced D&D magic item with the following context:
{json.dumps(context, indent=2)}
{lore_context}

Include mechanical effects, lore, and attunement requirements if applicable.
Respond in JSON format with name, description, rarity, properties, and lore fields."""

    def _build_trap_prompt(self, context: Dict[str, Any], lore_context: str) -> str:
        return f"""Create a creative D&D trap with the following context:
{json.dumps(context, indent=2)}
{lore_context}

Include trigger, effect, detection/disarm DCs, and countermeasures.
Respond in JSON format with name, description, trigger, effect, detection_dc, disarm_dc, and countermeasures fields."""

    # Configuration guidance methods
    def _get_tone_guidance(self, tone: str) -> str:
        guidance = {
            "heroic": "Classic fantasy with clear good vs evil, heroic deeds, and noble quests",
            "gritty": "Morally gray world with harsh realities, difficult choices, and consequences",
            "comedic": "Light-hearted adventure with humor, quirky NPCs, and amusing situations",
            "horror": "Dark atmosphere with scary elements, psychological tension, and dread",
            "political": "Complex schemes, court intrigue, social maneuvering, and power plays"
        }
        return guidance.get(tone, "Balanced adventure tone")

    def _get_length_guidance(self, length: str) -> str:
        guidance = {
            "oneshot": "Single session adventure with tight pacing and clear resolution",
            "short": "3-6 sessions focusing on a specific threat or mystery",
            "medium": "7-15 sessions with multiple story arcs and character development",
            "long": "16+ sessions with epic scope, major world events, and deep lore"
        }
        return guidance.get(length, "Standard campaign length")

    def _get_villain_guidance(self, villain_type: str) -> str:
        guidance = {
            "cultist": "Religious fanatic leading a dangerous cult with otherworldly goals",
            "noble": "Corrupt aristocrat using political power for personal gain",
            "dragon": "Ancient wyrm with vast power, intelligence, and long-term schemes",
            "undead": "Undead mastermind seeking to expand the realm of death",
            "aberration": "Alien entity with incomprehensible motivations and reality-warping power",
            "demon": "Fiendish being seeking to corrupt and destroy the material plane"
        }
        return guidance.get(villain_type, "Threatening antagonist")

    def _get_setting_guidance(self, setting: str) -> str:
        guidance = {
            "classic": "Medieval European fantasy with castles, forests, and traditional tropes",
            "desert": "Arabian-inspired setting with oases, sand magic, and tribal conflicts",
            "jungle": "Tropical environment with ancient ruins, dangerous wildlife, and lost civilizations",
            "arctic": "Harsh northern wilderness with survival challenges and isolation",
            "urban": "City-focused adventure with politics, crime, and social intrigue",
            "planar": "Multiverse-spanning adventure across different planes of existence"
        }
        return guidance.get(setting, "Fantasy adventure setting")

    def _get_chapter_count(self, length: str) -> int:
        counts = {
            "oneshot": 1,
            "short": 3,
            "medium": 6,
            "long": 8
        }
        return counts.get(length, 4) 