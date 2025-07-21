import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  Text,
  Container,
  Flex,
  Button
} from '@chakra-ui/react'
import { FaBook, FaScroll } from 'react-icons/fa'
import RichTextEditor from './RichTextEditor'
import AdventureBible from '../campaign/AdventureBible'
import { DND_TEMPLATES, getTemplatesByCategory } from './DnDContentTemplates'

interface EditorPageProps {
  adventureId?: string
}

export const EditorPage: React.FC<EditorPageProps> = ({ adventureId }) => {
  const [title, setTitle] = useState('New D&D Adventure')
  const [content, setContent] = useState('<p>Start writing your adventure here...</p>')
  const [isBibleOpen, setIsBibleOpen] = useState(false)

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving adventure:', { title, content })
    alert('Save functionality coming soon!')
  }

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Previewing adventure:', { title, content })
    alert('Preview functionality coming soon!')
  }

  const handleShowTemplates = () => {
    const templatesList = DND_TEMPLATES.map(t => `${t.name} - ${t.description}`).join('\n')
    alert(`Available D&D Templates:\n\n${templatesList}\n\nTemplates will be integrated into the editor soon!`)
  }

  return (
    <Container maxW="container.xl" p={4}>
      <VStack spacing={4} align="stretch" h="100vh">
        {/* Header */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200" bg="white" borderRadius="md">
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Input
                value={title}
                onChange={handleTitleChange}
                fontSize="xl"
                fontWeight="bold"
                border="none"
                p={0}
                _focus={{ boxShadow: 'none' }}
                placeholder="Adventure Title"
              />
              <Text fontSize="sm" color="gray.600">
                D&D Adventure Creator
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Button 
                leftIcon={<FaScroll />} 
                colorScheme="green" 
                variant="outline"
                onClick={handleShowTemplates}
                title="View available D&D content templates with official formatting"
              >
                D&D Templates
              </Button>
              <Button 
                leftIcon={<FaBook />} 
                colorScheme="purple" 
                variant="outline"
                onClick={() => setIsBibleOpen(true)}
              >
                Adventure Bible
              </Button>
              <Button colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Main Content */}
        <Box flex={1} bg="white" borderRadius="md" p={4}>
          <VStack align="stretch" spacing={4} h="100%">
            <Heading size="lg" color="gray.800">
              {title.toUpperCase()}
            </Heading>
            
            {/* Rich Text Editor */}
            <Box flex={1}>
              <RichTextEditor
                content={content}
                onChange={handleContentChange}
                placeholder="Start writing your D&D adventure... Use the D&D Templates button above to see available official content blocks, or type / for quick commands"
                minHeight="500px"
              />
            </Box>
          </VStack>
        </Box>

        {/* Footer Status Bar */}
        <Box p={2} bg="gray.100" borderRadius="md">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              Ready to create your adventure - Use D&D Templates for official formatting or Adventure Bible to manage campaign elements
            </Text>
            <Text fontSize="sm" color="gray.500">
              Mode: Edit
            </Text>
          </Flex>
        </Box>
      </VStack>

      {/* Adventure Bible Modal */}
      <AdventureBible
        isOpen={isBibleOpen}
        onClose={() => setIsBibleOpen(false)}
        adventureId={adventureId}
      />
    </Container>
  )
}

export default EditorPage 