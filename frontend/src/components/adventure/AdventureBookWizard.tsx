import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Select,
  Checkbox,
  CheckboxGroup,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Divider,
  Badge,
  useColorModeValue,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Heading,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import { FaBook, FaWandMagicSparkles, FaUsers, FaMapLocationDot, FaDragon, FaScroll } from 'react-icons/fa6'
import { adventureBookService, type AdventureRequirements } from '../../services/adventureBookService'

interface ConversationStep {
  id: string
  title: string
  icon: any
  questions: Question[]
  completed: boolean
}

interface Question {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'multiselect'
  prompt: string
  options?: string[]
  required?: boolean
  placeholder?: string
  aiSuggestion?: boolean
}

interface AdventureBookWizardProps {
  onComplete: (adventure: any) => void
  onCancel: () => void
}

export const AdventureBookWizard: React.FC<AdventureBookWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [requirements, setRequirements] = useState<AdventureRequirements>({
    title: '',
    description: '',
    theme: '',
    tone: '',
    playerLevels: '',
    partySize: 4,
    duration: '',
    setting: '',
    plotType: '',
    mainVillain: '',
    majorLocations: [],
    keyNPCs: [],
    includeElements: [],
    difficultyPreference: '',
    specialMechanics: [],
    customRequests: '',
    inspirations: ''
  })
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)
  const [aiAdvice, setAiAdvice] = useState<string>('')
  const [isGeneratingAdventure, setIsGeneratingAdventure] = useState(false)

  const toast = useToast()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const conversationSteps: ConversationStep[] = [
    {
      id: 'basic-info',
      title: 'Adventure Basics',
      icon: FaBook,
      completed: !!(requirements.title && requirements.description && requirements.theme && requirements.tone),
      questions: [
        {
          id: 'title',
          type: 'text',
          prompt: 'What would you like to call your adventure?',
          placeholder: 'e.g., "The Cursed Crown of Eldoria"',
          required: true
        },
        {
          id: 'description',
          type: 'textarea',
          prompt: 'Give me a brief description of your adventure concept:',
          placeholder: 'A mysterious plague has struck the kingdom, and the heroes must find the ancient cure hidden in a forgotten temple...',
          required: true
        },
        {
          id: 'theme',
          type: 'select',
          prompt: 'What\'s the primary theme of your adventure?',
          options: [
            'Classic Fantasy Adventure',
            'Gothic Horror',
            'Political Intrigue',
            'Mystery/Investigation',
            'Dungeon Crawl',
            'Wilderness Exploration',
            'Urban Adventure',
            'Planar Adventure',
            'Heist/Caper',
            'War/Military Campaign'
          ],
          required: true
        },
        {
          id: 'tone',
          type: 'select',
          prompt: 'What tone should your adventure have?',
          options: [
            'Heroic and Inspiring',
            'Dark and Gritty',
            'Light-hearted and Comedic',
            'Mysterious and Atmospheric',
            'Epic and Grandiose',
            'Intimate and Character-driven'
          ],
          required: true
        }
      ]
    },
    {
      id: 'campaign-details',
      title: 'Campaign Details',
      icon: FaUsers,
      completed: !!(requirements.playerLevels && requirements.duration && requirements.setting),
      questions: [
        {
          id: 'playerLevels',
          type: 'select',
          prompt: 'What level range is this adventure designed for?',
          options: [
            '1-3 (Novice)',
            '3-5 (Apprentice)', 
            '5-10 (Journeyman)',
            '10-15 (Expert)',
            '15-20 (Master)',
            '1-20 (Full Campaign)'
          ],
          required: true
        },
        {
          id: 'partySize',
          type: 'select',
          prompt: 'How many players do you expect?',
          options: ['2', '3', '4', '5', '6', '7+'],
          required: true
        },
        {
          id: 'duration',
          type: 'select',
          prompt: 'How long should this adventure be?',
          options: [
            'One-shot (1 session)',
            'Mini-campaign (2-4 sessions)',
            'Short Campaign (5-10 sessions)',
            'Medium Campaign (11-20 sessions)',
            'Long Campaign (21+ sessions)'
          ],
          required: true
        },
        {
          id: 'setting',
          type: 'select',
          prompt: 'What\'s the primary setting?',
          options: [
            'Traditional Fantasy (Medieval-inspired)',
            'High Fantasy (Magical cities, flying ships)',
            'Dark Fantasy (Grimm, dangerous world)',
            'Steampunk Fantasy',
            'Modern Fantasy',
            'Post-Apocalyptic Fantasy',
            'Planar/Multiverse',
            'Underwater/Aquatic',
            'Desert/Arabian Nights',
            'Norse/Viking',
            'Eastern/Asian-inspired',
            'Custom Setting'
          ],
          required: true
        }
      ]
    },
    {
      id: 'story-structure',
      title: 'Story Structure',
      icon: FaScroll,
      completed: !!(requirements.plotType && requirements.mainVillain),
      questions: [
        {
          id: 'plotType',
          type: 'select',
          prompt: 'What type of plot structure would you prefer?',
          options: [
            'Linear Adventure (Chapters follow a set sequence)',
            'Sandbox Adventure (Open exploration with multiple paths)',
            'Hex Crawl (Exploration-based with random encounters)',
            'Episodic (Series of connected but standalone adventures)',
            'Mystery Investigation (Clue-based progression)',
            'Faction-based (Multiple competing groups)',
            'Megadungeon (One large complex location)'
          ],
          required: true
        },
        {
          id: 'mainVillain',
          type: 'text',
          prompt: 'Describe your main villain or antagonist:',
          placeholder: 'e.g., "A corrupted ancient dragon seeking to reclaim its lost kingdom" or "A cult leader trying to summon a demon lord"',
          required: true,
          aiSuggestion: true
        },
        {
          id: 'majorLocations',
          type: 'textarea',
          prompt: 'List 3-5 major locations for your adventure (one per line):',
          placeholder: 'Ancient Temple of Shadows\nHaunted Forest of Whispers\nThe Corrupted City of Malachar\nDragon\'s Lair in the Crimson Peaks',
          aiSuggestion: true
        },
        {
          id: 'keyNPCs',
          type: 'textarea',
          prompt: 'List key NPCs the players will interact with (one per line):',
          placeholder: 'Elder Theron - Wise village elder with a secret\nCaptain Sera - Conflicted city guard\nMystical Oracle - Cryptic fortune teller',
          aiSuggestion: true
        }
      ]
    },
    {
      id: 'adventure-elements',
      title: 'Adventure Elements',
      icon: FaDragon,
      completed: requirements.includeElements.length > 0,
      questions: [
        {
          id: 'includeElements',
          type: 'checkbox',
          prompt: 'What elements should your adventure include? (Select all that apply)',
          options: [
            'Epic Boss Fights',
            'Puzzle Solving',
            'Social Encounters & Roleplay',
            'Stealth & Infiltration',
            'Exploration & Discovery',
            'Political Intrigue',
            'Romance Subplots',
            'Mystery Investigation',
            'Magical Items & Artifacts',
            'Ancient Lore & Backstory',
            'Moral Dilemmas',
            'Time Pressure/Urgency',
            'Faction Conflicts',
            'Environmental Hazards',
            'Comic Relief Moments'
          ]
        },
        {
          id: 'difficultyPreference',
          type: 'radio',
          prompt: 'What difficulty level do you prefer for encounters?',
          options: [
            'Easy (Focus on story and roleplay)',
            'Moderate (Balanced challenge)',
            'Hard (Tactical combat focus)',
            'Deadly (High-stakes survival)',
            'Variable (Mix of difficulties)'
          ]
        },
        {
          id: 'specialMechanics',
          type: 'checkbox',
          prompt: 'Any special mechanics or features you\'d like? (Optional)',
          options: [
            'Chase Scenes',
            'Mass Combat',
            'Skill Challenges',
            'Crafting Systems',
            'Base Building',
            'Reputation System',
            'Moral Alignment Tracking',
            'Sanity/Horror Mechanics',
            'Weather/Environmental Effects',
            'Time Travel Elements',
            'Divination/Prophecy',
            'Curse/Blessing Mechanics'
          ]
        }
      ]
    },
    {
      id: 'customization',
      title: 'Final Touches',
      icon: FaWandMagicSparkles,
      completed: true, // Always completed since it's optional
      questions: [
        {
          id: 'customRequests',
          type: 'textarea',
          prompt: 'Any specific requests or things you want to make sure are included?',
          placeholder: 'e.g., "I want a recurring NPC villain who escapes multiple times" or "Include a moral dilemma about sacrificing one to save many"'
        },
        {
          id: 'inspirations',
          type: 'textarea',
          prompt: 'Any movies, books, games, or other adventures that inspire this concept?',
          placeholder: 'e.g., "Lord of the Rings meets Bloodborne" or "Inspired by the movie The Mummy"'
        }
      ]
    }
  ]

  const currentStepData = conversationSteps[currentStep]
  const progress = ((currentStep + 1) / conversationSteps.length) * 100

  const handleInputChange = (questionId: string, value: any) => {
    setRequirements(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < conversationSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerateAIAdvice = async (questionId: string) => {
    setIsGeneratingAdvice(true)
    try {
      // Use quick advice if available, otherwise call AI service
      const quickAdvice = adventureBookService.getQuickAdvice(questionId, requirements)
      if (quickAdvice !== 'Consider what would make this element most interesting for your players and story.') {
        setAiAdvice(quickAdvice)
        setTimeout(() => {
          setAiAdvice('')
          setIsGeneratingAdvice(false)
        }, 5000)
      } else {
        // Generate AI advice for this specific question
        const question = currentStepData.questions.find(q => q.id === questionId)
        if (question) {
          const response = await adventureBookService.generateAdvice(
            question.prompt,
            { questionId, currentStep: currentStep },
            requirements
          )
          
          if (response.success && response.data) {
            setAiAdvice(response.data)
            setTimeout(() => {
              setAiAdvice('')
              setIsGeneratingAdvice(false)
            }, 5000)
          } else {
            throw new Error(response.error || 'Failed to generate advice')
          }
        } else {
          throw new Error('Question not found')
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI advice. Please try again.',
        status: 'error',
        duration: 3000
      })
      setIsGeneratingAdvice(false)
    }
  }

  const handleComplete = async () => {
    setIsGeneratingAdventure(true)
    try {
      // Convert string arrays to actual arrays
      const processedRequirements = {
        ...requirements,
        majorLocations: Array.isArray(requirements.majorLocations) 
          ? requirements.majorLocations
          : (requirements.majorLocations as string).split('\n').filter((loc: string) => loc.trim()),
        keyNPCs: Array.isArray(requirements.keyNPCs)
          ? requirements.keyNPCs
          : (requirements.keyNPCs as string).split('\n').filter((npc: string) => npc.trim())
      }
      
      // Generate the adventure book
      const response = await adventureBookService.generateAdventureBook(processedRequirements)
      
      if (response.success && response.data) {
        toast({
          title: 'Adventure Generated!',
          description: `Your adventure "${response.data.title}" has been created successfully.`,
          status: 'success',
          duration: 5000
        })
        
        // Convert to internal format and pass to parent
        const adventure = adventureBookService.convertToAdventure(response.data)
        await onComplete(adventure)
      } else {
        throw new Error(response.error || 'Failed to generate adventure')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate adventure. Please try again.',
        status: 'error',
        duration: 3000
      })
    } finally {
      setIsGeneratingAdventure(false)
    }
  }

  const isStepComplete = (step: ConversationStep) => {
    return step.questions.every(q => 
      !q.required || (requirements as any)[q.id]
    )
  }

  const canProceed = isStepComplete(currentStepData)
  const isLastStep = currentStep === conversationSteps.length - 1

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={8} maxW="4xl" mx="auto">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <Icon as={FaBook} w={12} h={12} color="blue.500" />
          <Heading size="xl">Adventure Book Creator</Heading>
          <Text color="gray.600" fontSize="lg">
            Let's create your perfect D&D adventure together. I'll guide you through each step
            to ensure we build something amazing for your table.
          </Text>
        </VStack>

        {/* Progress */}
        <Box w="full">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">
              Step {currentStep + 1} of {conversationSteps.length}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {Math.round(progress)}% Complete
            </Text>
          </HStack>
          <Progress value={progress} colorScheme="blue" borderRadius="full" />
        </Box>

        {/* Step Navigation */}
        <HStack spacing={4} w="full" justify="center" flexWrap="wrap">
          {conversationSteps.map((step, index) => (
            <Button
              key={step.id}
              variant={index === currentStep ? "solid" : "ghost"}
              colorScheme={isStepComplete(step) ? "green" : "gray"}
              leftIcon={<Icon as={step.icon} />}
              size="sm"
              onClick={() => setCurrentStep(index)}
              isDisabled={index > currentStep}
            >
              {step.title}
              {isStepComplete(step) && <Badge ml={2} colorScheme="green">✓</Badge>}
            </Button>
          ))}
        </HStack>

        {/* Current Step Content */}
        <Card w="full" bg={cardBg} borderColor={borderColor} borderWidth={1}>
          <CardHeader>
            <HStack>
              <Icon as={currentStepData.icon} w={6} h={6} color="blue.500" />
              <Heading size="md">{currentStepData.title}</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {currentStepData.questions.map((question, index) => (
                <Box key={question.id}>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" fontSize="lg">
                      {question.prompt}
                      {question.required && <Text as="span" color="red.500">*</Text>}
                    </Text>
                    {question.aiSuggestion && (
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="purple"
                        leftIcon={<Icon as={FaWandMagicSparkles} />}
                        onClick={() => handleGenerateAIAdvice(question.id)}
                        isLoading={isGeneratingAdvice}
                      >
                        AI Suggest
                      </Button>
                    )}
                  </HStack>

                  {question.type === 'text' && (
                    <Input
                      value={(requirements as any)[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      size="lg"
                    />
                  )}

                  {question.type === 'textarea' && (
                    <Textarea
                      value={(requirements as any)[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder={question.placeholder}
                      rows={4}
                      resize="vertical"
                    />
                  )}

                  {question.type === 'select' && (
                    <Select
                      value={(requirements as any)[question.id] || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder="Choose an option..."
                      size="lg"
                    >
                      {question.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  )}

                  {question.type === 'radio' && (
                    <RadioGroup
                      value={(requirements as any)[question.id] || ''}
                      onChange={(value) => handleInputChange(question.id, value)}
                    >
                      <Stack spacing={3}>
                        {question.options?.map(option => (
                          <Radio key={option} value={option} size="lg">
                            {option}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  )}

                  {question.type === 'checkbox' && (
                    <CheckboxGroup
                      value={(requirements as any)[question.id] || []}
                      onChange={(values) => handleInputChange(question.id, values)}
                    >
                      <Stack spacing={3}>
                        {question.options?.map(option => (
                          <Checkbox key={option} value={option} size="lg">
                            {option}
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  )}

                  {aiAdvice && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>AI Suggestion:</AlertTitle>
                        <AlertDescription>{aiAdvice}</AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Navigation Buttons */}
        <HStack spacing={4} w="full" justify="space-between">
          <Button
            variant="outline"
            onClick={onCancel}
            size="lg"
          >
            Cancel
          </Button>
          
          <HStack spacing={4}>
            <Button
              variant="outline"
              onClick={handlePrevious}
              isDisabled={currentStep === 0}
              size="lg"
            >
              Previous
            </Button>
            
            {!isLastStep ? (
              <Button
                colorScheme="blue"
                onClick={handleNext}
                isDisabled={!canProceed}
                size="lg"
              >
                Next
              </Button>
            ) : (
              <Button
                colorScheme="green"
                onClick={handleComplete}
                isDisabled={!canProceed}
                isLoading={isGeneratingAdventure}
                loadingText="Generating Adventure..."
                size="lg"
                leftIcon={<Icon as={FaWandMagicSparkles} />}
              >
                Generate Adventure Book
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Summary Preview */}
        {currentStep > 0 && (
          <Card w="full" bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="sm">Adventure Summary</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {requirements.title && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">Title:</Text>
                    <Text fontWeight="semibold">{requirements.title}</Text>
                  </Box>
                )}
                {requirements.theme && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">Theme:</Text>
                    <Text>{requirements.theme}</Text>
                  </Box>
                )}
                {requirements.playerLevels && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">Player Levels:</Text>
                    <Text>{requirements.playerLevels}</Text>
                  </Box>
                )}
                {requirements.duration && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">Duration:</Text>
                    <Text>{requirements.duration}</Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  )
} 