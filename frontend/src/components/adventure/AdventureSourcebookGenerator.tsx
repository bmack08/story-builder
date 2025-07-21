import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SimpleGrid,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { 
  FaBook, 
  FaDownload, 
  FaEye, 
  FaEdit, 
  FaCheck, 
  FaSpinner,
  FaFileExport,
  FaPrint,
  FaShare
} from 'react-icons/fa'
import { AdventureBookTemplate, type AdventureBook } from '../editor/AdventureBookTemplate'
import { adventureBookGenerator, type AdventureBookRequirements } from '../../services/adventureBookGenerator'
import { AdventureBookWizard } from './AdventureBookWizard'

interface AdventureSourcebookGeneratorProps {
  onBack?: () => void
}

export const AdventureSourcebookGenerator: React.FC<AdventureSourcebookGeneratorProps> = ({ onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [generatedBook, setGeneratedBook] = useState<AdventureBook | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showWizard, setShowWizard] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()
  const toast = useToast()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const handleGenerateBook = async (requirements: AdventureBookRequirements) => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setCurrentStep('Starting generation...')
    
    try {
      const book = await adventureBookGenerator.generateAdventureBook(
        requirements,
        (step: string, progress: number) => {
          setCurrentStep(step)
          setProgress(progress)
        }
      )
      
      setGeneratedBook(book)
      setShowWizard(false)
      
      toast({
        title: 'Adventure Book Generated!',
        description: `"${book.metadata.title}" has been successfully created.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate adventure book')
      
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating your adventure book. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleExport = async (format: 'pdf' | 'html' | 'markdown' | 'json') => {
    if (!generatedBook) return
    
    setIsExporting(true)
    
    try {
      // This would integrate with your existing export functionality
      // For now, we'll just show a demo
      
      const fileName = `${generatedBook.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`
      
      if (format === 'json') {
        // Export as JSON for backup/sharing
        const dataStr = JSON.stringify(generatedBook, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        
        const exportFileDefaultName = fileName
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      } else {
        // For PDF/HTML/Markdown, you'd integrate with your existing export service
        toast({
          title: 'Export Started',
          description: `Exporting "${generatedBook.metadata.title}" as ${format.toUpperCase()}...`,
          status: 'info',
          duration: 3000,
          isClosable: true
        })
        
        // Simulate export process
        setTimeout(() => {
          toast({
            title: 'Export Complete',
            description: `Adventure book exported successfully as ${format.toUpperCase()}.`,
            status: 'success',
            duration: 3000,
            isClosable: true
          })
        }, 2000)
      }
      
    } catch (err) {
      console.error('Export error:', err)
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your adventure book.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleLoadSample = () => {
    const sampleBook = adventureBookGenerator.generateSampleAdventureBook()
    setGeneratedBook(sampleBook)
    setShowWizard(false)
    
    toast({
      title: 'Sample Adventure Loaded',
      description: 'A sample adventure book has been loaded for demonstration.',
      status: 'info',
      duration: 3000,
      isClosable: true
    })
  }
  
  const handleEditSection = (sectionId: string) => {
    // This would open the editor for a specific section
    toast({
      title: 'Edit Section',
      description: `Editing section: ${sectionId}`,
      status: 'info',
      duration: 3000,
      isClosable: true
    })
  }
  
  if (showWizard) {
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} p={4}>
        <VStack spacing={8} align="stretch" maxW="4xl" mx="auto">
          <HStack justify="space-between">
            <Box>
              <Text fontSize="3xl" fontWeight="bold" mb={2}>
                Adventure Sourcebook Generator
              </Text>
              <Text fontSize="lg" color="gray.600">
                Create complete, professional D&D adventure sourcebooks with AI-powered content generation
              </Text>
            </Box>
            <HStack>
              <Button variant="outline" onClick={handleLoadSample}>
                Load Sample
              </Button>
              {onBack && (
                <Button variant="ghost" onClick={onBack}>
                  Back
                </Button>
              )}
            </HStack>
          </HStack>
          
          {/* Generation Progress */}
          {isGenerating && (
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <HStack>
                    <Spinner size="sm" />
                    <Text fontWeight="semibold">Generating Adventure Book...</Text>
                  </HStack>
                  <Box w="100%">
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      {currentStep}
                    </Text>
                    <Progress value={progress} colorScheme="blue" />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}
          
          {/* Error Display */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Adventure Book Wizard */}
          <AdventureBookWizard
            onComplete={handleGenerateBook}
            onCancel={() => setShowWizard(false)}
          />
        </VStack>
      </Box>
    )
  }
  
  if (!generatedBook) {
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} p={4}>
        <Text>No adventure book generated yet.</Text>
      </Box>
    )
  }
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} px={6} py={4}>
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              {generatedBook.metadata.title}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue">{generatedBook.metadata.levelRange}</Badge>
              <Badge colorScheme="green">{generatedBook.metadata.partySize}</Badge>
              <Badge colorScheme="purple">{generatedBook.metadata.duration}</Badge>
              <Badge colorScheme="orange">{generatedBook.metadata.theme}</Badge>
            </HStack>
          </VStack>
          
          <HStack>
            <Button
              leftIcon={<Icon as={FaEye} />}
              colorScheme="blue"
              variant="outline"
              onClick={onPreviewOpen}
            >
              Preview
            </Button>
            <Button
              leftIcon={<Icon as={FaEdit} />}
              colorScheme="green"
              variant="outline"
              onClick={() => setShowWizard(true)}
            >
              Edit
            </Button>
            <Button
              leftIcon={<Icon as={FaFileExport} />}
              colorScheme="purple"
              isLoading={isExporting}
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </Button>
          </HStack>
        </HStack>
      </Box>
      
      {/* Content */}
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          {/* Adventure Overview */}
          <Card>
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold">Adventure Overview</Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="semibold" mb={2}>Introduction</Text>
                  <Text fontSize="sm" color="gray.600">
                    {generatedBook.introduction.overview.substring(0, 200)}...
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={2}>Adventure Hooks</Text>
                  <Text fontSize="sm" color="gray.600">
                    {generatedBook.introduction.adventureHooks.length} hooks provided
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={2}>Chapters</Text>
                  <Text fontSize="sm" color="gray.600">
                    {generatedBook.chapters.length} chapters
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={2}>Content</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.600">
                      • {generatedBook.appendices.monsters.length} monsters
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • {generatedBook.appendices.magicItems.length} magic items
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • {generatedBook.appendices.handouts.length} handouts
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
          
          {/* Chapters */}
          <Card>
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold">Chapters</Text>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                {generatedBook.chapters.map((chapter, index) => (
                  <Box key={index} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">
                          Chapter {chapter.number}: {chapter.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {chapter.summary}
                        </Text>
                        <HStack spacing={2}>
                          <Badge size="sm" colorScheme="blue">{chapter.levelRange}</Badge>
                          <Badge size="sm" colorScheme="green">{chapter.estimatedTime}</Badge>
                          <Badge size="sm" colorScheme="purple">{chapter.sections.length} sections</Badge>
                        </HStack>
                      </VStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditSection(`chapter-${chapter.number}`)}
                      >
                        Edit
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
          
          {/* Export Options */}
          <Card>
            <CardHeader>
              <Text fontSize="xl" fontWeight="bold">Export Options</Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Button
                  leftIcon={<Icon as={FaFileExport} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  isLoading={isExporting}
                >
                  Export PDF
                </Button>
                <Button
                  leftIcon={<Icon as={FaDownload} />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => handleExport('html')}
                  isLoading={isExporting}
                >
                  Export HTML
                </Button>
                <Button
                  leftIcon={<Icon as={FaDownload} />}
                  colorScheme="green"
                  variant="outline"
                  onClick={() => handleExport('markdown')}
                  isLoading={isExporting}
                >
                  Export Markdown
                </Button>
                <Button
                  leftIcon={<Icon as={FaShare} />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => handleExport('json')}
                  isLoading={isExporting}
                >
                  Export JSON
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Box>
      
      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaBook} />
              <Text>Adventure Book Preview</Text>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Box maxH="80vh" overflowY="auto">
              <AdventureBookTemplate
                adventure={generatedBook}
                showPreview={true}
                onEdit={handleEditSection}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onPreviewClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              Export PDF
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdventureSourcebookGenerator 