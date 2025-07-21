import React from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { dndTheme } from './theme/theme'
import EditorPage from './components/editor/EditorPage'
import WizardPage from './components/campaign/WizardPage'
import LandingPage from './components/landing/LandingPage'
import AdventureSourcebookGenerator from './components/adventure/AdventureSourcebookGenerator'

function App() {
  return (
    <ChakraProvider theme={dndTheme}>
      <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:adventureId" element={<EditorPage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/story-builder" element={<WizardPage />} />
          <Route path="/sourcebook-generator" element={<AdventureSourcebookGenerator />} />
        </Routes>
      </Box>
    </ChakraProvider>
  )
}

export default App 