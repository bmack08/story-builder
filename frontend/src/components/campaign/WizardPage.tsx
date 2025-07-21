import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Progress,
  Badge,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Spacer,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { campaignWizard, type CampaignConfig } from '../../ai/campaignWizard';

interface WizardStep {
  id: string;
  title: string;
  completed: boolean;
}

interface CampaignConfigLocal {
  partySize: number;
  tone: string;
  length: string;
  villainType: string;
  setting: string;
}

const WizardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<CampaignConfigLocal>({
    partySize: 4,
    tone: '',
    length: '',
    villainType: '',
    setting: ''
  });

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const steps: WizardStep[] = [
    { id: 'party', title: 'Party Size', completed: config.partySize > 0 },
    { id: 'tone', title: 'Story Tone', completed: config.tone !== '' },
    { id: 'length', title: 'Campaign Length', completed: config.length !== '' },
    { id: 'villain', title: 'Main Villain', completed: config.villainType !== '' },
    { id: 'setting', title: 'Setting Theme', completed: config.setting !== '' }
  ];

  const toneOptions = [
    { value: 'heroic', label: 'Heroic Fantasy', description: 'Classic good vs evil adventures', emoji: '⚔️' },
    { value: 'gritty', label: 'Gritty Realism', description: 'Dark, morally complex stories', emoji: '🌑' },
    { value: 'comedic', label: 'Comedic Adventure', description: 'Light-hearted, humorous tone', emoji: '😄' },
    { value: 'horror', label: 'Gothic Horror', description: 'Scary, atmospheric encounters', emoji: '👻' },
    { value: 'political', label: 'Political Intrigue', description: 'Court politics and schemes', emoji: '👑' }
  ];

  const lengthOptions = [
    { value: 'oneshot', label: 'One-Shot', description: '1 session (3-5 hours)', emoji: '⚡' },
    { value: 'short', label: 'Short Campaign', description: '3-6 sessions', emoji: '📖' },
    { value: 'medium', label: 'Medium Campaign', description: '7-15 sessions', emoji: '📚' },
    { value: 'long', label: 'Long Campaign', description: '16+ sessions', emoji: '🏛️' }
  ];

  const villainOptions = [
    { value: 'cultist', label: 'Cult Leader', description: 'Religious fanatic with dark agenda', emoji: '🔮' },
    { value: 'noble', label: 'Corrupt Noble', description: 'Political power-seeker', emoji: '👑' },
    { value: 'dragon', label: 'Ancient Dragon', description: 'Legendary creature of immense power', emoji: '🐉' },
    { value: 'undead', label: 'Undead Lord', description: 'Lich, vampire, or death knight', emoji: '💀' },
    { value: 'aberration', label: 'Alien Entity', description: 'Mind flayer, beholder, or cosmic horror', emoji: '👁️' },
    { value: 'demon', label: 'Fiend', description: 'Demon lord or devil prince', emoji: '😈' }
  ];

  const settingOptions = [
    { value: 'classic', label: 'Classic Fantasy', description: 'Medieval European-inspired', emoji: '🏰' },
    { value: 'desert', label: 'Desert Kingdoms', description: 'Arabian Nights inspired', emoji: '🏜️' },
    { value: 'jungle', label: 'Jungle Empires', description: 'Tropical, ancient civilizations', emoji: '🌴' },
    { value: 'arctic', label: 'Frozen Wastes', description: 'Harsh northern wilderness', emoji: '❄️' },
    { value: 'urban', label: 'City-State', description: 'Urban political intrigue', emoji: '🏙️' },
    { value: 'planar', label: 'Planar Adventure', description: 'Travel between dimensions', emoji: '🌌' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!allStepsComplete()) return;

    setIsGenerating(true);
    
    try {
      const campaignConfig: CampaignConfig = {
        partySize: config.partySize,
        tone: config.tone,
        length: config.length,
        villainType: config.villainType,
        setting: config.setting
      };

      console.log('Generating campaign with config:', campaignConfig);
      
      const campaignOutline = await campaignWizard.generateCampaignOutline(campaignConfig);
      
      console.log('Generated campaign outline:', campaignOutline);
      
      // TODO: Navigate to campaign view or save to state/storage
      alert(`Campaign "${campaignOutline.title}" generated successfully! Check console for details.`);
      
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderOptionCard = (option: any, selectedValue: string, onChange: (value: string) => void) => (
    <Card
      key={option.value}
      cursor="pointer"
      border="2px"
      borderColor={selectedValue === option.value ? 'purple.500' : borderColor}
      bg={selectedValue === option.value ? useColorModeValue('purple.50', 'purple.900') : cardBg}
      _hover={{ borderColor: 'purple.300' }}
      transition="all 0.2s"
      onClick={() => onChange(option.value)}
    >
      <CardBody p={6}>
        <HStack spacing={4} align="start">
          <Text fontSize="2xl">{option.emoji}</Text>
          <VStack align="start" spacing={2} flex={1}>
            <Heading size="md" color={selectedValue === option.value ? 'purple.600' : undefined}>
              {option.label}
            </Heading>
            <Text color={textColor} fontSize="sm">
              {option.description}
            </Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Party Size
        return (
          <VStack spacing={8} align="start">
            <VStack align="start" spacing={4}>
              <Heading size="xl" color="purple.600">Party Size</Heading>
              <Text color={textColor} fontSize="lg">
                How many players will be in your campaign?
              </Text>
            </VStack>
            
            <HStack spacing={6} align="center">
              <Text fontSize="lg" fontWeight="medium">Number of Players:</Text>
              <NumberInput
                value={config.partySize}
                onChange={(_, value) => setConfig({...config, partySize: value || 4})}
                min={1}
                max={8}
                w="120px"
                size="lg"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>

            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm">Party Size Guidelines:</AlertTitle>
                <AlertDescription fontSize="sm">
                  <VStack align="start" spacing={1} mt={2}>
                    <Text>• 3-4 players: Intimate, character-focused stories</Text>
                    <Text>• 5-6 players: Balanced tactical encounters</Text>
                    <Text>• 7+ players: Epic, large-scale adventures</Text>
                  </VStack>
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        );

      case 1: // Tone
        return (
          <VStack spacing={8} align="start" w="full">
            <VStack align="start" spacing={4}>
              <Heading size="xl" color="purple.600">Story Tone</Heading>
              <Text color={textColor} fontSize="lg">
                What kind of atmosphere do you want for your campaign?
              </Text>
            </VStack>
            
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4} w="full">
              {toneOptions.map((option) => 
                renderOptionCard(option, config.tone, (value) => setConfig({...config, tone: value}))
              )}
            </Grid>
          </VStack>
        );

      case 2: // Length
        return (
          <VStack spacing={8} align="start" w="full">
            <VStack align="start" spacing={4}>
              <Heading size="xl" color="purple.600">Campaign Length</Heading>
              <Text color={textColor} fontSize="lg">
                How long do you want your campaign to run?
              </Text>
            </VStack>
            
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4} w="full">
              {lengthOptions.map((option) => 
                renderOptionCard(option, config.length, (value) => setConfig({...config, length: value}))
              )}
            </Grid>
          </VStack>
        );

      case 3: // Villain
        return (
          <VStack spacing={8} align="start" w="full">
            <VStack align="start" spacing={4}>
              <Heading size="xl" color="purple.600">Main Villain</Heading>
              <Text color={textColor} fontSize="lg">
                What type of antagonist will drive your story?
              </Text>
            </VStack>
            
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4} w="full">
              {villainOptions.map((option) => 
                renderOptionCard(option, config.villainType, (value) => setConfig({...config, villainType: value}))
              )}
            </Grid>
          </VStack>
        );

      case 4: // Setting
        return (
          <VStack spacing={8} align="start" w="full">
            <VStack align="start" spacing={4}>
              <Heading size="xl" color="purple.600">Setting Theme</Heading>
              <Text color={textColor} fontSize="lg">
                What kind of world will your adventure take place in?
              </Text>
            </VStack>
            
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4} w="full">
              {settingOptions.map((option) => 
                renderOptionCard(option, config.setting, (value) => setConfig({...config, setting: value}))
              )}
            </Grid>
          </VStack>
        );

      default:
        return null;
    }
  };

  const isCurrentStepComplete = () => {
    return steps[currentStep]?.completed || false;
  };

  const allStepsComplete = () => {
    return steps.every(step => step.completed);
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="6xl">
        {/* Header */}
        <VStack spacing={8} mb={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
              Campaign Wizard
            </Heading>
            <Text color={textColor} fontSize="lg">
              Create your perfect D&D campaign in just 5 simple steps
            </Text>
          </VStack>

          {/* Progress */}
          <Box w="full" maxW="2xl">
            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color={textColor}>
                Step {currentStep + 1} of {steps.length}
              </Text>
              <Text fontSize="sm" color={textColor}>
                {Math.round(progressPercentage)}% Complete
              </Text>
            </Flex>
            <Progress 
              value={progressPercentage} 
              colorScheme="purple" 
              size="lg" 
              borderRadius="full"
              bg={useColorModeValue('gray.200', 'gray.700')}
            />
          </Box>

          {/* Step Indicators */}
          <HStack spacing={4} wrap="wrap" justify="center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <VStack spacing={2}>
                  <Box
                    w={12}
                    h={12}
                    rounded="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={
                      index === currentStep
                        ? 'purple.500'
                        : step.completed
                        ? 'green.500'
                        : useColorModeValue('gray.200', 'gray.700')
                    }
                    color={
                      index === currentStep || step.completed
                        ? 'white'
                        : textColor
                    }
                    fontWeight="bold"
                    fontSize="sm"
                    transition="all 0.2s"
                  >
                    {step.completed ? <Text fontSize="lg">✓</Text> : index + 1}
                  </Box>
                  <Text
                    fontSize="xs"
                    color={index === currentStep ? 'purple.500' : textColor}
                    fontWeight={index === currentStep ? 'bold' : 'normal'}
                    textAlign="center"
                    maxW="20"
                  >
                    {step.title}
                  </Text>
                </VStack>
                {index < steps.length - 1 && (
                  <Box w={8} h="1px" bg={useColorModeValue('gray.300', 'gray.600')} />
                )}
              </React.Fragment>
            ))}
          </HStack>
        </VStack>

        {/* Step Content */}
        <Card bg={cardBg} shadow="xl" border="1px" borderColor={borderColor} mb={8}>
          <CardBody p={12}>
            {renderStep()}
          </CardBody>
        </Card>

        {/* Navigation */}
        <Flex justify="space-between" align="center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="ghost"
            size="lg"
            leftIcon={<Text>←</Text>}
          >
            Previous
          </Button>

          <HStack spacing={4}>
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleGenerate}
                disabled={!allStepsComplete() || isGenerating}
                size="xl"
                bgGradient="linear(to-r, green.500, green.600)"
                color="white"
                _hover={{
                  bgGradient: 'linear(to-r, green.600, green.700)',
                  transform: 'scale(1.05)',
                }}
                _disabled={{
                  bgGradient: 'none',
                  bg: 'gray.300',
                  transform: 'none',
                }}
                transition="all 0.2s"
                px={8}
                py={6}
                leftIcon={isGenerating ? <Spinner size="sm" /> : undefined}
              >
                {isGenerating ? 'Generating Campaign...' : 'Generate Campaign'}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isCurrentStepComplete()}
                size="lg"
                bg="purple.500"
                color="white"
                _hover={{ bg: 'purple.600' }}
                rightIcon={<Text>→</Text>}
              >
                Next Step
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default WizardPage; 