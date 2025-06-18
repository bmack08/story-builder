import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Collapse,
  Badge,
  Tooltip,
  useDisclosure,
  Divider,
  SimpleGrid
} from '@chakra-ui/react'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  SparklesIcon,
  LightBulbIcon,
  DiceIcon
} from '@heroicons/react/24/outline'
import { aiService } from '../../services/aiService'
import AIGenerationDialog from './AIGenerationDialog'
import type { DnDContentType } from '../../types/editor'

interface AIAssistantProps {
  onContentGenerated: (content: any, type: DnDContentType) => void
  currentContent?: string
  isVisible?: boolean
}

interface QuickSuggestion {
  id: string
  title: string
  description: string
  contentType: DnDContentType
  prompt: string
  icon: React.ReactNode
}

const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  {
    id: 'random-monster',
    title: 'Random Monster',
    description: 'Generate a unique monster for your adventure',
    contentType: 'monster',
    prompt: 'Create a unique and interesting monster with creative abilities',
    icon: <DiceIcon className="w-4 h-4" />
  },
  {
    id: 'tavern-npc',
    title: 'Tavern NPC',
    description: 'Create a memorable tavern character',
    contentType: 'npc',
    prompt: 'Create a tavern keeper or patron with an interesting personality and potential plot hooks',
    icon: <LightBulbIcon className="w-4 h-4" />
  },
  {
    id: 'magic-item',
    title: 'Magic Item',
    description: 'Generate a unique magical item',
    contentType: 'item',
    prompt: 'Create a unique magic item with interesting properties that would be useful and fun for players',
    icon: <SparklesIcon className="w-4 h-4" />
  },
  {
    id: 'dungeon-trap',
    title: 'Dungeon Trap',
    description: 'Create a challenging trap',
    contentType: 'trap',
    prompt: 'Create a mechanical trap for a dungeon that is challenging but fair with clear detection methods',
    icon: <DiceIcon className="w-4 h-4" />
  }
]

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onContentGenerated,
  currentContent,
  isVisible = true
}) => {
  const { isOpen: isExpanded, onToggle: toggleExpanded } = useDisclosure({ defaultIsOpen: false })
  const { isOpen: isDialogOpen, onOpen: openDialog, onClose: closeDialog } = useDisclosure()
  const [selectedContentType, setSelectedContentType] = useState<DnDContentType>('monster')
  const [availableProviders, setAvailableProviders] = useState<string[]>([])

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const providers = await aiService.getProviders()
      setAvailableProviders(providers.providers)
    } catch (error) {
      console.error('Failed to load AI providers:', error)
    }
  }

  const handleQuickGenerate = async (suggestion: QuickSuggestion) => {
    try {
      let response

      switch (suggestion.contentType) {
        case 'monster':
          response = await aiService.generateMonster(suggestion.prompt)
          break
        case 'npc':
          response = await aiService.generateNPC(suggestion.prompt)
          break
        case 'item':
          response = await aiService.generateItem(suggestion.prompt)
          break
        case 'trap':
          response = await aiService.generateTrap(suggestion.prompt)
          break
        default:
          return
      }

      if (response.success && response.data) {
        onContentGenerated(response.data, suggestion.contentType)
      }
    } catch (error) {
      console.error('Quick generation error:', error)
    }
  }

  const handleCustomGenerate = (contentType: DnDContentType) => {
    setSelectedContentType(contentType)
    openDialog()
  }

  const handleDialogGenerated = (content: any) => {
    onContentGenerated(content, selectedContentType)
  }

  if (!isVisible || availableProviders.length === 0) {
    return null
  }

  return (
    <>
      <Box
        position="fixed"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
        minW="280px"
        maxW="320px"
        zIndex={1000}
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.600'
        }}
      >
        <HStack
          p={3}
          cursor="pointer"
          onClick={toggleExpanded}
          _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
          borderTopRadius="lg"
        >
          <SparklesIcon className="w-5 h-5 text-purple-500" />
          <Text fontWeight="semibold" flex={1}>
            AI Assistant
          </Text>
          <Badge colorScheme="purple" size="sm">
            {availableProviders.length} provider{availableProviders.length !== 1 ? 's' : ''}
          </Badge>
          <IconButton
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            icon={isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            size="sm"
            variant="ghost"
          />
        </HStack>

        <Collapse in={isExpanded}>
          <VStack p={4} spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Generate D&D content with AI assistance
            </Text>

            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" fontWeight="semibold">
                Quick Generate
              </Text>
              <SimpleGrid columns={2} spacing={2}>
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <Tooltip key={suggestion.id} label={suggestion.description} placement="top">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={suggestion.icon}
                      onClick={() => handleQuickGenerate(suggestion)}
                      fontSize="xs"
                      h="auto"
                      py={2}
                      whiteSpace="normal"
                      textAlign="left"
                    >
                      {suggestion.title}
                    </Button>
                  </Tooltip>
                ))}
              </SimpleGrid>
            </VStack>

            <Divider />

            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" fontWeight="semibold">
                Custom Generate
              </Text>
              <SimpleGrid columns={2} spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('monster')}
                >
                  Monster
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('npc')}
                >
                  NPC
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('encounter')}
                >
                  Encounter
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('item')}
                >
                  Item
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('spell')}
                >
                  Spell
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCustomGenerate('trap')}
                >
                  Trap
                </Button>
              </SimpleGrid>
            </VStack>

            <Divider />

            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.500">
                Powered by AI
              </Text>
              <Badge colorScheme="green" size="sm">
                Ready
              </Badge>
            </HStack>
          </VStack>
        </Collapse>
      </Box>

      <AIGenerationDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        contentType={selectedContentType}
        onGenerated={handleDialogGenerated}
      />
    </>
  )
}

export default AIAssistant 