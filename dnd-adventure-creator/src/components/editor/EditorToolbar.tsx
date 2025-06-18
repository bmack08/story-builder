import React from 'react'
import {
  HStack,
  IconButton,
  Divider,
  ButtonGroup,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaUndo,
  FaRedo,
  FaHeading,
  FaLink,
  FaImage,
  FaTable,
  FaSave,
  FaEye,
  FaUsers
} from 'react-icons/fa'

interface EditorToolbarProps {
  editor: any // Tiptap editor instance
  onSave?: () => void
  onPreview?: () => void
  onCollaborate?: () => void
  canUndo?: boolean
  canRedo?: boolean
  hasChanges?: boolean
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onSave,
  onPreview,
  onCollaborate,
  canUndo = false,
  canRedo = false,
  hasChanges = false
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  if (!editor) {
    return null
  }

  const isActive = (name: string, attributes?: Record<string, any>) => {
    return editor.isActive(name, attributes)
  }

  const toggleFormat = (format: string, attributes?: Record<string, any>) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run()
        break
      case 'heading':
        if (attributes?.level) {
          editor.chain().focus().toggleHeading({ level: attributes.level }).run()
        }
        break
    }
  }

  const handleUndo = () => {
    editor.chain().focus().undo().run()
  }

  const handleRedo = () => {
    editor.chain().focus().redo().run()
  }

  return (
    <HStack
      spacing={1}
      p={2}
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      borderTopRadius="md"
      wrap="wrap"
    >
      {/* Undo/Redo */}
      <ButtonGroup size="sm" isAttached variant="ghost">
        <Tooltip label="Undo">
          <IconButton
            aria-label="Undo"
            icon={<FaUndo />}
            onClick={handleUndo}
            isDisabled={!canUndo}
          />
        </Tooltip>
        <Tooltip label="Redo">
          <IconButton
            aria-label="Redo"
            icon={<FaRedo />}
            onClick={handleRedo}
            isDisabled={!canRedo}
          />
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" h={6} />

      {/* Text Formatting */}
      <ButtonGroup size="sm" isAttached variant="ghost">
        <Tooltip label="Bold">
          <IconButton
            aria-label="Bold"
            icon={<FaBold />}
            onClick={() => toggleFormat('bold')}
            colorScheme={isActive('bold') ? 'brand' : 'gray'}
            variant={isActive('bold') ? 'solid' : 'ghost'}
          />
        </Tooltip>
        <Tooltip label="Italic">
          <IconButton
            aria-label="Italic"
            icon={<FaItalic />}
            onClick={() => toggleFormat('italic')}
            colorScheme={isActive('italic') ? 'brand' : 'gray'}
            variant={isActive('italic') ? 'solid' : 'ghost'}
          />
        </Tooltip>
        <Tooltip label="Underline">
          <IconButton
            aria-label="Underline"
            icon={<FaUnderline />}
            onClick={() => toggleFormat('underline')}
            colorScheme={isActive('underline') ? 'brand' : 'gray'}
            variant={isActive('underline') ? 'solid' : 'ghost'}
          />
        </Tooltip>
        <Tooltip label="Strikethrough">
          <IconButton
            aria-label="Strikethrough"
            icon={<FaStrikethrough />}
            onClick={() => toggleFormat('strike')}
            colorScheme={isActive('strike') ? 'brand' : 'gray'}
            variant={isActive('strike') ? 'solid' : 'ghost'}
          />
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" h={6} />

      {/* Headings */}
      <ButtonGroup size="sm" isAttached variant="ghost">
        <Tooltip label="Heading 1">
          <IconButton
            aria-label="Heading 1"
            icon={<FaHeading />}
            onClick={() => toggleFormat('heading', { level: 1 })}
            colorScheme={isActive('heading', { level: 1 }) ? 'brand' : 'gray'}
            variant={isActive('heading', { level: 1 }) ? 'solid' : 'ghost'}
            fontSize="lg"
          />
        </Tooltip>
        <Tooltip label="Heading 2">
          <IconButton
            aria-label="Heading 2"
            icon={<FaHeading />}
            onClick={() => toggleFormat('heading', { level: 2 })}
            colorScheme={isActive('heading', { level: 2 }) ? 'brand' : 'gray'}
            variant={isActive('heading', { level: 2 }) ? 'solid' : 'ghost'}
            fontSize="md"
          />
        </Tooltip>
        <Tooltip label="Heading 3">
          <IconButton
            aria-label="Heading 3"
            icon={<FaHeading />}
            onClick={() => toggleFormat('heading', { level: 3 })}
            colorScheme={isActive('heading', { level: 3 }) ? 'brand' : 'gray'}
            variant={isActive('heading', { level: 3 }) ? 'solid' : 'ghost'}
            fontSize="sm"
          />
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" h={6} />

      {/* Lists and Quotes */}
      <ButtonGroup size="sm" isAttached variant="ghost">
        <Tooltip label="Bullet List">
          <IconButton
            aria-label="Bullet List"
            icon={<FaListUl />}
            onClick={() => toggleFormat('bulletList')}
            colorScheme={isActive('bulletList') ? 'brand' : 'gray'}
            variant={isActive('bulletList') ? 'solid' : 'ghost'}
          />
        </Tooltip>
        <Tooltip label="Numbered List">
          <IconButton
            aria-label="Numbered List"
            icon={<FaListOl />}
            onClick={() => toggleFormat('orderedList')}
            colorScheme={isActive('orderedList') ? 'brand' : 'gray'}
            variant={isActive('orderedList') ? 'solid' : 'ghost'}
          />
        </Tooltip>
        <Tooltip label="Quote">
          <IconButton
            aria-label="Quote"
            icon={<FaQuoteLeft />}
            onClick={() => toggleFormat('blockquote')}
            colorScheme={isActive('blockquote') ? 'brand' : 'gray'}
            variant={isActive('blockquote') ? 'solid' : 'ghost'}
          />
        </Tooltip>
      </ButtonGroup>

      <Divider orientation="vertical" h={6} />

      {/* Code */}
      <ButtonGroup size="sm" isAttached variant="ghost">
        <Tooltip label="Inline Code">
          <IconButton
            aria-label="Inline Code"
            icon={<FaCode />}
            onClick={() => toggleFormat('code')}
            colorScheme={isActive('code') ? 'brand' : 'gray'}
            variant={isActive('code') ? 'solid' : 'ghost'}
          />
        </Tooltip>
      </ButtonGroup>

      {/* Spacer to push action buttons to the right */}
      <div style={{ flex: 1 }} />

      {/* Action Buttons */}
      <ButtonGroup size="sm" variant="ghost">
        {onCollaborate && (
          <Tooltip label="Collaborate">
            <IconButton
              aria-label="Collaborate"
              icon={<FaUsers />}
              onClick={onCollaborate}
              colorScheme="purple"
            />
          </Tooltip>
        )}
        {onPreview && (
          <Tooltip label="Preview">
            <IconButton
              aria-label="Preview"
              icon={<FaEye />}
              onClick={onPreview}
              colorScheme="blue"
            />
          </Tooltip>
        )}
        {onSave && (
          <Tooltip label={hasChanges ? "Save Changes" : "Saved"}>
            <IconButton
              aria-label="Save"
              icon={<FaSave />}
              onClick={onSave}
              colorScheme={hasChanges ? "green" : "gray"}
              variant={hasChanges ? "solid" : "ghost"}
            />
          </Tooltip>
        )}
      </ButtonGroup>
    </HStack>
  )
}

export default EditorToolbar 