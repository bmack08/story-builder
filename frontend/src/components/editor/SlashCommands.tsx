import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Portal,
  useTheme,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FaDragon, 
  FaUser, 
  FaCog, 
  FaGem, 
  FaMagic, 
  FaFistRaised, 
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaRobot
} from 'react-icons/fa'
import type { SlashCommand, SlashCommandCategory } from '../../types/editor'
import { aiService } from '../../services/aiService'
import AIGenerationDialog from '../ai/AIGenerationDialog'

interface SlashCommandsProps {
  isOpen: boolean
  position: { x: number; y: number }
  onCommand: (command: SlashCommand) => void
  onClose: () => void
  searchQuery?: string
}

// Define available slash commands
const SLASH_COMMANDS: SlashCommand[] = [
  // Content commands
  {
    name: 'Monster',
    description: 'Insert a monster stat block',
    icon: 'dragon',
    command: '/monster',
    category: 'content',
    action: () => {} // Will be implemented
  },
  {
    name: 'NPC',
    description: 'Create a non-player character',
    icon: 'user',
    command: '/npc',
    category: 'content',
    action: () => {}
  },
  {
    name: 'Item',
    description: 'Add a magical or mundane item',
    icon: 'gem',
    command: '/item',
    category: 'content',
    action: () => {}
  },
  {
    name: 'Spell',
    description: 'Insert a spell description',
    icon: 'magic',
    command: '/spell',
    category: 'content',
    action: () => {}
  },
  {
    name: 'Trap',
    description: 'Create a trap or hazard',
    icon: 'exclamation-triangle',
    command: '/trap',
    category: 'content',
    action: () => {}
  },
  {
    name: 'Encounter',
    description: 'Design a combat encounter',
    icon: 'swords',
    command: '/encounter',
    category: 'content',
    action: () => {}
  },
  {
    name: 'Location',
    description: 'Describe a location or area',
    icon: 'map-marker-alt',
    command: '/location',
    category: 'content',
    action: () => {}
  },
  // AI commands
  {
    name: 'Generate Monster',
    description: 'AI-generated monster stat block',
    icon: 'robot',
    command: '/ai-monster',
    category: 'ai',
    action: () => {}
  },
  {
    name: 'Generate NPC',
    description: 'AI-generated NPC with personality',
    icon: 'robot',
    command: '/ai-npc',
    category: 'ai',
    action: () => {}
  },
  {
    name: 'Generate Encounter',
    description: 'AI-balanced encounter for your party',
    icon: 'robot',
    command: '/ai-encounter',
    category: 'ai',
    action: () => {}
  }
]

const COMMAND_ICONS = {
  dragon: FaDragon,
  user: FaUser,
  gem: FaGem,
  magic: FaMagic,
  'exclamation-triangle': FaExclamationTriangle,
  swords: FaFistRaised,
  'map-marker-alt': FaMapMarkerAlt,
  robot: FaRobot,
  cog: FaCog
}

const CATEGORY_COLORS = {
  content: 'brand.500',
  ai: 'purple.500',
  formatting: 'blue.500',
  structure: 'green.500'
}

export const SlashCommands: React.FC<SlashCommandsProps> = ({
  isOpen,
  position,
  onCommand,
  onClose,
  searchQuery = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { isOpen: isAIDialogOpen, onOpen: openAIDialog, onClose: closeAIDialog } = useDisclosure()
  const [selectedAIContentType, setSelectedAIContentType] = useState<DnDContentType>('monster')
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS)
  const containerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.3)')

  // Filter commands based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCommands(SLASH_COMMANDS)
    } else {
      const filtered = SLASH_COMMANDS.filter(command =>
        command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCommands(filtered)
    }
    setSelectedIndex(0)
  }, [searchQuery])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (filteredCommands[selectedIndex]) {
            onCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onCommand, onClose])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleAICommand = (contentType: DnDContentType) => {
    setSelectedAIContentType(contentType)
    openAIDialog()
    onClose()
  }

  const handleAIGenerated = (content: any) => {
    // Insert the generated content into the editor
    let formattedContent = ''
    
    switch (selectedAIContentType) {
      case 'monster':
        formattedContent = formatMonsterContent(content)
        break
      case 'npc':
        formattedContent = formatNPCContent(content)
        break
      case 'encounter':
        formattedContent = formatEncounterContent(content)
        break
      case 'item':
        formattedContent = formatItemContent(content)
        break
      case 'trap':
        formattedContent = formatTrapContent(content)
        break
      case 'spell':
        formattedContent = formatSpellContent(content)
        break
      default:
        formattedContent = JSON.stringify(content, null, 2)
    }

    onCommand(formattedContent)
  }

  const formatMonsterContent = (monster: any) => {
    return `
## ${monster.name}
*${monster.size} ${monster.type}, ${monster.alignment}*

**Armor Class** ${monster.armorClass}  
**Hit Points** ${monster.hitPoints}  
**Speed** ${monster.speed}

**STR** ${monster.abilities.strength} **DEX** ${monster.abilities.dexterity} **CON** ${monster.abilities.constitution} **INT** ${monster.abilities.intelligence} **WIS** ${monster.abilities.wisdom} **CHA** ${monster.abilities.charisma}

**Senses** ${monster.senses}  
**Languages** ${monster.languages}  
**Challenge Rating** ${monster.challengeRating}

### Actions
${monster.actions?.map((action: any) => `**${action.name}.** ${action.description}`).join('\n\n') || ''}

${monster.description ? `\n### Description\n${monster.description}` : ''}
`
  }

  const formatNPCContent = (npc: any) => {
    return `
## ${npc.name}
*${npc.race} ${npc.class}*

**Armor Class** ${npc.armorClass}  
**Hit Points** ${npc.hitPoints}  
**Speed** ${npc.speed}

**STR** ${npc.abilities.strength} **DEX** ${npc.abilities.dexterity} **CON** ${npc.abilities.constitution} **INT** ${npc.abilities.intelligence} **WIS** ${npc.abilities.wisdom} **CHA** ${npc.abilities.charisma}

### Personality
${npc.personality || 'A unique individual with their own motivations and quirks.'}

### Background
${npc.background || 'This character has a rich history that shapes their current role.'}

${npc.equipment?.length ? `### Equipment\n${npc.equipment.join(', ')}` : ''}
`
  }

  const formatEncounterContent = (encounter: any) => {
    return `
## ${encounter.name}
**Difficulty:** ${encounter.difficulty}  
**Environment:** ${encounter.environment || 'Various'}

### Description
${encounter.description || 'An exciting encounter awaits the party.'}

### Creatures
${encounter.creatures?.map((creature: any) => `- ${creature.quantity}x ${creature.name} (CR ${creature.challengeRating})`).join('\n') || ''}

### Tactics
${encounter.tactics || 'The creatures fight strategically, using the environment to their advantage.'}

${encounter.treasure ? `### Treasure\n${encounter.treasure}` : ''}
`
  }

  const formatItemContent = (item: any) => {
    return `
## ${item.name}
*${item.type}${item.rarity ? `, ${item.rarity}` : ''}*

${item.description || 'A mysterious and powerful item.'}

${item.properties?.length ? `### Properties\n${item.properties.map((prop: string) => `- ${prop}`).join('\n')}` : ''}

${item.requiresAttunement ? '**Requires Attunement**' : ''}
`
  }

  const formatTrapContent = (trap: any) => {
    return `
## ${trap.name}
**Type:** ${trap.type || 'Mechanical'}  
**Trigger:** ${trap.trigger || 'Pressure plate'}

### Description
${trap.description || 'A dangerous trap lies in wait.'}

**Detection:** DC ${trap.detectionDC || 15} Perception  
**Disarm:** DC ${trap.disarmDC || 15} Thieves' Tools

### Effect
${trap.effect || 'The trap activates with dangerous consequences.'}
`
  }

  const formatSpellContent = (spell: any) => {
    return `
## ${spell.name}
*${spell.level}${spell.level === 0 ? ' cantrip' : spell.level === 1 ? 'st-level' : spell.level === 2 ? 'nd-level' : spell.level === 3 ? 'rd-level' : 'th-level'} ${spell.school || 'spell'}*

**Casting Time:** ${spell.castingTime || '1 action'}  
**Range:** ${spell.range || '30 feet'}  
**Components:** ${spell.components || 'V, S'}  
**Duration:** ${spell.duration || 'Instantaneous'}

${spell.description || 'A powerful magical effect.'}

${spell.higherLevels ? `**At Higher Levels.** ${spell.higherLevels}` : ''}
`
  }

  if (!isOpen || filteredCommands.length === 0) {
    return null
  }

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<SlashCommandCategory, SlashCommand[]>)

  return (
    <>
      <Portal>
        <Box
          ref={containerRef}
          position="fixed"
          left={`${position.x}px`}
          top={`${position.y}px`}
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow={`0 4px 12px ${shadowColor}`}
          maxW="320px"
          maxH="400px"
          overflowY="auto"
          zIndex={1000}
          p={2}
        >
          <VStack spacing={1} align="stretch">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <Box key={category}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={CATEGORY_COLORS[category as SlashCommandCategory]}
                  textTransform="uppercase"
                  letterSpacing="wide"
                  px={2}
                  py={1}
                >
                  {category}
                </Text>
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  const IconComponent = COMMAND_ICONS[command.icon as keyof typeof COMMAND_ICONS] || FaCog
                  
                  return (
                    <HStack
                      key={command.command}
                      p={2}
                      borderRadius="sm"
                      cursor="pointer"
                      bg={selectedIndex === globalIndex ? 'brand.50' : 'transparent'}
                      _hover={{ bg: 'brand.50' }}
                      _dark={{
                        bg: selectedIndex === globalIndex ? 'brand.900' : 'transparent',
                        _hover: { bg: 'brand.900' }
                      }}
                      onClick={() => onCommand(command)}
                      spacing={3}
                    >
                      <Icon
                        as={IconComponent}
                        color={CATEGORY_COLORS[command.category]}
                        boxSize={4}
                      />
                      <Box flex={1}>
                        <Text fontWeight="medium" fontSize="sm">
                          {command.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {command.description}
                        </Text>
                      </Box>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        fontFamily="mono"
                        bg="gray.100"
                        _dark={{ bg: 'gray.700' }}
                        px={2}
                        py={1}
                        borderRadius="sm"
                      >
                        {command.command}
                      </Text>
                    </HStack>
                  )
                })}
              </Box>
            ))}
          </VStack>
          
          {filteredCommands.length === 0 && (
            <Box p={4} textAlign="center">
              <Text color="gray.500" fontSize="sm">
                No commands found for "{searchQuery}"
              </Text>
            </Box>
          )}
          
          <Box
            borderTop="1px solid"
            borderColor={borderColor}
            pt={2}
            mt={2}
          >
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </Text>
          </Box>
        </Box>
      </Portal>
      
      <AIGenerationDialog
        isOpen={isAIDialogOpen}
        onClose={closeAIDialog}
        contentType={selectedAIContentType}
        onGenerated={handleAIGenerated}
      />
    </>
  )
}

export default SlashCommands 