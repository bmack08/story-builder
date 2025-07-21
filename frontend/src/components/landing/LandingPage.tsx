import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Link,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

const LandingPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('purple.600', 'purple.400');

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Navigation */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={50}
        bg={useColorModeValue('white/95', 'gray.900/95')}
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="7xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #9F7AEA 0%, #EC4899 100%)"
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="sm">
                  D
                </Text>
              </Box>
              <Text fontSize="xl" fontWeight="semibold">
                D&D Adventure Creator
              </Text>
            </HStack>
            
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              <Link href="#home" color={textColor} _hover={{ color: 'white' }}>
                Home
              </Link>
              <Link href="#features" color={textColor} _hover={{ color: 'white' }}>
                Features
              </Link>
              <Link href="#create" color={textColor} _hover={{ color: 'white' }}>
                Create
              </Link>
              <Link href="#community" color={textColor} _hover={{ color: 'white' }}>
                Community
              </Link>
            </HStack>
            
            <Button
              as={RouterLink}
              to="/wizard"
              bg={accentColor}
              color="white"
              _hover={{ bg: 'purple.700' }}
              size="md"
            >
              Get Started
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box id="home" pt={24} pb={20}>
        <Container maxW="7xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            {/* Left Content */}
            <VStack align="start" spacing={8}>
              <VStack align="start" spacing={4}>
                <HStack spacing={2}>
                  <Badge
                    px={3}
                    py={1}
                    bg="purple.100"
                    color="purple.700"
                    rounded="full"
                    fontSize="sm"
                  >
                    ✨ AI-Powered
                  </Badge>
                  <Badge
                    px={3}
                    py={1}
                    bg="green.100"
                    color="green.700"
                    rounded="full"
                    fontSize="sm"
                  >
                    Free Beta
                  </Badge>
                </HStack>
                
                <Heading
                  size="4xl"
                  lineHeight="tight"
                  bgGradient="linear(to-r, purple.400, pink.400)"
                  bgClip="text"
                >
                  Create Epic
                  <br />
                  D&D Adventures
                </Heading>
                
                <Text fontSize="xl" color={textColor} maxW="lg" lineHeight="relaxed">
                  Your AI-powered Dungeon Master assistant. Generate immersive campaigns,
                  memorable NPCs, and epic encounters in minutes, not hours.
                </Text>
              </VStack>

              <VStack spacing={4} align="start" w="full">
                <HStack spacing={4} w="full">
                  <Button
                    as={RouterLink}
                    to="/sourcebook-generator"
                    size="lg"
                    bgGradient="linear(to-r, purple.600, pink.600)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(to-r, purple.700, pink.700)',
                      transform: 'scale(1.05)',
                    }}
                    transition="all 0.2s"
                  >
                    Generate Sourcebook
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/wizard"
                    size="lg"
                    variant="outline"
                    colorScheme="purple"
                    _hover={{
                      bg: 'purple.50',
                      transform: 'scale(1.05)',
                    }}
                    transition="all 0.2s"
                  >
                    Start Creating
                  </Button>
                </HStack>

                <HStack spacing={8} pt={4}>
                  <VStack spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.400">
                      10K+
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Adventures Created
                    </Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="pink.400">
                      50K+
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      NPCs Generated
                    </Text>
                  </VStack>
                  <VStack spacing={0}>
                    <Text fontSize="2xl" fontWeight="bold" color="green.400">
                      5K+
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Active DMs
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>

            {/* Right Visual */}
            <Box>
              <Card
                bg={cardBg}
                shadow="2xl"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                rounded="2xl"
                p={8}
              >
                <CardBody>
                  <VStack spacing={6} align="start">
                    <HStack spacing={3}>
                      <Box w={3} h={3} bg="red.500" rounded="full" />
                      <Box w={3} h={3} bg="yellow.500" rounded="full" />
                      <Box w={3} h={3} bg="green.500" rounded="full" />
                      <Text color={textColor} fontSize="sm" ml={4}>
                        Adventure Builder
                      </Text>
                    </HStack>

                    <VStack spacing={4} w="full">
                      <Box bg={useColorModeValue('gray.100', 'gray.700')} rounded="lg" p={4} w="full">
                        <Text fontSize="sm" color={textColor} mb={2}>
                          Campaign Setting
                        </Text>
                        <Text color="purple.400" fontWeight="medium">
                          🏰 Medieval Fantasy Kingdom
                        </Text>
                      </Box>

                      <Box bg={useColorModeValue('gray.100', 'gray.700')} rounded="lg" p={4} w="full">
                        <Text fontSize="sm" color={textColor} mb={2}>
                          Generated NPC
                        </Text>
                        <VStack spacing={2} align="start">
                          <Text fontWeight="medium">Elara Moonwhisper</Text>
                          <Text fontSize="sm" color={textColor}>
                            Half-elf Tavern Keeper with a mysterious past...
                          </Text>
                        </VStack>
                      </Box>

                      <Box bg={useColorModeValue('gray.100', 'gray.700')} rounded="lg" p={4} w="full">
                        <Text fontSize="sm" color={textColor} mb={2}>
                          Quest Hook
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          Strange lights have been seen in the Whispering Woods...
                        </Text>
                      </Box>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" py={20} bg={useColorModeValue('gray.100', 'gray.800')}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading size="2xl">Everything You Need to Run Epic Campaigns</Heading>
              <Text fontSize="xl" color={textColor} maxW="2xl">
                Powerful AI tools designed specifically for Dungeon Masters who want to focus on
                storytelling, not prep work.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'purple.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="purple.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">🎭</Text>
                    </Box>
                    <Heading size="lg">AI Campaign Wizard</Heading>
                    <Text color={textColor}>
                      Step-by-step campaign creation with intelligent suggestions, plot hooks, and lore consistency.
                    </Text>
                    <Link as={RouterLink} to="/wizard" color="purple.400" fontWeight="medium">
                      Try Now →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'pink.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="pink.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">👥</Text>
                    </Box>
                    <Heading size="lg">NPC Generator</Heading>
                    <Text color={textColor}>
                      Create memorable characters with backstories, motivations, and dialogue that fits your world.
                    </Text>
                    <Link href="#" color="pink.400" fontWeight="medium">
                      See Demo →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'green.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="green.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">🏰</Text>
                    </Box>
                    <Heading size="lg">Dungeon Builder</Heading>
                    <Text color={textColor}>
                      Design intricate dungeons with traps, puzzles, and encounters balanced for your party.
                    </Text>
                    <Link href="#" color="green.400" fontWeight="medium">
                      Explore →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'blue.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="blue.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">📚</Text>
                    </Box>
                    <Heading size="lg">Lore Tracker</Heading>
                    <Text color={textColor}>
                      Keep your world's history, rules, and continuity consistent across all your content.
                    </Text>
                    <Link href="#" color="blue.400" fontWeight="medium">
                      Learn More →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'yellow.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="yellow.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">⚔️</Text>
                    </Box>
                    <Heading size="lg">Encounter Designer</Heading>
                    <Text color={textColor}>
                      Create balanced combat encounters with environmental hazards and tactical depth.
                    </Text>
                    <Link href="#" color="yellow.400" fontWeight="medium">
                      Try It →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg={cardBg}
                shadow="lg"
                border="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                _hover={{ borderColor: 'purple.400' }}
                transition="all 0.2s"
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Box w={12} h={12} bg="purple.500" rounded="lg" display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="2xl">🎲</Text>
                    </Box>
                    <Heading size="lg">Session Planner</Heading>
                    <Text color={textColor}>
                      Organize your sessions with notes, reminders, and adaptive storylines that react to player choices.
                    </Text>
                    <Link href="#" color="purple.400" fontWeight="medium">
                      Plan Now →
                    </Link>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box id="create" py={20}>
        <Container maxW="4xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">Ready to Transform Your D&D Experience?</Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              Join thousands of Dungeon Masters who've already discovered the power of AI-assisted storytelling.
            </Text>
            <Button
              as={RouterLink}
              to="/wizard"
              size="xl"
              bgGradient="linear(to-r, purple.600, pink.600)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, purple.700, pink.700)',
                transform: 'scale(1.05)',
              }}
              transition="all 0.2s"
              px={10}
              py={4}
            >
              Start Your Adventure
            </Button>
            <Text fontSize="sm" color={textColor}>
              No account required • Free to use • Start creating in seconds
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')} py={12} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
            <VStack align="start" spacing={4}>
              <HStack spacing={3}>
                <Box
                  w={8}
                  h={8}
                  bg="linear-gradient(135deg, #9F7AEA 0%, #EC4899 100%)"
                  rounded="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontWeight="bold" fontSize="sm">
                    D
                  </Text>
                </Box>
                <Text fontSize="xl" fontWeight="semibold">
                  D&D Adventure Creator
                </Text>
              </HStack>
              <Text color={textColor}>
                AI-powered tools for creating epic D&D campaigns and unforgettable adventures.
              </Text>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Product</Heading>
              <VStack align="start" spacing={2}>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Features
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Pricing
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Changelog
                </Link>
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Resources</Heading>
              <VStack align="start" spacing={2}>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Documentation
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Tutorials
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Community
                </Link>
              </VStack>
            </VStack>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Company</Heading>
              <VStack align="start" spacing={2}>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  About
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Contact
                </Link>
                <Link href="#" color={textColor} _hover={{ color: 'white' }}>
                  Privacy
                </Link>
              </VStack>
            </VStack>
          </SimpleGrid>

          <Divider my={8} />
          <Text textAlign="center" color={textColor}>
            © {new Date().getFullYear()} D&D Adventure Creator. All rights reserved. Not affiliated with Wizards of the Coast.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 