import { ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
  variants: {
    fantasy: {
      bg: 'linear-gradient(135deg, #d4af37, #ffd700)',
      color: 'black',
      fontWeight: 'bold',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.1)',
      border: '1px solid #b8941f',
      _hover: {
        bg: 'linear-gradient(135deg, #b8941f, #e6c200)',
        transform: 'translateY(-1px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 12px rgba(0,0,0,0.15)',
      },
      _active: {
        transform: 'translateY(0)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1)',
      }
    },
    dragon: {
      bg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.1)',
      _hover: {
        bg: 'linear-gradient(135deg, #b91c1c, #991b1b)',
        transform: 'translateY(-1px)',
      }
    },
    mystical: {
      bg: 'linear-gradient(135deg, #6b46c1, #553c9a)',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.1)',
      _hover: {
        bg: 'linear-gradient(135deg, #553c9a, #3b2063)',
        transform: 'translateY(-1px)',
      }
    }
  }
}

export const Card: ComponentStyleConfig = {
  baseStyle: {
    container: {
      bg: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'gray.200',
      _dark: {
        bg: 'gray.800',
        borderColor: 'gray.600',
      }
    }
  }
}

export const Input: ComponentStyleConfig = {
  variants: {
    fantasy: {
      field: {
        border: '2px solid',
        borderColor: 'gold.300',
        bg: 'white',
        _hover: {
          borderColor: 'gold.400',
        },
        _focus: {
          borderColor: 'gold.500',
          boxShadow: '0 0 0 1px #f59e0b',
        }
      }
    }
  }
}

export const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    bg: 'gray.900',
    color: 'white',
    fontSize: 'sm',
    px: 3,
    py: 2,
    borderRadius: 'md',
    boxShadow: 'lg',
    border: '1px solid',
    borderColor: 'brand.500',
    maxW: 'sm',
  }
} 