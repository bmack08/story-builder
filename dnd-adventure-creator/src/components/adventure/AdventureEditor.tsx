import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  Text,
  Container,
  Flex,
  Button,
  IconButton,
  Badge,
  Textarea,
  SimpleGrid,
  Spacer
} from '@chakra-ui/react'
import { 
  FaBook, 
  FaScroll, 
  FaSave, 
  FaEye, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaDownload, 
  FaChevronDown,
  FaFileExport,
  FaRobot,
  FaUsers,
  FaMapMarkerAlt,
  FaMagic,
  FaCrown,
  FaStar,
  FaGripVertical
} from 'react-icons/fa'
import RichTextEditor from '../editor/RichTextEditor'
import AdventureBible from '../campaign/AdventureBible'
import { DND_TEMPLATES } from '../editor/DnDContentTemplates'
import { useAdventureStore, AdventureSection } from '../../stores/adventureStore'

interface AdventureEditorProps {
  adventureId?: string
}

export const AdventureEditor: React.FC<AdventureEditorProps> = ({ adventureId }) => {
  const [isBibleOpen, setIsBibleOpen] = useState(false)
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [newSectionType, setNewSectionType] = useState<AdventureSection['sectionType']>('chapter')
  const [activeTab, setActiveTab] = useState('content')
  
  const {
    currentAdventure,
    activeSectionId,
    isPreviewMode,
    hasUnsavedChanges,
    createAdventure,
    saveAdventure,
    exportAdventure,
    addSection,
    updateSection,
    deleteSection,
    setActiveSection,
    setPreviewMode,
    markUnsaved
  } = useAdventureStore()

  // Initialize adventure if none exists
  useEffect(() => {
    if (!currentAdventure && !adventureId) {
      createAdventure('New D&D Adventure', 'An exciting new adventure awaits...')
    }
  }, [currentAdventure, adventureId, createAdventure])

  const activeSection = currentAdventure?.sections.find(s => s.id === activeSectionId)

  const handleSave = async () => {
    try {
      await saveAdventure()
      alert('Adventure saved successfully!')
    } catch (error) {
      alert('Failed to save adventure. Please try again.')
    }
  }

  const handleExport = async (format: 'html' | 'pdf' | 'markdown') => {
    try {
      await exportAdventure(format)
      alert(`Adventure exported as ${format.toUpperCase()} successfully.`)
    } catch (error) {
      alert('Failed to export adventure. Please try again.')
    }
  }

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      alert('Please enter a title for the new section.')
      return
    }

    const newSection = addSection(newSectionTitle, newSectionType)
    setActiveSection(newSection.id)
    setNewSectionTitle('')
    setIsAddingSectionOpen(false)
    alert(`${newSectionTitle} has been added to your adventure.`)
  }

  const handleDeleteSection = (sectionId: string) => {
    if (currentAdventure && currentAdventure.sections.length <= 1) {
      alert('You must have at least one section in your adventure.')
      return
    }

    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(sectionId)
      alert('The section has been removed from your adventure.')
    }
  }

  const handleSectionContentChange = (content: string) => {
    if (activeSection) {
      updateSection(activeSection.id, { content })
      markUnsaved()
    }
  }

  const handleSectionFieldUpdate = (field: keyof AdventureSection, value: any) => {
    if (activeSection) {
      updateSection(activeSection.id, { [field]: value })
      markUnsaved()
    }
  }

  const handleShowTemplates = () => {
    const templatesList = DND_TEMPLATES.map(t => `${t.name} - ${t.description}`).join('\n')
    alert(`Available D&D Templates:\n\n${templatesList}\n\nUse AI commands like /replace-stats or /add-monster to integrate these templates!`)
  }

  const getSectionIcon = (type: AdventureSection['sectionType']) => {
    switch (type) {
      case 'introduction': return FaBook
      case 'chapter': return FaScroll
      case 'appendix': return FaUsers
      case 'encounter': return FaStar
      case 'location': return FaMapMarkerAlt
      default: return FaScroll
    }
  }

  const getSectionColor = (type: AdventureSection['sectionType']) => {
    switch (type) {
      case 'introduction': return 'blue'
      case 'chapter': return 'green'
      case 'appendix': return 'purple'
      case 'encounter': return 'red'
      case 'location': return 'orange'
      default: return 'gray'
    }
  }

  if (!currentAdventure) {
    return (
      <Container maxW="container.xl" p={4}>
        <VStack spacing={4} align="center" justify="center" h="50vh">
          <Text fontSize="lg" color="gray.500">Loading adventure...</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" p={4}>
      <VStack spacing={4} align="stretch" minH="100vh">
        {/* Header */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200" bg="white" borderRadius="md">
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Input
                value={currentAdventure.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateSection(currentAdventure.id, { title: e.target.value } as any)
                  markUnsaved()
                }}
                fontSize="xl"
                fontWeight="bold"
                border="none"
                p={0}
                _focus={{ boxShadow: 'none' }}
                placeholder="Adventure Title"
              />
              <Text fontSize="sm" color="gray.600">
                D&D Adventure Creator • {currentAdventure.sections.length} sections
                {hasUnsavedChanges && (
                  <Badge ml={2} colorScheme="orange" variant="subtle">
                    Unsaved Changes
                  </Badge>
                )}
              </Text>
            </VStack>
            
            <HStack spacing={2}>
              <Button 
                leftIcon={<FaRobot />} 
                colorScheme="cyan" 
                variant="outline"
                onClick={handleShowTemplates}
                title="AI-powered D&D content templates and commands"
              >
                AI Templates
              </Button>
              
              <Button 
                leftIcon={<FaBook />} 
                colorScheme="purple" 
                variant="outline"
                onClick={() => setIsBibleOpen(true)}
              >
                Adventure Bible
              </Button>
              
              <Button 
                leftIcon={<FaEye />}
                colorScheme={isPreviewMode ? "green" : "gray"}
                variant={isPreviewMode ? "solid" : "outline"}
                onClick={() => setPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              
              <Button 
                leftIcon={<FaFileExport />}
                variant="outline"
                onClick={() => handleExport('html')}
              >
                Export HTML
              </Button>
              
              <Button 
                leftIcon={<FaSave />}
                colorScheme={hasUnsavedChanges ? "green" : "gray"}
                variant={hasUnsavedChanges ? "solid" : "outline"}
                onClick={handleSave}
              >
                Save
              </Button>
            </HStack>
          </Flex>

          {/* Adventure Metadata */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Player Levels</Text>
              <Input
                size="sm"
                value={currentAdventure.playerLevels}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Update adventure metadata
                  markUnsaved()
                }}
                placeholder="1-5"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Duration</Text>
              <Input
                size="sm"
                value={currentAdventure.duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Update adventure metadata
                  markUnsaved()
                }}
                placeholder="4-6 hours"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Setting</Text>
              <Input
                size="sm"
                value={currentAdventure.setting}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Update adventure metadata
                  markUnsaved()
                }}
                placeholder="Fantasy"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">Author</Text>
              <Input
                size="sm"
                value={currentAdventure.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Update adventure metadata
                  markUnsaved()
                }}
                placeholder="DM Name"
              />
            </Box>
          </SimpleGrid>
        </Box>

        {/* Main Content Area */}
        <Flex flex={1} gap={4}>
          {/* Sidebar - Section Navigation */}
          <Box w="300px" bg="white" borderRadius="md" p={4} maxH="calc(100vh - 200px)" overflowY="auto">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Sections</Heading>
              <IconButton
                aria-label="Add Section"
                icon={<FaPlus />}
                size="sm"
                colorScheme="green"
                onClick={() => setIsAddingSectionOpen(true)}
              />
            </Flex>

            {/* Add Section Form */}
            {isAddingSectionOpen && (
              <Box mb={4} p={3} bg="gray.50" borderRadius="md">
                <VStack spacing={2} align="stretch">
                  <Input
                    size="sm"
                    placeholder="Section title"
                    value={newSectionTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionTitle(e.target.value)}
                  />
                  <HStack>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={handleAddSection}
                      flex={1}
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingSectionOpen(false)}
                      flex={1}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}

            {/* Section List */}
            <VStack spacing={2} align="stretch">
              {currentAdventure.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                  const SectionIcon = getSectionIcon(section.sectionType)
                  const isActive = section.id === activeSectionId
                  
                  return (
                    <Box
                      key={section.id}
                      p={3}
                      bg={isActive ? 'blue.50' : 'gray.50'}
                      borderRadius="md"
                      borderWidth={isActive ? 2 : 1}
                      borderColor={isActive ? 'blue.200' : 'gray.200'}
                      cursor="pointer"
                      _hover={{ bg: isActive ? 'blue.100' : 'gray.100' }}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Box as={FaGripVertical} color="gray.400" fontSize="sm" />
                          <Box as={SectionIcon} color={`${getSectionColor(section.sectionType)}.500`} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                              {section.title}
                            </Text>
                            <Badge size="sm" colorScheme={getSectionColor(section.sectionType)}>
                              {section.sectionType}
                            </Badge>
                          </VStack>
                        </HStack>
                        <IconButton
                          aria-label="Delete Section"
                          icon={<FaTrash />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            handleDeleteSection(section.id)
                          }}
                        />
                      </Flex>
                    </Box>
                  )
                })}
            </VStack>
          </Box>

          {/* Main Editor Area */}
          <Box flex={1} bg="white" borderRadius="md" p={4}>
            {activeSection ? (
              <VStack align="stretch" spacing={4} h="100%">
                {/* Section Header */}
                <Box>
                  <Input
                    value={activeSection.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionFieldUpdate('title', e.target.value)}
                    fontSize="2xl"
                    fontWeight="bold"
                    border="none"
                    p={0}
                    _focus={{ boxShadow: 'none' }}
                    placeholder="Section Title"
                  />
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {activeSection.sectionType.charAt(0).toUpperCase() + activeSection.sectionType.slice(1)} • 
                    Last modified: {new Date().toLocaleDateString()}
                  </Text>
                </Box>

                <Box h="1px" bg="gray.200" />

                {isPreviewMode ? (
                  /* Preview Mode */
                  <Box flex={1} p={4} bg="gray.50" borderRadius="md" overflowY="auto">
                    <VStack align="stretch" spacing={6}>
                      {/* Adventure Header in Preview */}
                      <Box textAlign="center" borderBottom="3px solid" borderColor="red.600" pb={4}>
                        <Heading size="2xl" color="red.600" mb={2}>
                          {currentAdventure.title.toUpperCase()}
                        </Heading>
                        <Text fontSize="lg">
                          <strong>Levels:</strong> {currentAdventure.playerLevels} • 
                          <strong> Duration:</strong> {currentAdventure.duration}
                        </Text>
                        <Text color="gray.600" mt={2}>{currentAdventure.description}</Text>
                      </Box>

                      {/* Section Content in Preview */}
                      <Box>
                        <Heading size="xl" color="red.600" borderBottom="2px solid" borderColor="red.600" pb={2} mb={4}>
                          {activeSection.title}
                        </Heading>
                        
                        {activeSection.readAloudText && (
                          <Box bg="beige" borderLeft="4px solid" borderColor="red.600" p={4} mb={4}>
                            <Text fontWeight="bold" color="red.600" mb={2}>Read Aloud:</Text>
                            <Text fontStyle="italic">{activeSection.readAloudText}</Text>
                          </Box>
                        )}
                        
                        <Box dangerouslySetInnerHTML={{ __html: activeSection.content }} />
                        
                        {activeSection.dmNotes && (
                          <Box bg="blue.50" borderLeft="4px solid" borderColor="blue.500" p={4} mt={4}>
                            <Text fontWeight="bold" color="blue.600" mb={2}>DM Notes:</Text>
                            <Text>{activeSection.dmNotes}</Text>
                          </Box>
                        )}
                      </Box>
                    </VStack>
                  </Box>
                ) : (
                  /* Edit Mode with Custom Tabs */
                  <VStack align="stretch" spacing={4} flex={1}>
                    {/* Custom Tab Navigation */}
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme={activeTab === 'content' ? 'blue' : 'gray'}
                        variant={activeTab === 'content' ? 'solid' : 'outline'}
                        onClick={() => setActiveTab('content')}
                      >
                        Content
                      </Button>
                      <Button
                        size="sm"
                        colorScheme={activeTab === 'readaloud' ? 'blue' : 'gray'}
                        variant={activeTab === 'readaloud' ? 'solid' : 'outline'}
                        onClick={() => setActiveTab('readaloud')}
                      >
                        Read Aloud
                      </Button>
                      <Button
                        size="sm"
                        colorScheme={activeTab === 'dmnotes' ? 'blue' : 'gray'}
                        variant={activeTab === 'dmnotes' ? 'solid' : 'outline'}
                        onClick={() => setActiveTab('dmnotes')}
                      >
                        DM Notes
                      </Button>
                      {activeSection.sectionType === 'encounter' && (
                        <Button
                          size="sm"
                          colorScheme={activeTab === 'encounter' ? 'blue' : 'gray'}
                          variant={activeTab === 'encounter' ? 'solid' : 'outline'}
                          onClick={() => setActiveTab('encounter')}
                        >
                          Encounter
                        </Button>
                      )}
                    </HStack>
                    
                    {/* Tab Content */}
                    <Box flex={1}>
                      {activeTab === 'content' && (
                        <Box h="100%">
                          <RichTextEditor
                            content={activeSection.content}
                            onChange={handleSectionContentChange}
                            placeholder="Write your section content here... Use AI commands like /add-monster, /replace-stats, or /add-npc to insert D&D content with interactive stat blocks!"
                            minHeight="400px"
                          />
                        </Box>
                      )}
                      
                      {activeTab === 'readaloud' && (
                        <Textarea
                          value={activeSection.readAloudText || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSectionFieldUpdate('readAloudText', e.target.value)}
                          placeholder="Text to read aloud to players..."
                          h="400px"
                          resize="vertical"
                        />
                      )}
                      
                      {activeTab === 'dmnotes' && (
                        <Textarea
                          value={activeSection.dmNotes || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSectionFieldUpdate('dmNotes', e.target.value)}
                          placeholder="Private notes for the DM..."
                          h="400px"
                          resize="vertical"
                        />
                      )}
                      
                      {activeTab === 'encounter' && activeSection.sectionType === 'encounter' && (
                        <VStack align="stretch" spacing={4} p={4}>
                          <Text fontWeight="bold">Encounter Settings</Text>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" mb={2}>XP Budget</Text>
                              <Input
                                type="number"
                                placeholder="1000"
                                value={activeSection.encounterData?.xpBudget || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionFieldUpdate('encounterData', {
                                  ...activeSection.encounterData,
                                  xpBudget: parseInt(e.target.value) || 0
                                })}
                              />
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" mb={2}>Difficulty</Text>
                              <Input
                                placeholder="medium"
                                value={activeSection.encounterData?.difficulty || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSectionFieldUpdate('encounterData', {
                                  ...activeSection.encounterData,
                                  difficulty: e.target.value as any
                                })}
                              />
                            </Box>
                          </SimpleGrid>
                        </VStack>
                      )}
                    </Box>
                  </VStack>
                )}
              </VStack>
            ) : (
              <VStack align="center" justify="center" h="100%" spacing={4}>
                <Box as={FaScroll} fontSize="4xl" color="gray.300" />
                <Text color="gray.500" fontSize="lg">Select a section to start editing</Text>
                <Text color="gray.400" fontSize="sm">
                  Use the sidebar to navigate between sections or add new ones
                </Text>
              </VStack>
            )}
          </Box>
        </Flex>

        {/* Footer Status Bar */}
        <Box p={2} bg="gray.100" borderRadius="md">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              {isPreviewMode ? 'Preview Mode - See how your adventure will look to players' : 'Edit Mode - Use AI commands for intelligent content creation'}
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color="gray.500">
                Sections: {currentAdventure.sections.length}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Stat Blocks: {Object.keys(currentAdventure.statBlocks).length}
              </Text>
              {hasUnsavedChanges && (
                <Badge colorScheme="orange" variant="subtle">
                  Unsaved
                </Badge>
              )}
            </HStack>
          </Flex>
        </Box>
      </VStack>

      {/* Adventure Bible Modal */}
      <AdventureBible
        isOpen={isBibleOpen}
        onClose={() => setIsBibleOpen(false)}
        adventureId={currentAdventure.id}
      />
    </Container>
  )
}

export default AdventureEditor 