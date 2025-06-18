import React from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { dndTheme } from './theme/theme'
import EditorPage from './components/editor/EditorPage'

function App() {
  return (
    <ChakraProvider theme={dndTheme}>
      <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:adventureId" element={<EditorPage />} />
        </Routes>
      </Box>
    </ChakraProvider>
  )
}

export default App 