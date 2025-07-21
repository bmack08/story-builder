import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Icon,
  Container,
  SimpleGrid,
  Badge,
  useToast
} from '@chakra-ui/react'
import { FaBook, FaWandMagicSparkles, FaPenToSquare, FaRocket } from 'react-icons/fa6'
import { AdventureBookWizard } from './AdventureBookWizard'
import { AdventureEditor } from './AdventureEditor'
import { useAdventureStore } from '../../stores/adventureStore'

type CreationMode = 'selection' | 'wizard' | 'manual'

export const AdventureCreationPage: React.FC = () => {
  const [mode, setMode] = useState<CreationMode>('selection')
  const [currentAdventureId, setCurrentAdventureId] = useState<string | null>(null)
  const toast = useToast()
  
  const { createAdventure, loadAdventure } = useAdventureStore()
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleWizardComplete = (adventure: any) => {
    try {
      // Create the adventure using the store
      const newAdventure = createAdventure(adventure.title, adventure.description)
      
      // Update the adventure with the generated content
      // This would typically be done through the store's update methods
      console.log('Generated adventure:', adventure)
      
      setCurrentAdventureId(newAdventure.id)
      setMode('manual')
      
      toast({
        title: 'Adventure Created!',
        description: `Your adventure "${adventure.title}" is ready for editing.`,
        status: 'success',
        duration: 5000
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create adventure. Please try again.',
        status: 'error',
        duration: 3000
      })
    }
  }

  const handleManualCreate = () => {
    const newAdventure = createAdventure('New Adventure', 'A new D&D adventure')
    setCurrentAdventureId(newAdventure.id)
    setMode('manual')
  }

  const handleBackToSelection = () => {
    setMode('selection')
    setCurrentAdventureId(null)
  }

  if (mode === 'wizard') {
    return (
      <AdventureBookWizard
        onComplete={handleWizardComplete}
        onCancel={handleBackToSelection}
      />
    )
  }

  if (mode === 'manual' && currentAdventureId) {
    return (
      <Box>
        <Container maxW="container.xl" py={4}>
          <Button
            variant="outline"
            leftIcon={<Icon as={FaBook} />}
            onClick={handleBackToSelection}
            mb={4}
          >
            Back to Adventure Creation
          </Button>
        </Container>
        <AdventureEditor adventureId={currentAdventureId} />
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Icon as={FaBook} w={16} h={16} color="blue.500" />
            <Heading size="2xl">Create Your D&D Adventure</Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              Choose how you'd like to create your adventure. Use AI to generate a complete adventure book,
              or start with a blank canvas for full creative control.
            </Text>
          </VStack>

          {/* Creation Options */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="4xl">
            {/* AI Adventure Book Wizard */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              borderWidth={2}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
                borderColor: 'blue.500'
              }}
              onClick={() => setMode('wizard')}
            >
              <CardHeader textAlign="center" pb={2}>
                <VStack spacing={3}>
                  <Icon as={FaWandMagicSparkles} w={12} h={12} color="purple.500" />
                  <Heading size="lg">AI Adventure Book Wizard</Heading>
                  <HStack>
                    <Badge colorScheme="purple">AI-Powered</Badge>
                    <Badge colorScheme="green">Guided</Badge>
                    <Badge colorScheme="blue">Complete</Badge>
                  </HStack>
                </VStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  <Text textAlign="center" color="gray.600">
                    Let AI create a complete professional adventure book for you.
                    Just answer a few questions and get a full adventure with chapters,
                    encounters, NPCs, and everything you need to run an amazing game.
                  </Text>
                  
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold">What you'll get:</Text>
                    <VStack spacing={1} align="stretch" fontSize="sm" color="gray.600">
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Complete adventure with 5-7 chapters</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Balanced encounters and stat blocks</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Rich NPCs with motivations</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Professional D&D 5e formatting</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Read-aloud text and DM guidance</Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <Button
                    colorScheme="purple"
                    size="lg"
                    leftIcon={<Icon as={FaWandMagicSparkles} />}
                    onClick={() => setMode('wizard')}
                  >
                    Start AI Wizard
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Manual Adventure Creation */}
            <Card
              bg={cardBg}
              borderColor={borderColor}
              borderWidth={2}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
                borderColor: 'blue.500'
              }}
              onClick={handleManualCreate}
            >
              <CardHeader textAlign="center" pb={2}>
                <VStack spacing={3}>
                  <Icon as={FaPenToSquare} w={12} h={12} color="blue.500" />
                  <Heading size="lg">Manual Adventure Editor</Heading>
                  <HStack>
                    <Badge colorScheme="blue">Full Control</Badge>
                    <Badge colorScheme="orange">Flexible</Badge>
                    <Badge colorScheme="cyan">Creative</Badge>
                  </HStack>
                </VStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  <Text textAlign="center" color="gray.600">
                    Start with a blank canvas and build your adventure from scratch.
                    Perfect for experienced DMs who want complete creative control
                    over every aspect of their adventure.
                  </Text>
                  
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold">What you'll get:</Text>
                    <VStack spacing={1} align="stretch" fontSize="sm" color="gray.600">
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Rich text editor with D&D templates</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>AI-powered content suggestions</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Chapter and section organization</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Stat block and encounter tools</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaRocket} w={3} h={3} />
                        <Text>Export to PDF, HTML, or Markdown</Text>
                      </HStack>
                    </VStack>
                  </VStack>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<Icon as={FaPenToSquare} />}
                    onClick={handleManualCreate}
                  >
                    Create Manually
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Additional Info */}
          <VStack spacing={4} textAlign="center" maxW="2xl">
            <Heading size="md">Not sure which to choose?</Heading>
            <Text color="gray.600">
              <strong>Choose the AI Wizard</strong> if you want a complete adventure quickly and enjoy guided creation.
              <br />
              <strong>Choose Manual Creation</strong> if you have a specific vision and want full creative control.
            </Text>
            <Text fontSize="sm" color="gray.500">
              You can always switch between modes or combine AI-generated content with manual editing.
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
} 