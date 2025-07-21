import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Textarea,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Flex,
  IconButton,
  Tooltip
} from '@chakra-ui/react'
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaRobot,
  FaEye,
  FaCode,
  FaMagic
} from 'react-icons/fa'
import { aiCommandService } from '../../services/aiCommandService'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: string
  readOnly?: boolean
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your adventure...",
  minHeight = "300px",
  readOnly = false
}) => {
  const [isPreview, setIsPreview] = useState(false)
  const [isProcessingAI, setIsProcessingAI] = useState(false)
  const [aiCommands, setAiCommands] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Detect AI commands in the content
  useEffect(() => {
    const commands = aiCommandService.parseCommands(content)
    setAiCommands(commands.map(cmd => `/${cmd.command} ${cmd.target || ''}`).filter(Boolean))
  }, [content])

  // Process AI commands
  const handleProcessAI = async () => {
    if (!content.includes('/')) return

    setIsProcessingAI(true)
    try {
      const commands = aiCommandService.parseCommands(content)
      if (commands.length > 0) {
        const processedContent = await aiCommandService.processCommands(content, commands)
        onChange(processedContent)
      }
    } catch (error) {
      console.error('Error processing AI commands:', error)
      alert('Error processing AI commands. Please try again.')
    } finally {
      setIsProcessingAI(false)
    }
  }

  // Insert text at cursor position
  const insertTextAtCursor = (text: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    
    onChange(newContent)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  // Format text with markdown-style formatting
  const formatText = (formatType: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ''
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`
        break
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`
        break
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`
        break
      case 'ul':
        formattedText = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- List item'
        break
      case 'ol':
        formattedText = selectedText ? selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n') : '1. List item'
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    onChange(newContent)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + formattedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Insert AI command templates
  const insertAICommand = (command: string) => {
    const commandTemplates = {
      'monster': '/add-monster Goblin',
      'npc': '/add-npc Tavern Keeper',
      'item': '/add-item Magic Sword',
      'spell': '/add-spell Fireball',
      'location': '/add-location Mysterious Cave',
      'encounter': '/add-encounter Combat',
      'trap': '/add-trap Poison Dart Trap'
    }

    const template = commandTemplates[command as keyof typeof commandTemplates]
    if (template) {
      insertTextAtCursor(`\n\n${template}\n\n`)
    }
  }

  // Render content with syntax highlighting for AI commands
  const renderContentWithHighlighting = (text: string) => {
    if (!text) return null

    const lines = text.split('\n')
    return lines.map((line, index) => {
      const isAICommand = line.trim().startsWith('/')
      return (
        <Text
          key={index}
          color={isAICommand ? 'blue.600' : 'gray.800'}
          fontWeight={isAICommand ? 'bold' : 'normal'}
          bg={isAICommand ? 'blue.50' : 'transparent'}
          px={isAICommand ? 2 : 0}
          py={isAICommand ? 1 : 0}
          borderRadius={isAICommand ? 'md' : 0}
          fontFamily={isAICommand ? 'mono' : 'inherit'}
        >
          {line || '\u00A0'}
        </Text>
      )
    })
  }

  // Convert markdown-style content to HTML for preview
  const convertToHTML = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>')
  }

  return (
    <VStack align="stretch" spacing={4} h="100%">
      {/* Toolbar */}
      <Flex justify="space-between" align="center" p={2} bg="gray.50" borderRadius="md">
        <HStack spacing={2}>
          {/* Formatting Tools */}
          <Tooltip label="Bold">
            <IconButton
              aria-label="Bold"
              icon={<FaBold />}
              size="sm"
              variant="outline"
              onClick={() => formatText('bold')}
              isDisabled={readOnly}
            />
          </Tooltip>
          
          <Tooltip label="Italic">
            <IconButton
              aria-label="Italic"
              icon={<FaItalic />}
              size="sm"
              variant="outline"
              onClick={() => formatText('italic')}
              isDisabled={readOnly}
            />
          </Tooltip>
          
          <Tooltip label="Underline">
            <IconButton
              aria-label="Underline"
              icon={<FaUnderline />}
              size="sm"
              variant="outline"
              onClick={() => formatText('underline')}
              isDisabled={readOnly}
            />
          </Tooltip>
          
          <Tooltip label="Bullet List">
            <IconButton
              aria-label="Bullet List"
              icon={<FaListUl />}
              size="sm"
              variant="outline"
              onClick={() => formatText('ul')}
              isDisabled={readOnly}
            />
          </Tooltip>
          
          <Tooltip label="Numbered List">
            <IconButton
              aria-label="Numbered List"
              icon={<FaListOl />}
              size="sm"
              variant="outline"
              onClick={() => formatText('ol')}
              isDisabled={readOnly}
            />
          </Tooltip>

          <Box w="1px" h="20px" bg="gray.300" />

          {/* AI Command Shortcuts */}
          <Tooltip label="Add Monster">
            <Button
              size="sm"
              leftIcon={<FaMagic />}
              variant="outline"
              colorScheme="purple"
              onClick={() => insertAICommand('monster')}
              isDisabled={readOnly}
            >
              Monster
            </Button>
          </Tooltip>
          
          <Tooltip label="Add NPC">
            <Button
              size="sm"
              leftIcon={<FaMagic />}
              variant="outline"
              colorScheme="purple"
              onClick={() => insertAICommand('npc')}
              isDisabled={readOnly}
            >
              NPC
            </Button>
          </Tooltip>
          
          <Tooltip label="Add Item">
            <Button
              size="sm"
              leftIcon={<FaMagic />}
              variant="outline"
              colorScheme="purple"
              onClick={() => insertAICommand('item')}
              isDisabled={readOnly}
            >
              Item
            </Button>
          </Tooltip>
        </HStack>

        <HStack spacing={2}>
          {/* AI Commands Status */}
          {aiCommands.length > 0 && (
            <Badge colorScheme="blue" variant="subtle">
              {aiCommands.length} AI Command{aiCommands.length !== 1 ? 's' : ''}
            </Badge>
          )}

          {/* Process AI Button */}
          <Button
            size="sm"
            leftIcon={<FaRobot />}
            colorScheme="cyan"
            variant={aiCommands.length > 0 ? "solid" : "outline"}
            onClick={handleProcessAI}
            isLoading={isProcessingAI}
            loadingText="Processing..."
            isDisabled={readOnly || aiCommands.length === 0}
          >
            Process AI
          </Button>

          {/* Preview Toggle */}
          <Button
            size="sm"
            leftIcon={isPreview ? <FaCode /> : <FaEye />}
            variant={isPreview ? "solid" : "outline"}
            colorScheme="gray"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </HStack>
      </Flex>

      {/* AI Commands Help */}
      {aiCommands.length > 0 && (
        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="sm" fontWeight="bold" color="blue.800" mb={2}>
            Detected AI Commands:
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            {aiCommands.map((cmd, index) => (
              <Badge key={index} colorScheme="blue" variant="solid" fontSize="xs">
                {cmd}
              </Badge>
            ))}
          </HStack>
          <Text fontSize="xs" color="blue.600" mt={2}>
            Click "Process AI" to replace these commands with D&D content!
          </Text>
        </Box>
      )}

      {/* Editor/Preview Area */}
      <Box flex={1} position="relative">
        {isPreview ? (
          /* Preview Mode */
          <Box
            p={4}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            minH={minHeight}
            maxH="600px"
            overflowY="auto"
            dangerouslySetInnerHTML={{ __html: convertToHTML(content) }}
          />
        ) : (
          /* Edit Mode */
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder={placeholder}
            minH={minHeight}
            maxH="600px"
            resize="vertical"
            fontFamily="mono"
            fontSize="sm"
            lineHeight="1.6"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
            }}
            readOnly={readOnly}
          />
        )}
      </Box>

      {/* Status Bar */}
      <Flex justify="space-between" align="center" p={2} bg="gray.50" borderRadius="md" fontSize="sm" color="gray.600">
        <Text>
          {content.length} characters • {content.split('\n').length} lines
        </Text>
        <HStack spacing={4}>
          <Text>
            Use AI commands like /add-monster, /add-npc, /add-item for intelligent content
          </Text>
          {isProcessingAI && (
            <Badge colorScheme="cyan" variant="subtle">
              Processing AI...
            </Badge>
          )}
        </HStack>
      </Flex>
    </VStack>
  )
}

export default RichTextEditor 