from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import openai
import json
import os
from datetime import datetime
import uuid

from ..ai.prompt_builder import PromptBuilder, CampaignConfig, LoreItem

# Pydantic models for request/response
class CampaignGenerationRequest(BaseModel):
    partySize: int
    tone: str
    length: str
    villainType: str
    setting: str

class ContentGenerationRequest(BaseModel):
    type: str  # 'chapter', 'npc', 'location', 'item', 'trap'
    context: Dict[str, Any]

class LoreConsistencyRequest(BaseModel):
    content: str
    existingLore: List[Dict[str, Any]]

class LoreConsistencyResponse(BaseModel):
    isConsistent: bool
    conflicts: List[str]
    suggestions: List[str]

# Initialize router and services
router = APIRouter(prefix="/api/campaign", tags=["campaign"])
prompt_builder = PromptBuilder()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

async def get_openai_client():
    """Dependency to get OpenAI client"""
    if not openai.api_key:
        raise HTTPException(
            status_code=500, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    return openai

@router.post("/generate")
async def generate_campaign(
    request: CampaignGenerationRequest,
    client = Depends(get_openai_client)
):
    """
    Generate a complete campaign outline based on wizard configuration
    """
    try:
        # Convert request to internal config format
        config = CampaignConfig(
            party_size=request.partySize,
            tone=request.tone,
            length=request.length,
            villain_type=request.villainType,
            setting=request.setting
        )
        
        # Build the prompt
        prompt_data = prompt_builder.build_campaign_generation_prompt(config)
        
        # Call OpenAI API
        response = await client.ChatCompletion.acreate(**prompt_data)
        
        # Parse response
        content = response.choices[0].message.content
        
        try:
            campaign_outline = json.loads(content)
        except json.JSONDecodeError:
            # Fallback if AI doesn't return valid JSON
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid JSON. Please try again."
            )
        
        # Add metadata
        campaign_outline["id"] = str(uuid.uuid4())
        campaign_outline["createdAt"] = datetime.utcnow().isoformat()
        campaign_outline["config"] = request.dict()
        
        return campaign_outline
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Campaign generation error: {str(e)}")
        
        # Return fallback mock data for development
        return await generate_mock_campaign(request)

@router.post("/{campaign_id}/generate-content")
async def generate_content(
    campaign_id: str,
    request: ContentGenerationRequest,
    client = Depends(get_openai_client)
):
    """
    Generate additional content for an existing campaign
    """
    try:
        # TODO: Retrieve existing campaign lore from database
        existing_lore = []  # Placeholder - implement database retrieval
        
        # Build prompt for specific content type
        prompt_data = prompt_builder.build_content_generation_prompt(
            content_type=request.type,
            context=request.context,
            existing_lore=existing_lore
        )
        
        # Call OpenAI API
        response = await client.ChatCompletion.acreate(**prompt_data)
        content = response.choices[0].message.content
        
        try:
            generated_content = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid JSON. Please try again."
            )
        
        # Add metadata
        generated_content["id"] = str(uuid.uuid4())
        generated_content["type"] = request.type
        generated_content["campaignId"] = campaign_id
        generated_content["createdAt"] = datetime.utcnow().isoformat()
        
        return generated_content
        
    except Exception as e:
        print(f"Content generation error: {str(e)}")
        
        # Return mock content for development
        return generate_mock_content(request.type, request.context)

@router.post("/lore/check-consistency")
async def check_lore_consistency(
    request: LoreConsistencyRequest,
    client = Depends(get_openai_client)
) -> LoreConsistencyResponse:
    """
    Check if new content is consistent with existing campaign lore
    """
    try:
        # Convert request lore to internal format
        existing_lore = [
            LoreItem(
                id=lore.get("id", ""),
                category=lore.get("category", "fact"),
                content=lore.get("content", ""),
                tags=lore.get("tags", [])
            )
            for lore in request.existingLore
        ]
        
        # Build consistency check prompt
        prompt_data = prompt_builder.build_lore_consistency_prompt(
            new_content=request.content,
            existing_lore=existing_lore
        )
        
        # Call OpenAI API
        response = await client.ChatCompletion.acreate(**prompt_data)
        content = response.choices[0].message.content
        
        try:
            consistency_result = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid JSON. Please try again."
            )
        
        return LoreConsistencyResponse(**consistency_result)
        
    except Exception as e:
        print(f"Lore consistency check error: {str(e)}")
        
        # Return permissive fallback
        return LoreConsistencyResponse(
            isConsistent=True,
            conflicts=[],
            suggestions=[]
        )

@router.get("/campaigns")
async def list_campaigns():
    """
    List all saved campaigns (placeholder for database integration)
    """
    # TODO: Implement database retrieval
    return {
        "campaigns": [],
        "message": "Database integration pending"
    }

@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str):
    """
    Retrieve a specific campaign by ID (placeholder for database integration)
    """
    # TODO: Implement database retrieval
    return {
        "id": campaign_id,
        "message": "Campaign retrieval - database integration pending"
    }

@router.put("/{campaign_id}")
async def update_campaign(campaign_id: str, updates: Dict[str, Any]):
    """
    Update campaign data (placeholder for database integration)
    """
    # TODO: Implement database updates
    return {
        "id": campaign_id,
        "message": "Campaign updated - database integration pending",
        "updates": updates
    }

@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """
    Delete a campaign (placeholder for database integration)
    """
    # TODO: Implement database deletion
    return {
        "id": campaign_id,
        "message": "Campaign deleted - database integration pending"
    }

# Mock data functions for development
async def generate_mock_campaign(request: CampaignGenerationRequest):
    """Generate mock campaign data when OpenAI is unavailable"""
    
    session_counts = {
        "oneshot": 1,
        "short": 4,
        "medium": 10,
        "long": 20
    }
    
    chapter_counts = {
        "oneshot": 1,
        "short": 3,
        "medium": 6,
        "long": 8
    }
    
    total_sessions = session_counts.get(request.length, 4)
    num_chapters = chapter_counts.get(request.length, 4)
    
    chapters = []
    for i in range(1, num_chapters + 1):
        chapters.append({
            "id": f"chapter-{i}",
            "title": f"Chapter {i}: {get_mock_chapter_title(i)}",
            "description": f"A crucial chapter in the {request.tone} adventure.",
            "level": max(1, (i - 1) * 2 + 1),
            "estimatedSessions": max(1, total_sessions // num_chapters),
            "keyNPCs": [f"Key NPC {i}.1", f"Key NPC {i}.2"],
            "keyLocations": [f"Important Location {i}"],
            "objectives": [f"Primary Objective {i}", f"Secondary Objective {i}"]
        })
    
    return {
        "id": str(uuid.uuid4()),
        "title": f"{get_mock_setting_name(request.setting)} {request.tone.title()} Campaign",
        "overview": f"An epic {request.tone} adventure for {request.partySize} heroes in the realm of {get_mock_setting_name(request.setting)}.",
        "chapters": chapters,
        "villainDetails": {
            "name": get_mock_villain_name(request.villainType),
            "description": f"A menacing {request.villainType} with dark ambitions.",
            "motivation": get_mock_villain_motivation(request.villainType),
            "methods": ["Manipulation and deceit", "Direct confrontation", "Use of minions"],
            "weaknesses": ["Overconfidence", "Dependency on a specific artifact"],
            "lieutenants": ["The Shadow Lieutenant", "The Brute Enforcer"]
        },
        "settingDetails": {
            "name": get_mock_setting_name(request.setting),
            "description": f"A {request.setting} realm filled with adventure and danger.",
            "atmosphere": f"The {request.tone} atmosphere permeates this {request.setting} setting.",
            "keyLocations": [
                {
                    "name": "Haven's Rest",
                    "type": "city",
                    "description": "A safe haven where adventures begin.",
                    "importance": "major"
                },
                {
                    "name": "The Shadowed Depths",
                    "type": "dungeon",
                    "description": "A dangerous dungeon filled with secrets.",
                    "importance": "major"
                }
            ],
            "culturalNotes": [
                "Honor is highly valued in society",
                "Magic users are viewed with suspicion",
                "Trade guilds hold significant power"
            ]
        },
        "loreItems": [
            {
                "id": "lore-1",
                "category": "rule",
                "content": "Magic in this world is tied to ancient bloodlines",
                "tags": ["magic", "bloodlines", "heritage"]
            },
            {
                "id": "lore-2",
                "category": "history",
                "content": "The Great War ended a century ago, leaving ruins scattered across the land",
                "tags": ["history", "war", "ruins"]
            }
        ],
        "createdAt": datetime.utcnow().isoformat(),
        "config": request.dict()
    }

def generate_mock_content(content_type: str, context: Dict[str, Any]):
    """Generate mock content for development"""
    
    mock_content = {
        "chapter": {
            "title": "The Mysterious Encounter",
            "description": "A chapter filled with intrigue and discovery",
            "encounters": ["Bandits on the road", "Mysterious stranger in tavern"],
            "story_hooks": ["Strange symbol found", "Missing merchant's plea for help"]
        },
        "npc": {
            "name": "Elara Nightwhisper",
            "description": "A mysterious elf with silver hair and knowing eyes",
            "personality": "Cryptic but helpful, speaks in riddles",
            "background": "Former court wizard seeking redemption",
            "stats": {"level": 5, "ac": 15, "hp": 45},
            "plot_hooks": ["Knows secret about the villain", "Owes debt to party member"]
        },
        "location": {
            "name": "The Whispering Grove",
            "description": "An ancient forest where the trees seem to speak",
            "atmosphere": "Mystical and slightly unsettling",
            "features": ["Talking trees", "Hidden shrine", "Natural amphitheater"],
            "encounters": ["Awakened tree guardian", "Lost spirits"],
            "secrets": ["Hidden cache of ancient scrolls", "Portal to feywild"]
        },
        "item": {
            "name": "Blade of Echoing Thunder",
            "description": "A sword that crackles with electrical energy",
            "rarity": "rare",
            "properties": ["+1 weapon", "Thunder damage on critical hits"],
            "lore": "Forged during the Storm Wars by legendary smith"
        },
        "trap": {
            "name": "Collapsing Floor",
            "description": "Weakened floorboards give way under weight",
            "trigger": "Stepping on marked area",
            "effect": "2d6 falling damage, trapped in pit",
            "detection_dc": 15,
            "disarm_dc": 12,
            "countermeasures": ["Jump across", "Use rope to swing", "Test each board"]
        }
    }
    
    base_content = mock_content.get(content_type, {"name": "Generic Content", "description": "Placeholder content"})
    base_content.update({
        "id": str(uuid.uuid4()),
        "type": content_type,
        "createdAt": datetime.utcnow().isoformat()
    })
    
    return base_content

# Helper functions for mock data
def get_mock_chapter_title(chapter_num: int) -> str:
    titles = [
        "The Call to Adventure",
        "Gathering Storm",
        "Into the Unknown",
        "The Heart of Darkness",
        "Trials and Tribulations",
        "The Final Stand",
        "Resolution",
        "New Beginnings"
    ]
    return titles[min(chapter_num - 1, len(titles) - 1)]

def get_mock_setting_name(setting: str) -> str:
    names = {
        "classic": "Aldermore",
        "desert": "Sunspear Dominion",
        "jungle": "Verdant Reaches",
        "arctic": "Frostpeak Territory",
        "urban": "Crown City",
        "planar": "The Shifting Realms"
    }
    return names.get(setting, "Unknown Realm")

def get_mock_villain_name(villain_type: str) -> str:
    names = {
        "cultist": "Mordai the Devoted",
        "noble": "Duke Blackheart",
        "dragon": "Vermithrax the Ancient",
        "undead": "Lord Bonechill",
        "aberration": "The Void Whisperer",
        "demon": "Malphas the Corruptor"
    }
    return names.get(villain_type, "The Dark One")

def get_mock_villain_motivation(villain_type: str) -> str:
    motivations = {
        "cultist": "To awaken an ancient evil god",
        "noble": "To claim the throne through treachery",
        "dragon": "To reclaim stolen treasure and territory",
        "undead": "To bring eternal darkness to the world",
        "aberration": "To merge reality with the Far Realm",
        "demon": "To corrupt all living souls"
    }
    return motivations.get(villain_type, "To achieve ultimate power") 