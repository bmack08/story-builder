import { Router } from 'express'
import { aiController } from '../controllers/aiController'

const router = Router()

// Get available AI providers
router.get('/providers', aiController.getProviders)

// Generate specific content types
router.post('/generate/monster', aiController.generateMonster)
router.post('/generate/npc', aiController.generateNPC)
router.post('/generate/encounter', aiController.generateEncounter)
router.post('/generate/item', aiController.generateItem)
router.post('/generate/trap', aiController.generateTrap)
router.post('/generate/spell', aiController.generateSpell)

// Generic content generation endpoint
router.post('/generate', aiController.generateContent)

export default router 