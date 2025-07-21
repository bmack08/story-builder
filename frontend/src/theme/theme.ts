import { extendTheme } from '@chakra-ui/react'

export const dndTheme = extendTheme({
  colors: {
    brand: {
      50: '#f0e6ff',
      100: '#d4bfff',
      200: '#b399ff',
      300: '#9373ff',
      400: '#734dff',
      500: '#6b46c1',
      600: '#553c9a',
      700: '#3b2063',
      800: '#2d1b75',
      900: '#1a0e3d'
    },
    dragon: {
      50: '#fff5f5',
      100: '#fed7d7',
      200: '#feb2b2',
      300: '#fc8181',
      400: '#f56565',
      500: '#dc2626',
      600: '#c53030',
      700: '#9b2c2c',
      800: '#822727',
      900: '#7f1d1d'
    },
    gold: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    mystical: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    }
  },
  fonts: {
    heading: '"Cinzel", serif',
    body: '"Inter", sans-serif',
    mono: '"Fira Code", monospace'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  components: {
    Button: {
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
    },
    Card: {
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
    },
    Input: {
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
    },
    Tooltip: {
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
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
      },
      '*::placeholder': {
        color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
      },
      '*, *::before, &::after': {
        borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
}) 