import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Divider,
  Grid,
  GridItem,
  Badge,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Card,
  CardBody,
  CardHeader,
  Image,
  SimpleGrid
} from '@chakra-ui/react'
import {
  ReadAloudBox,
  StatBlock,
  Sidebar,
  AreaDescription,
  ChapterHeader,
  EncounterBox
} from './WotCFormatting'

// Adventure Book Structure Types
export interface AdventureBook {
  metadata: {
    title: string
    subtitle?: string
    author: string
    version: string
    createdAt: string
    levelRange: string
    partySize: string
    duration: string
    setting: string
    theme: string
    tone: string
  }
  introduction: {
    overview: string
    adventureSummary: string
    adventureHooks: AdventureHook[]
    backgroundInformation: string
    runningTheAdventure: string
    characterCreation?: string
  }
  chapters: AdventureChapter[]
  appendices: {
    npcs: NPCReference[]
    monsters: MonsterReference[]
    magicItems: MagicItemReference[]
    handouts: HandoutReference[]
    maps: MapReference[]
    additionalRules?: string
  }
  campaignGuide?: {
    afterTheAdventure: string
    expansion: string
    connections: string
  }
}

export interface AdventureHook {
  title: string
  description: string
  suitableFor: string[]
  integration: string
}

export interface AdventureChapter {
  number: number
  title: string
  summary: string
  levelRange: string
  estimatedTime: string
  objectives: string[]
  overview: string
  sections: ChapterSection[]
  milestones: Milestone[]
  dmGuidance: {
    pacing: string
    commonMistakes: string[]
    alternatives: string[]
    flowControl: string
  }
}

export interface ChapterSection {
  id: string
  title: string
  type: 'location' | 'encounter' | 'social' | 'exploration' | 'narrative'
  readAloud?: string
  description: string
  features?: string[]
  creatures?: StatBlockReference[]
  treasure?: TreasureReference[]
  secrets?: string[]
  connections?: string[]
  encounters?: EncounterReference[]
  npcs?: NPCReference[]
  traps?: TrapReference[]
  specialRules?: string
  areaNumber?: string | number
}

export interface Milestone {
  trigger: string
  reward: string
  levelUp?: boolean
  story: string
}

export interface StatBlockReference {
  name: string
  quantity: number
  statBlock: any // Full stat block data
  tactics?: string
  motivation?: string
}

export interface EncounterReference {
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  xp: number
  creatures: string[]
  tactics?: string
  environment?: string
  trigger?: string
  resolution?: string
}

export interface NPCReference {
  name: string
  role: string
  description: string
  personality: string
  appearance: string
  voice?: string
  motivations: string[]
  secrets?: string[]
  statBlock?: any
  relationships?: string[]
}

export interface TreasureReference {
  name: string
  type: 'coins' | 'gems' | 'art' | 'magic' | 'mundane'
  value?: number
  description: string
  hidden?: boolean
  condition?: string
}

export interface TrapReference {
  name: string
  type: 'mechanical' | 'magical' | 'environmental'
  trigger: string
  effect: string
  detectDC: number
  disarmDC: number
  avoidDC?: number
  damage?: string
}

export interface MonsterReference {
  name: string
  page: string
  source: string
  modifications?: string[]
  tactics?: string
  environment?: string[]
}

export interface MagicItemReference {
  name: string
  type: string
  rarity: string
  attunement: boolean
  description: string
  properties: string[]
}

export interface HandoutReference {
  title: string
  type: 'letter' | 'map' | 'document' | 'image' | 'riddle'
  content: string
  whenToUse: string
  notes?: string
}

export interface MapReference {
  title: string
  scale: string
  areas: number
  features: string[]
  secrets: string[]
  connections: string[]
}

// Adventure Book Component
interface AdventureBookProps {
  adventure: AdventureBook
  showPreview?: boolean
  onEdit?: (sectionId: string) => void
}

export const AdventureBookTemplate: React.FC<AdventureBookProps> = ({
  adventure,
  showPreview = false,
  onEdit
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  return (
    <Box
      bg={bgColor}
      maxW="8.5in"
      mx="auto"
      p={8}
      minH="11in"
      boxShadow="0 0 20px rgba(0,0,0,0.1)"
      fontFamily="serif"
    >
      {/* Title Page */}
      <TitlePage metadata={adventure.metadata} />
      
      {/* Table of Contents */}
      <TableOfContents adventure={adventure} />
      
      {/* Introduction */}
      <IntroductionSection introduction={adventure.introduction} />
      
      {/* Chapters */}
      {adventure.chapters.map((chapter) => (
        <ChapterSection
          key={chapter.number}
          chapter={chapter}
          onEdit={onEdit}
        />
      ))}
      
      {/* Appendices */}
      <AppendicesSection appendices={adventure.appendices} />
      
      {/* Campaign Guide */}
      {adventure.campaignGuide && (
        <CampaignGuideSection guide={adventure.campaignGuide} />
      )}
    </Box>
  )
}

// Title Page Component
const TitlePage: React.FC<{ metadata: AdventureBook['metadata'] }> = ({ metadata }) => {
  const titleBg = useColorModeValue('red.600', 'red.400')
  const subtitleColor = useColorModeValue('gray.600', 'gray.400')
  
      return (
      <Box textAlign="center" mb={16} sx={{ pageBreakAfter: 'always' }}>
        <VStack spacing={8} align="center" py={16}>
        <Box>
          <Text fontSize="4xl" fontWeight="bold" mb={2}>
            {metadata.title}
          </Text>
          {metadata.subtitle && (
            <Text fontSize="xl" color={subtitleColor}>
              {metadata.subtitle}
            </Text>
          )}
        </Box>
        
        <Box w="60%" h="1px" bg={titleBg} />
        
        <VStack spacing={4}>
          <Text fontSize="lg">A D&D 5e Adventure</Text>
          <Text fontSize="md">For {metadata.levelRange} Characters</Text>
          <Text fontSize="md">Party Size: {metadata.partySize}</Text>
          <Text fontSize="md">Duration: {metadata.duration}</Text>
        </VStack>
        
        <Box w="60%" h="1px" bg={titleBg} />
        
        <VStack spacing={2}>
          <Text fontSize="md" fontWeight="semibold">By {metadata.author}</Text>
          <Text fontSize="sm" color={subtitleColor}>Version {metadata.version}</Text>
        </VStack>
        
        <Box mt={8}>
          <Badge colorScheme="red" variant="outline" p={2}>
            {metadata.theme} • {metadata.tone}
          </Badge>
        </Box>
      </VStack>
    </Box>
  )
}

// Table of Contents Component
const TableOfContents: React.FC<{ adventure: AdventureBook }> = ({ adventure }) => {
      return (
      <Box mb={12} sx={{ pageBreakAfter: 'always' }}>
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Table of Contents
      </Text>
      
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Text fontWeight="semibold">Introduction</Text>
          <Text>3</Text>
        </HStack>
        
        <Box pl={4}>
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between">
              <Text fontSize="sm">Adventure Overview</Text>
              <Text fontSize="sm">3</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">Adventure Hooks</Text>
              <Text fontSize="sm">4</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">Running the Adventure</Text>
              <Text fontSize="sm">5</Text>
            </HStack>
          </VStack>
        </Box>
        
        <Divider my={2} />
        
        {adventure.chapters.map((chapter, index) => (
          <HStack key={chapter.number} justify="space-between">
            <Text fontWeight="semibold">
              Chapter {chapter.number}: {chapter.title}
            </Text>
            <Text>{6 + index * 8}</Text>
          </HStack>
        ))}
        
        <Divider my={2} />
        
        <HStack justify="space-between">
          <Text fontWeight="semibold">Appendices</Text>
          <Text>{6 + adventure.chapters.length * 8}</Text>
        </HStack>
        
        <Box pl={4}>
          <VStack align="stretch" spacing={1}>
            <HStack justify="space-between">
              <Text fontSize="sm">A: NPCs & Monsters</Text>
              <Text fontSize="sm">{6 + adventure.chapters.length * 8}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">B: Magic Items</Text>
              <Text fontSize="sm">{7 + adventure.chapters.length * 8}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm">C: Handouts</Text>
              <Text fontSize="sm">{8 + adventure.chapters.length * 8}</Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

// Introduction Section Component
const IntroductionSection: React.FC<{ introduction: AdventureBook['introduction'] }> = ({ introduction }) => {
  return (
    <Box mb={12} sx={{ pageBreakAfter: 'always' }}>
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        Introduction
      </Text>
      
      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Adventure Overview</Text>
          <Text lineHeight="1.6">{introduction.overview}</Text>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Adventure Summary</Text>
          <Text lineHeight="1.6">{introduction.adventureSummary}</Text>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Adventure Hooks</Text>
          <VStack align="stretch" spacing={4}>
            {introduction.adventureHooks.map((hook, index) => (
              <Box key={index} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                <Text fontWeight="bold" mb={2}>{hook.title}</Text>
                <Text fontSize="sm" mb={2}>{hook.description}</Text>
                <Text fontSize="xs" fontStyle="italic">
                  Suitable for: {hook.suitableFor.join(', ')}
                </Text>
                <Text fontSize="xs" mt={1}>
                  <strong>Integration:</strong> {hook.integration}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Background Information</Text>
          <Text lineHeight="1.6">{introduction.backgroundInformation}</Text>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Running the Adventure</Text>
          <Text lineHeight="1.6">{introduction.runningTheAdventure}</Text>
        </Box>
        
        {introduction.characterCreation && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={3}>Character Creation</Text>
            <Text lineHeight="1.6">{introduction.characterCreation}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

// Chapter Section Component
const ChapterSection: React.FC<{ 
  chapter: AdventureChapter
  onEdit?: (sectionId: string) => void
}> = ({ chapter, onEdit }) => {
  return (
    <Box mb={12} sx={{ pageBreakBefore: 'always' }}>
      <ChapterHeader
        number={chapter.number}
        title={chapter.title}
        summary={chapter.summary}
        levelRange={chapter.levelRange}
        estimatedTime={chapter.estimatedTime}
        objectives={chapter.objectives}
      />
      
      <Text fontSize="lg" lineHeight="1.6" mb={6}>
        {chapter.overview}
      </Text>
      
      {/* Chapter Sections */}
      <VStack align="stretch" spacing={6}>
        {chapter.sections.map((section) => (
          <ChapterSectionContent
            key={section.id}
            section={section}
            onEdit={onEdit}
          />
        ))}
      </VStack>
      
      {/* Milestones */}
      {chapter.milestones.length > 0 && (
        <Sidebar title="Milestones" variant="info">
          <VStack align="stretch" spacing={2}>
            {chapter.milestones.map((milestone, index) => (
              <Box key={index}>
                <Text fontSize="sm" fontWeight="bold">
                  {milestone.trigger}
                </Text>
                <Text fontSize="xs">{milestone.reward}</Text>
                {milestone.levelUp && (
                  <Badge colorScheme="green" size="sm">Level Up!</Badge>
                )}
              </Box>
            ))}
          </VStack>
        </Sidebar>
      )}
      
      {/* DM Guidance */}
      <Box mt={8} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>DM Guidance</Text>
        <VStack align="stretch" spacing={3}>
          <Box>
            <Text fontSize="md" fontWeight="semibold">Pacing:</Text>
            <Text fontSize="sm">{chapter.dmGuidance.pacing}</Text>
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="semibold">Common Mistakes:</Text>
            <VStack align="stretch" spacing={1}>
              {chapter.dmGuidance.commonMistakes.map((mistake, index) => (
                <Text key={index} fontSize="sm">• {mistake}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="semibold">Alternative Approaches:</Text>
            <VStack align="stretch" spacing={1}>
              {chapter.dmGuidance.alternatives.map((alt, index) => (
                <Text key={index} fontSize="sm">• {alt}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="semibold">Flow Control:</Text>
            <Text fontSize="sm">{chapter.dmGuidance.flowControl}</Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

// Chapter Section Content Component
const ChapterSectionContent: React.FC<{
  section: ChapterSection
  onEdit?: (sectionId: string) => void
}> = ({ section, onEdit }) => {
  const renderSectionContent = () => {
    switch (section.type) {
      case 'location':
        return (
          <AreaDescription
            areaNumber={section.areaNumber || ''}
            title={section.title}
            readAloud={section.readAloud}
            description={section.description}
            features={section.features}
            creatures={section.creatures?.map(c => `${c.quantity}x ${c.name}`)}
            treasure={section.treasure?.map(t => t.name)}
            secrets={section.secrets}
            connections={section.connections}
          />
        )
      case 'encounter':
        return (
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>{section.title}</Text>
            {section.readAloud && (
              <ReadAloudBox>{section.readAloud}</ReadAloudBox>
            )}
            <Text lineHeight="1.6" mb={4}>{section.description}</Text>
            {section.encounters?.map((encounter, index) => (
              <EncounterBox key={index} {...encounter} />
            ))}
          </Box>
        )
      default:
        return (
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>{section.title}</Text>
            {section.readAloud && (
              <ReadAloudBox>{section.readAloud}</ReadAloudBox>
            )}
            <Text lineHeight="1.6">{section.description}</Text>
          </Box>
        )
    }
  }
  
  return (
    <Box position="relative" _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
      {renderSectionContent()}
      
      {/* Edit Button (only shown if onEdit is provided) */}
      {onEdit && (
        <Box
          position="absolute"
          top={2}
          right={2}
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <Text
            fontSize="xs"
            color="blue.500"
            cursor="pointer"
            onClick={() => onEdit(section.id)}
          >
            Edit
          </Text>
        </Box>
      )}
    </Box>
  )
}

// Appendices Section Component
const AppendicesSection: React.FC<{ appendices: AdventureBook['appendices'] }> = ({ appendices }) => {
  return (
    <Box mb={12} sx={{ pageBreakBefore: 'always' }}>
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        Appendices
      </Text>
      
      <VStack align="stretch" spacing={8}>
        {/* Appendix A: NPCs & Monsters */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Appendix A: NPCs & Monsters</Text>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {appendices.monsters.map((monster, index) => (
              <Box key={index} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                <Text fontWeight="bold" mb={2}>{monster.name}</Text>
                <Text fontSize="sm" mb={1}>Source: {monster.source}, page {monster.page}</Text>
                {monster.tactics && (
                  <Text fontSize="sm" mb={1}><strong>Tactics:</strong> {monster.tactics}</Text>
                )}
                {monster.modifications && monster.modifications.length > 0 && (
                  <Text fontSize="sm"><strong>Modifications:</strong> {monster.modifications.join(', ')}</Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        
        {/* Appendix B: Magic Items */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Appendix B: Magic Items</Text>
          <VStack align="stretch" spacing={4}>
            {appendices.magicItems.map((item, index) => (
              <Box key={index} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Badge colorScheme="blue">{item.rarity}</Badge>
                </HStack>
                <Text fontSize="sm" mb={2}>{item.type}{item.attunement ? ' (requires attunement)' : ''}</Text>
                <Text fontSize="sm" mb={2}>{item.description}</Text>
                <VStack align="stretch" spacing={1}>
                  {item.properties.map((prop, idx) => (
                    <Text key={idx} fontSize="xs">• {prop}</Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>
        
        {/* Appendix C: Handouts */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Appendix C: Handouts</Text>
          <VStack align="stretch" spacing={4}>
            {appendices.handouts.map((handout, index) => (
              <Box key={index} p={4} bg={useColorModeValue('yellow.50', 'yellow.900')} borderRadius="md">
                <Text fontWeight="bold" mb={2}>{handout.title}</Text>
                <Badge colorScheme="yellow" mb={2}>{handout.type}</Badge>
                <Text fontSize="sm" mb={2} fontStyle="italic">{handout.content}</Text>
                <Text fontSize="xs"><strong>When to Use:</strong> {handout.whenToUse}</Text>
                {handout.notes && (
                  <Text fontSize="xs" mt={1}><strong>Notes:</strong> {handout.notes}</Text>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

// Campaign Guide Section Component
const CampaignGuideSection: React.FC<{ guide: AdventureBook['campaignGuide'] }> = ({ guide }) => {
  if (!guide) return null
  
  return (
    <Box mb={12} sx={{ pageBreakBefore: 'always' }}>
      <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
        Campaign Guide
      </Text>
      
      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>After the Adventure</Text>
          <Text lineHeight="1.6">{guide.afterTheAdventure}</Text>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Expanding the Campaign</Text>
          <Text lineHeight="1.6">{guide.expansion}</Text>
        </Box>
        
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={3}>Connections to Other Adventures</Text>
          <Text lineHeight="1.6">{guide.connections}</Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default AdventureBookTemplate 