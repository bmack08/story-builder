import { Request, Response } from 'express'
import { aiService } from '../services/aiService'
import type { AIGenerationRequest, AIGenerationResponse } from '../types/dnd'

export class AIController {
  async generateMonster(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      const monster = await aiService.generateMonster(prompt, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: monster,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating monster:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate monster',
        provider: req.body.provider || 'default'
      })
    }
  }

  async generateNPC(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      const npc = await aiService.generateNPC(prompt, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: npc,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating NPC:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate NPC',
        provider: req.body.provider || 'default'
      })
    }
  }

  async generateEncounter(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider, partyLevel = 1, partySize = 4 }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      if (partyLevel < 1 || partyLevel > 20) {
        res.status(400).json({
          success: false,
          error: 'Party level must be between 1 and 20'
        })
        return
      }

      if (partySize < 1 || partySize > 8) {
        res.status(400).json({
          success: false,
          error: 'Party size must be between 1 and 8'
        })
        return
      }

      const encounter = await aiService.generateEncounter(prompt, partyLevel, partySize, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: encounter,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating encounter:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate encounter',
        provider: req.body.provider || 'default'
      })
    }
  }

  async generateItem(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      const item = await aiService.generateItem(prompt, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: item,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating item:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate item',
        provider: req.body.provider || 'default'
      })
    }
  }

  async generateTrap(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      const trap = await aiService.generateTrap(prompt, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: trap,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating trap:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate trap',
        provider: req.body.provider || 'default'
      })
    }
  }

  async generateSpell(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, provider }: AIGenerationRequest = req.body

      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required'
        })
        return
      }

      const spell = await aiService.generateSpell(prompt, provider)
      
      const response: AIGenerationResponse = {
        success: true,
        data: spell,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error('Error generating spell:', error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate spell',
        provider: req.body.provider || 'default'
      })
    }
  }

  async getProviders(_req: Request, res: Response): Promise<void> {
    try {
      const providers = aiService.getAvailableProviders()
      
      res.json({
        success: true,
        data: {
          providers,
          default: providers.includes('anthropic') ? 'anthropic' : providers[0]
        }
      })
    } catch (error) {
      console.error('Error getting providers:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to get available providers'
      })
    }
  }

  async generateContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentType, prompt, provider, partyLevel, partySize }: AIGenerationRequest = req.body

      if (!contentType || !prompt) {
        res.status(400).json({
          success: false,
          error: 'Content type and prompt are required'
        })
        return
      }

      let data: any

      switch (contentType) {
        case 'monster':
          data = await aiService.generateMonster(prompt, provider)
          break
        case 'npc':
          data = await aiService.generateNPC(prompt, provider)
          break
        case 'encounter':
          data = await aiService.generateEncounter(
            prompt, 
            partyLevel || 1, 
            partySize || 4, 
            provider
          )
          break
        case 'item':
          data = await aiService.generateItem(prompt, provider)
          break
        case 'trap':
          data = await aiService.generateTrap(prompt, provider)
          break
        case 'spell':
          data = await aiService.generateSpell(prompt, provider)
          break
        default:
          res.status(400).json({
            success: false,
            error: `Unsupported content type: ${contentType}`
          })
          return
      }

      const response: AIGenerationResponse = {
        success: true,
        data,
        provider: provider || 'default'
      }

      res.json(response)
    } catch (error) {
      console.error(`Error generating ${req.body.contentType}:`, error)
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : `Failed to generate ${req.body.contentType}`,
        provider: req.body.provider || 'default'
      })
    }
  }
}

export const aiController = new AIController() 