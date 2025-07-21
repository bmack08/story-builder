import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  useToast
} from '@chakra-ui/react'
import { aiService } from '../../services/aiService'
import type { DnDContentType } from '../../types/editor'

interface AIGenerationDialogProps {
  isOpen: boolean
  onClose: () => void
  contentType: DnDContentType
  onGenerated: (content: any) => void
}

const CONTENT_TYPE_LABELS = {
  monster: 'Monster',
  npc: 'NPC',
  item: 'Item',
  spell: 'Spell',
  encounter: 'Encounter',
  trap: 'Trap',
  location: 'Location',
  condition: 'Condition'
}

const CONTENT_TYPE_PLACEHOLDERS = {
  monster: 'Describe the monster you want to create (e.g., "A fire elemental guardian for a volcano dungeon")',
  npc: 'Describe the NPC you want to create (e.g., "A wise old tavern keeper with secrets")',
  item: 'Describe the item you want to create (e.g., "A magical sword that glows in darkness")',
  spell: 'Describe the spell you want to create (e.g., "A utility spell for underwater exploration")',
  encounter: 'Describe the encounter you want to create (e.g., "Bandits ambushing travelers on a forest road")',
  trap: 'Describe the trap you want to create (e.g., "A pressure plate trap in an ancient tomb")',
  location: 'Describe the location you want to create (e.g., "A mysterious floating tower")',
  condition: 'Describe the condition you want to create (e.g., "A curse that affects spellcasting")'
}

export const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  isOpen,
  onClose,
  contentType,
  onGenerated
}) => {
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState('')
  const [partyLevel, setPartyLevel] = useState(1)
  const [partySize, setPartySize] = useState(4)
  const [isGenerating, setIsGenerating] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      loadProviders()
      setPrompt('')
      setError(null)
    }
  }, [isOpen])

  const loadProviders = async () => {
    try {
      const providers = await aiService.getProviders()
      setAvailableProviders(providers.providers)
      setProvider(providers.default)
    } catch (error) {
      console.error('Failed to load AI providers:', error)
      setError('Failed to load AI providers')
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      let response

      switch (contentType) {
        case 'monster':
          response = await aiService.generateMonster(prompt, provider)
          break
        case 'npc':
          response = await aiService.generateNPC(prompt, provider)
          break
        case 'item':
          response = await aiService.generateItem(prompt, provider)
          break
        case 'spell':
          response = await aiService.generateSpell(prompt, provider)
          break
        case 'encounter':
          response = await aiService.generateEncounter(prompt, partyLevel, partySize, provider)
          break
        case 'trap':
          response = await aiService.generateTrap(prompt, provider)
          break
        default:
          throw new Error(`Unsupported content type: ${contentType}`)
      }

      if (response.success && response.data) {
        onGenerated(response.data)
        toast({
          title: 'Content Generated',
          description: `${CONTENT_TYPE_LABELS[contentType]} created successfully using ${response.provider}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onClose()
      } else {
        setError(response.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    if (!isGenerating) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Generate {CONTENT_TYPE_LABELS[contentType]} with AI
        </ModalHeader>
        <ModalCloseButton isDisabled={isGenerating} />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={CONTENT_TYPE_PLACEHOLDERS[contentType]}
                rows={4}
                isDisabled={isGenerating}
              />
            </FormControl>

            {availableProviders.length > 1 && (
              <FormControl>
                <FormLabel>AI Provider</FormLabel>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  isDisabled={isGenerating}
                >
                  {availableProviders.map((p) => (
                    <option key={p} value={p}>
                      {p === 'openai' ? 'OpenAI GPT-4' : 'Anthropic Claude'}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            {contentType === 'encounter' && (
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Party Level</FormLabel>
                  <NumberInput
                    value={partyLevel}
                    onChange={(_, value) => setPartyLevel(value || 1)}
                    min={1}
                    max={20}
                    isDisabled={isGenerating}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Party Size</FormLabel>
                  <NumberInput
                    value={partySize}
                    onChange={(_, value) => setPartySize(value || 4)}
                    min={1}
                    max={8}
                    isDisabled={isGenerating}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>
            )}

            {availableProviders.length > 0 && (
              <HStack>
                <Text fontSize="sm" color="gray.500">
                  Using:
                </Text>
                <Badge colorScheme="purple">
                  {provider === 'openai' ? 'OpenAI GPT-4' : 'Anthropic Claude'}
                </Badge>
              </HStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleClose}
            isDisabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleGenerate}
            isLoading={isGenerating}
            loadingText="Generating..."
            spinner={<Spinner size="sm" />}
            isDisabled={!prompt.trim() || availableProviders.length === 0}
          >
            Generate {CONTENT_TYPE_LABELS[contentType]}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AIGenerationDialog 