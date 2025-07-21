import React from 'react'
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Grid,
  GridItem,
  useColorModeValue
} from '@chakra-ui/react'

// WotC-style Boxed Read-Aloud Text
interface ReadAloudBoxProps {
  children: React.ReactNode
  bg?: string
}

export const ReadAloudBox: React.FC<ReadAloudBoxProps> = ({ children, bg }) => {
  const boxBg = useColorModeValue(
    bg || 'gray.50',
    bg || 'gray.700'
  )
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  return (
    <Box
      bg={boxBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      my={4}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        bg: 'red.500',
        borderRadius: '2px 0 0 2px'
      }}
    >
      <Text
        fontStyle="italic"
        fontSize="md"
        lineHeight="1.6"
        color={useColorModeValue('gray.800', 'gray.200')}
      >
        {children}
      </Text>
    </Box>
  )
}

// Professional D&D 5e Stat Block
interface StatBlockProps {
  creature: {
    name: string
    size: string
    type: string
    alignment: string
    armorClass: number
    hitPoints: number
    hitDice?: string
    speed: string
    abilities: {
      strength: number
      dexterity: number
      constitution: number
      intelligence: number
      wisdom: number
      charisma: number
    }
    savingThrows?: Record<string, number>
    skills?: Record<string, number>
    damageResistances?: string[]
    damageImmunities?: string[]
    damageVulnerabilities?: string[]
    conditionImmunities?: string[]
    senses: string
    languages: string
    challengeRating: string
    proficiencyBonus?: number
    actions?: Array<{
      name: string
      description: string
      attackBonus?: number
      damage?: string
      damageType?: string
    }>
    legendaryActions?: Array<{
      name: string
      description: string
      cost?: number
    }>
    spells?: {
      spellcasting: string
      spellList: Record<string, string[]>
    }
    traits?: Array<{
      name: string
      description: string
    }>
  }
}

export const StatBlock: React.FC<StatBlockProps> = ({ creature }) => {
  const bgColor = useColorModeValue('red.50', 'red.900')
  const borderColor = useColorModeValue('red.200', 'red.600')
  const headerBg = useColorModeValue('red.100', 'red.800')
  
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2)
    return mod >= 0 ? `+${mod}` : `${mod}`
  }
  
  const formatAbilityScore = (score: number): string => {
    return `${score} (${getModifier(score)})`
  }
  
  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      my={4}
      maxW="400px"
      fontFamily="serif"
    >
      {/* Header */}
      <VStack align="stretch" spacing={2}>
        <Box bg={headerBg} p={2} borderRadius="md" textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="red.700">
            {creature.name}
          </Text>
          <Text fontSize="sm" fontStyle="italic">
            {creature.size} {creature.type}, {creature.alignment}
          </Text>
        </Box>
        
        <Divider borderColor={borderColor} />
        
        {/* Basic Stats */}
        <VStack align="stretch" spacing={1}>
          <HStack>
            <Text fontWeight="bold" minW="80px">Armor Class</Text>
            <Text>{creature.armorClass}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" minW="80px">Hit Points</Text>
            <Text>{creature.hitPoints} {creature.hitDice && `(${creature.hitDice})`}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" minW="80px">Speed</Text>
            <Text>{creature.speed}</Text>
          </HStack>
        </VStack>
        
        <Divider borderColor={borderColor} />
        
        {/* Abilities */}
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th textAlign="center" fontSize="xs">STR</Th>
              <Th textAlign="center" fontSize="xs">DEX</Th>
              <Th textAlign="center" fontSize="xs">CON</Th>
              <Th textAlign="center" fontSize="xs">INT</Th>
              <Th textAlign="center" fontSize="xs">WIS</Th>
              <Th textAlign="center" fontSize="xs">CHA</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.strength)}</Td>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.dexterity)}</Td>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.constitution)}</Td>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.intelligence)}</Td>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.wisdom)}</Td>
              <Td textAlign="center" fontSize="xs">{formatAbilityScore(creature.abilities.charisma)}</Td>
            </Tr>
          </Tbody>
        </Table>
        
        <Divider borderColor={borderColor} />
        
        {/* Skills and Resistances */}
        <VStack align="stretch" spacing={1} fontSize="sm">
          {creature.savingThrows && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Saving Throws</Text>
              <Text>{Object.entries(creature.savingThrows).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} +${value}`).join(', ')}</Text>
            </HStack>
          )}
          
          {creature.skills && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Skills</Text>
              <Text>{Object.entries(creature.skills).map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)} +${value}`).join(', ')}</Text>
            </HStack>
          )}
          
          {creature.damageVulnerabilities && creature.damageVulnerabilities.length > 0 && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Damage Vulnerabilities</Text>
              <Text>{creature.damageVulnerabilities.join(', ')}</Text>
            </HStack>
          )}
          
          {creature.damageResistances && creature.damageResistances.length > 0 && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Damage Resistances</Text>
              <Text>{creature.damageResistances.join(', ')}</Text>
            </HStack>
          )}
          
          {creature.damageImmunities && creature.damageImmunities.length > 0 && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Damage Immunities</Text>
              <Text>{creature.damageImmunities.join(', ')}</Text>
            </HStack>
          )}
          
          {creature.conditionImmunities && creature.conditionImmunities.length > 0 && (
            <HStack>
              <Text fontWeight="bold" minW="120px">Condition Immunities</Text>
              <Text>{creature.conditionImmunities.join(', ')}</Text>
            </HStack>
          )}
          
          <HStack>
            <Text fontWeight="bold" minW="120px">Senses</Text>
            <Text>{creature.senses}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minW="120px">Languages</Text>
            <Text>{creature.languages}</Text>
          </HStack>
          
          <HStack>
            <Text fontWeight="bold" minW="120px">Challenge</Text>
            <Text>{creature.challengeRating} ({creature.proficiencyBonus ? `PB +${creature.proficiencyBonus}` : ''})</Text>
          </HStack>
        </VStack>
        
        <Divider borderColor={borderColor} />
        
        {/* Traits */}
        {creature.traits && creature.traits.length > 0 && (
          <VStack align="stretch" spacing={2}>
            {creature.traits.map((trait, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm">{trait.name}.</Text>
                <Text fontSize="sm">{trait.description}</Text>
              </Box>
            ))}
            <Divider borderColor={borderColor} />
          </VStack>
        )}
        
        {/* Spellcasting */}
        {creature.spells && (
          <VStack align="stretch" spacing={2}>
            <Box>
              <Text fontWeight="bold" fontSize="sm">Spellcasting.</Text>
              <Text fontSize="sm">{creature.spells.spellcasting}</Text>
            </Box>
            {Object.entries(creature.spells.spellList).map(([level, spells]) => (
              <Box key={level}>
                <Text fontWeight="bold" fontSize="sm">{level}:</Text>
                <Text fontSize="sm">{spells.join(', ')}</Text>
              </Box>
            ))}
            <Divider borderColor={borderColor} />
          </VStack>
        )}
        
        {/* Actions */}
        {creature.actions && creature.actions.length > 0 && (
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold" fontSize="md" color="red.700">ACTIONS</Text>
            {creature.actions.map((action, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm">{action.name}.</Text>
                <Text fontSize="sm">{action.description}</Text>
              </Box>
            ))}
          </VStack>
        )}
        
        {/* Legendary Actions */}
        {creature.legendaryActions && creature.legendaryActions.length > 0 && (
          <VStack align="stretch" spacing={2}>
            <Divider borderColor={borderColor} />
            <Text fontWeight="bold" fontSize="md" color="red.700">LEGENDARY ACTIONS</Text>
            <Text fontSize="sm">
              {creature.name} can take 3 legendary actions, choosing from the options below. 
              Only one legendary action option can be used at a time and only at the end of another creature's turn. 
              {creature.name} regains spent legendary actions at the start of its turn.
            </Text>
            {creature.legendaryActions.map((action, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm">
                  {action.name} {action.cost && action.cost > 1 ? `(Costs ${action.cost} Actions)` : ''}.
                </Text>
                <Text fontSize="sm">{action.description}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

// WotC-style Sidebar
interface SidebarProps {
  title: string
  children: React.ReactNode
  variant?: 'default' | 'warning' | 'info' | 'tip'
}

export const Sidebar: React.FC<SidebarProps> = ({ title, children, variant = 'default' }) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'warning':
        return {
          bg: useColorModeValue('yellow.50', 'yellow.900'),
          borderColor: useColorModeValue('yellow.200', 'yellow.600'),
          titleColor: 'yellow.700'
        }
      case 'info':
        return {
          bg: useColorModeValue('blue.50', 'blue.900'),
          borderColor: useColorModeValue('blue.200', 'blue.600'),
          titleColor: 'blue.700'
        }
      case 'tip':
        return {
          bg: useColorModeValue('green.50', 'green.900'),
          borderColor: useColorModeValue('green.200', 'green.600'),
          titleColor: 'green.700'
        }
      default:
        return {
          bg: useColorModeValue('gray.50', 'gray.800'),
          borderColor: useColorModeValue('gray.200', 'gray.600'),
          titleColor: 'gray.700'
        }
    }
  }
  
  const colors = getVariantColors()
  
  return (
    <Box
      bg={colors.bg}
      border="1px solid"
      borderColor={colors.borderColor}
      borderRadius="md"
      p={4}
      my={4}
      maxW="300px"
      ml={4}
      float="right"
      clear="both"
    >
      <Text fontWeight="bold" fontSize="md" color={colors.titleColor} mb={2}>
        {title}
      </Text>
      <Text fontSize="sm" lineHeight="1.5">
        {children}
      </Text>
    </Box>
  )
}

// Area Description with Map Reference
interface AreaDescriptionProps {
  areaNumber: string | number
  title: string
  readAloud?: string
  description?: string
  features?: string[]
  creatures?: string[]
  treasure?: string[]
  secrets?: string[]
  connections?: string[]
}

export const AreaDescription: React.FC<AreaDescriptionProps> = ({
  areaNumber,
  title,
  readAloud,
  description,
  features,
  creatures,
  treasure,
  secrets,
  connections
}) => {
  const headerBg = useColorModeValue('red.100', 'red.800')
  const headerColor = useColorModeValue('red.800', 'red.200')
  
  return (
    <Box my={6}>
      {/* Area Header */}
      <Box bg={headerBg} p={3} borderRadius="md" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={headerColor}>
          {areaNumber}. {title}
        </Text>
      </Box>
      
      {/* Read Aloud Text */}
      {readAloud && (
        <ReadAloudBox>
          {readAloud}
        </ReadAloudBox>
      )}
      
      {/* Description */}
      {description && (
        <Text mb={4} lineHeight="1.6">
          {description}
        </Text>
      )}
      
      {/* Features */}
      {features && features.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={2}>Features:</Text>
          <VStack align="stretch" spacing={1}>
            {features.map((feature, index) => (
              <Text key={index} fontSize="sm">• {feature}</Text>
            ))}
          </VStack>
        </Box>
      )}
      
      {/* Creatures */}
      {creatures && creatures.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={2}>Creatures:</Text>
          <VStack align="stretch" spacing={1}>
            {creatures.map((creature, index) => (
              <Text key={index} fontSize="sm">• {creature}</Text>
            ))}
          </VStack>
        </Box>
      )}
      
      {/* Treasure */}
      {treasure && treasure.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={2}>Treasure:</Text>
          <VStack align="stretch" spacing={1}>
            {treasure.map((item, index) => (
              <Text key={index} fontSize="sm">• {item}</Text>
            ))}
          </VStack>
        </Box>
      )}
      
      {/* Secrets */}
      {secrets && secrets.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={2}>Secrets:</Text>
          <VStack align="stretch" spacing={1}>
            {secrets.map((secret, index) => (
              <Text key={index} fontSize="sm">• {secret}</Text>
            ))}
          </VStack>
        </Box>
      )}
      
      {/* Connections */}
      {connections && connections.length > 0 && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={2}>Connections:</Text>
          <VStack align="stretch" spacing={1}>
            {connections.map((connection, index) => (
              <Text key={index} fontSize="sm">• {connection}</Text>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  )
}

// Chapter Header
interface ChapterHeaderProps {
  number: number
  title: string
  summary?: string
  levelRange?: string
  estimatedTime?: string
  objectives?: string[]
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  number,
  title,
  summary,
  levelRange,
  estimatedTime,
  objectives
}) => {
  const headerBg = useColorModeValue('red.600', 'red.400')
  const summaryBg = useColorModeValue('red.50', 'red.900')
  
  return (
    <Box my={8}>
      {/* Chapter Title */}
      <Box bg={headerBg} color="white" p={6} borderRadius="md" textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          Chapter {number}
        </Text>
        <Text fontSize="2xl" fontWeight="semibold">
          {title}
        </Text>
      </Box>
      
      {/* Chapter Info */}
      <Box bg={summaryBg} p={4} borderRadius="md" mt={4}>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mb={4}>
          {levelRange && (
            <Box>
              <Text fontWeight="bold" fontSize="sm">Level Range:</Text>
              <Text fontSize="sm">{levelRange}</Text>
            </Box>
          )}
          {estimatedTime && (
            <Box>
              <Text fontWeight="bold" fontSize="sm">Estimated Time:</Text>
              <Text fontSize="sm">{estimatedTime}</Text>
            </Box>
          )}
        </Grid>
        
        {summary && (
          <Box mb={4}>
            <Text fontWeight="bold" fontSize="md" mb={2}>Chapter Summary:</Text>
            <Text fontSize="sm" lineHeight="1.6">
              {summary}
            </Text>
          </Box>
        )}
        
        {objectives && objectives.length > 0 && (
          <Box>
            <Text fontWeight="bold" fontSize="md" mb={2}>Objectives:</Text>
            <VStack align="stretch" spacing={1}>
              {objectives.map((objective, index) => (
                <Text key={index} fontSize="sm">• {objective}</Text>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// Encounter Box
interface EncounterBoxProps {
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  xp: number
  creatures: string[]
  tactics?: string
  environment?: string
}

export const EncounterBox: React.FC<EncounterBoxProps> = ({
  title,
  difficulty,
  xp,
  creatures,
  tactics,
  environment
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'green'
      case 'medium': return 'yellow'
      case 'hard': return 'orange'
      case 'deadly': return 'red'
      default: return 'gray'
    }
  }
  
  const difficultyColor = getDifficultyColor()
  const bgColor = useColorModeValue(`${difficultyColor}.50`, `${difficultyColor}.900`)
  const borderColor = useColorModeValue(`${difficultyColor}.200`, `${difficultyColor}.600`)
  
  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      my={4}
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <HStack>
          <Badge colorScheme={difficultyColor} textTransform="uppercase">
            {difficulty}
          </Badge>
          <Badge variant="outline">
            {xp} XP
          </Badge>
        </HStack>
      </Flex>
      
      <VStack align="stretch" spacing={2}>
        <Box>
          <Text fontWeight="bold" fontSize="sm">Creatures:</Text>
          <VStack align="stretch" spacing={1}>
            {creatures.map((creature, index) => (
              <Text key={index} fontSize="sm">• {creature}</Text>
            ))}
          </VStack>
        </Box>
        
        {environment && (
          <Box>
            <Text fontWeight="bold" fontSize="sm">Environment:</Text>
            <Text fontSize="sm">{environment}</Text>
          </Box>
        )}
        
        {tactics && (
          <Box>
            <Text fontWeight="bold" fontSize="sm">Tactics:</Text>
            <Text fontSize="sm">{tactics}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
} 