import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  IconButton,
  Text,
  Badge,
  Heading,
  SimpleGrid,
  Stack,
  Flex,
  Spacer
} from '@chakra-ui/react'
import { 
  FaUsers, 
  FaMapMarkerAlt, 
  FaMagic, 
  FaScroll, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBook,
  FaStar,
  FaCrown,
  FaSave,
  FaTimes
} from 'react-icons/fa'

interface AdventureBibleItem {
  id: string
  name: string
  description: string
  details: string
  tags: string[]
  createdAt: string
  [key: string]: any
}

interface AdventureBible {
  characters: AdventureBibleItem[]
  locations: AdventureBibleItem[]
  items: AdventureBibleItem[]
  lore: AdventureBibleItem[]
  organizations: AdventureBibleItem[]
  quests: AdventureBibleItem[]
}

interface AdventureBibleProps {
  isOpen: boolean
  onClose: () => void
  adventureId?: string
}

export const AdventureBible: React.FC<AdventureBibleProps> = ({ isOpen, onClose, adventureId }) => {
  const [activeTab, setActiveTab] = useState('characters')
  const [editingItem, setEditingItem] = useState<AdventureBibleItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  
  // Initialize adventure bible data
  const [adventureBible, setAdventureBible] = useState<AdventureBible>({
    characters: [],
    locations: [],
    items: [],
    lore: [],
    organizations: [],
    quests: []
  })

  const categories = [
    { key: 'characters', label: 'Characters', icon: FaUsers, color: 'blue' },
    { key: 'locations', label: 'Locations', icon: FaMapMarkerAlt, color: 'green' },
    { key: 'items', label: 'Items', icon: FaMagic, color: 'purple' },
    { key: 'lore', label: 'Lore & History', icon: FaScroll, color: 'orange' },
    { key: 'organizations', label: 'Organizations', icon: FaCrown, color: 'red' },
    { key: 'quests', label: 'Quests', icon: FaStar, color: 'teal' }
  ]

  const currentCategory = activeTab as keyof AdventureBible

  const handleSaveItem = (item: AdventureBibleItem) => {
    const updatedBible = { ...adventureBible }
    
    if (item.id && updatedBible[currentCategory].find(i => i.id === item.id)) {
      // Update existing item
      const index = updatedBible[currentCategory].findIndex(i => i.id === item.id)
      if (index !== -1) {
        updatedBible[currentCategory][index] = item
      }
    } else {
      // Add new item
      item.id = Date.now().toString()
      item.createdAt = new Date().toISOString()
      updatedBible[currentCategory].push(item)
    }
    
    setAdventureBible(updatedBible)
    setEditingItem(null)
    setIsAddingNew(false)
  }

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedBible = { ...adventureBible }
      updatedBible[currentCategory] = updatedBible[currentCategory].filter(i => i.id !== itemId)
      setAdventureBible(updatedBible)
    }
  }

  const handleAddNew = () => {
    const newItemTemplate: AdventureBibleItem = {
      id: '',
      name: '',
      description: '',
      details: '',
      tags: [],
      createdAt: ''
    }
    setEditingItem(newItemTemplate)
    setIsAddingNew(true)
  }

  const ItemEditForm: React.FC<{
    item: AdventureBibleItem
    onSave: (item: AdventureBibleItem) => void
    onCancel: () => void
  }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item)

    const handleSubmit = () => {
      if (!formData.name.trim()) {
        alert('Name is required')
        return
      }
      onSave(formData)
    }

    const updateField = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
      <Box
        p={6}
        bg="gray.50"
        borderRadius="lg"
        borderWidth={2}
        borderColor="blue.200"
      >
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="md">
              {item.id ? 'Edit' : 'Add New'} {categories.find(c => c.key === currentCategory)?.label.slice(0, -1)}
            </Heading>
            <HStack>
              <Button
                leftIcon={<FaSave />}
                colorScheme="green"
                size="sm"
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                leftIcon={<FaTimes />}
                colorScheme="red"
                size="sm"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </HStack>
          </Flex>
          
          <Box>
            <Text fontWeight="bold" mb={2}>Name *</Text>
            <Input
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
              placeholder="Enter name..."
              bg="white"
            />
          </Box>
          
          <Box>
            <Text fontWeight="bold" mb={2}>Description</Text>
            <Textarea
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('description', e.target.value)}
              placeholder="Brief description..."
              rows={2}
              bg="white"
            />
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>Additional Details</Text>
            <Textarea
              value={formData.details}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('details', e.target.value)}
              placeholder="Additional notes, secrets, or details..."
              rows={4}
              bg="white"
            />
          </Box>
        </VStack>
      </Box>
    )
  }

  const renderItemCard = (item: AdventureBibleItem) => {
    const categoryInfo = categories.find(c => c.key === currentCategory)
    
    return (
      <Box 
        key={item.id}
        p={4}
        bg="white"
        borderRadius="lg"
        borderWidth={1}
        borderColor="gray.200"
        shadow="sm"
        _hover={{ shadow: 'md' }}
      >
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center">
            <HStack>
              <Box as={categoryInfo?.icon} color={`${categoryInfo?.color}.500`} />
              <Heading size="sm">{item.name}</Heading>
            </HStack>
            <HStack>
              <IconButton
                aria-label="Edit"
                icon={<FaEdit />}
                size="sm"
                variant="ghost"
                onClick={() => setEditingItem(item)}
              />
              <IconButton
                aria-label="Delete"
                icon={<FaTrash />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDeleteItem(item.id)}
              />
            </HStack>
          </Flex>
          
          {item.description && (
            <Text fontSize="sm" color="gray.600">
              {item.description}
            </Text>
          )}
          
          {item.details && (
            <Text fontSize="xs" color="gray.500" noOfLines={2}>
              {item.details}
            </Text>
          )}
          
          <Text fontSize="xs" color="gray.400">
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </VStack>
      </Box>
    )
  }

  if (!isOpen) return null

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="lg"
        maxW="6xl"
        w="full"
        maxH="90vh"
        overflow="hidden"
        boxShadow="xl"
      >
        {/* Header */}
        <Flex p={6} borderBottomWidth={1} align="center" bg="gray.50">
          <HStack>
            <Box as={FaBook} />
            <Heading size="lg">Adventure Bible</Heading>
          </HStack>
          <Spacer />
          <IconButton
            aria-label="Close"
            icon={<FaTimes />}
            onClick={onClose}
          />
        </Flex>

        {/* Content */}
        <Box p={6} overflowY="auto" maxH="calc(90vh - 100px)">
          <VStack spacing={6} align="stretch">
            {/* Tab Navigation */}
            <HStack spacing={2} flexWrap="wrap">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  size="sm"
                  leftIcon={<Box as={category.icon} />}
                  colorScheme={activeTab === category.key ? category.color : 'gray'}
                  variant={activeTab === category.key ? 'solid' : 'outline'}
                  onClick={() => {
                    setActiveTab(category.key)
                    setEditingItem(null)
                    setIsAddingNew(false)
                  }}
                >
                  {category.label}
                  <Badge ml={2} colorScheme={category.color} variant="subtle">
                    {adventureBible[category.key as keyof AdventureBible].length}
                  </Badge>
                </Button>
              ))}
            </HStack>
            
            <Box h="1px" bg="gray.200" />
            
            {/* Edit Form */}
            {editingItem && (
              <ItemEditForm
                item={editingItem}
                onSave={handleSaveItem}
                onCancel={() => {
                  setEditingItem(null)
                  setIsAddingNew(false)
                }}
              />
            )}
            
            {/* Content Area */}
            {!editingItem && (
              <Box>
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="md">
                    {categories.find(c => c.key === activeTab)?.label}
                  </Heading>
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme={categories.find(c => c.key === activeTab)?.color}
                    onClick={handleAddNew}
                  >
                    Add New
                  </Button>
                </Flex>
                
                {adventureBible[currentCategory].length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Box 
                      as={categories.find(c => c.key === activeTab)?.icon} 
                      fontSize="4xl"
                      color="gray.300" 
                      mb={4} 
                    />
                    <Text color="gray.500" fontSize="lg">
                      No {categories.find(c => c.key === activeTab)?.label.toLowerCase()} yet.
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Click "Add New" to create your first entry!
                    </Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {adventureBible[currentCategory].map((item) => renderItemCard(item))}
                  </SimpleGrid>
                )}
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}

export default AdventureBible 