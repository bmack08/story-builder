import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface DnDStatBlock {
  id: string
  name: string
  type: 'monster' | 'npc' | 'item' | 'spell' | 'location'
  data: any
  createdAt: string
  updatedAt: string
}

export interface AdventureSection {
  id: string
  title: string
  content: string
  sectionType: 'introduction' | 'chapter' | 'appendix' | 'encounter' | 'location'
  order: number
  parentId?: string
  children?: AdventureSection[]
  statBlocks: string[] // IDs of stat blocks used in this section
  readAloudText?: string
  dmNotes?: string
  encounterData?: {
    xpBudget: number
    difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
    enemies: string[]
    environment: string
    tactics: string
  }
}

export interface Adventure {
  id: string
  title: string
  description: string
  author: string
  version: string
  createdAt: string
  updatedAt: string
  coverImage?: string
  
  // Adventure structure
  sections: AdventureSection[]
  statBlocks: { [id: string]: DnDStatBlock }
  
  // Adventure metadata
  playerLevels: string
  duration: string
  setting: string
  themes: string[]
  
  // Export settings
  exportFormat: 'html' | 'pdf' | 'markdown'
  includeTableOfContents: boolean
  includeAppendices: boolean
}

interface AdventureStore {
  // Current state
  currentAdventure: Adventure | null
  activeSectionId: string | null
  adventures: Adventure[]
  
  // UI state
  isPreviewMode: boolean
  isSidebarOpen: boolean
  selectedStatBlocks: string[]
  hasUnsavedChanges: boolean
  
  // Actions
  createAdventure: (title: string, description?: string) => Adventure
  loadAdventure: (id: string) => void
  saveAdventure: () => Promise<void>
  exportAdventure: (format: 'html' | 'pdf' | 'markdown') => Promise<void>
  
  // Section management
  addSection: (title: string, type: AdventureSection['sectionType'], parentId?: string) => AdventureSection
  updateSection: (id: string, updates: Partial<AdventureSection>) => void
  deleteSection: (id: string) => void
  reorderSections: (sectionIds: string[]) => void
  setActiveSection: (id: string) => void
  
  // Stat block management
  addStatBlock: (statBlock: Omit<DnDStatBlock, 'id' | 'createdAt' | 'updatedAt'>) => DnDStatBlock
  updateStatBlock: (id: string, updates: Partial<DnDStatBlock>) => void
  deleteStatBlock: (id: string) => void
  linkStatBlockToSection: (statBlockId: string, sectionId: string) => void
  unlinkStatBlockFromSection: (statBlockId: string, sectionId: string) => void
  
  // UI actions
  setPreviewMode: (enabled: boolean) => void
  setSidebarOpen: (open: boolean) => void
  toggleStatBlockSelection: (id: string) => void
  markUnsaved: () => void
  markSaved: () => void
}

const createDefaultAdventure = (title: string, description?: string): Adventure => {
  const now = new Date().toISOString()
  const id = `adventure-${Date.now()}`
  
  return {
    id,
    title,
    description: description || 'A new D&D adventure',
    author: 'DM',
    version: '1.0',
    createdAt: now,
    updatedAt: now,
    
    sections: [
      {
        id: `section-intro-${Date.now()}`,
        title: 'Introduction',
        content: 'Welcome to your adventure...',
        sectionType: 'introduction',
        order: 0,
        statBlocks: [],
        readAloudText: '',
        dmNotes: 'Adventure background and setup information for the DM.'
      },
      {
        id: `section-ch1-${Date.now()}`,
        title: 'Chapter 1: The Beginning',
        content: 'The adventure begins...',
        sectionType: 'chapter',
        order: 1,
        statBlocks: [],
        readAloudText: 'Read this aloud to your players...',
        dmNotes: 'Chapter 1 notes and guidance.'
      }
    ],
    statBlocks: {},
    
    playerLevels: '1-3',
    duration: '4-6 hours',
    setting: 'Fantasy',
    themes: ['Adventure', 'Exploration'],
    
    exportFormat: 'html',
    includeTableOfContents: true,
    includeAppendices: true
  }
}

export const useAdventureStore = create<AdventureStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentAdventure: null,
        activeSectionId: null,
        adventures: [],
        isPreviewMode: false,
        isSidebarOpen: true,
        selectedStatBlocks: [],
        hasUnsavedChanges: false,
        
        createAdventure: (title: string, description?: string) => {
          const newAdventure = createDefaultAdventure(title, description)
          set(state => ({
            adventures: [...state.adventures, newAdventure],
            currentAdventure: newAdventure,
            activeSectionId: newAdventure.sections[0]?.id || null,
            hasUnsavedChanges: false
          }))
          return newAdventure
        },
        
        loadAdventure: (id: string) => {
          const adventure = get().adventures.find(a => a.id === id)
          if (adventure) {
            set({
              currentAdventure: adventure,
              activeSectionId: adventure.sections[0]?.id || null,
              hasUnsavedChanges: false
            })
          }
        },
        
        saveAdventure: async () => {
          const { currentAdventure } = get()
          if (!currentAdventure) return
          
          // Update timestamp
          const updatedAdventure = {
            ...currentAdventure,
            updatedAt: new Date().toISOString()
          }
          
          set(state => ({
            adventures: state.adventures.map(a => 
              a.id === updatedAdventure.id ? updatedAdventure : a
            ),
            currentAdventure: updatedAdventure,
            hasUnsavedChanges: false
          }))
          
          // Here you would typically save to a backend
          console.log('Adventure saved:', updatedAdventure)
        },
        
        exportAdventure: async (format: 'html' | 'pdf' | 'markdown') => {
          const { currentAdventure } = get()
          if (!currentAdventure) return
          
          // This will be implemented with actual export functionality
          console.log(`Exporting adventure in ${format} format:`, currentAdventure)
          
          // For now, create a simple HTML export
          if (format === 'html') {
            const htmlContent = generateHTMLExport(currentAdventure)
            downloadFile(htmlContent, `${currentAdventure.title}.html`, 'text/html')
          }
        },
        
        addSection: (title: string, type: AdventureSection['sectionType'], parentId?: string) => {
          const { currentAdventure } = get()
          if (!currentAdventure) throw new Error('No current adventure')
          
          const newSection: AdventureSection = {
            id: `section-${Date.now()}`,
            title,
            content: '',
            sectionType: type,
            order: currentAdventure.sections.length,
            parentId,
            statBlocks: [],
            readAloudText: type === 'chapter' ? 'Read this aloud to your players...' : undefined,
            dmNotes: 'Notes for the DM...'
          }
          
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              sections: [...state.currentAdventure.sections, newSection],
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
          
          return newSection
        },
        
        updateSection: (id: string, updates: Partial<AdventureSection>) => {
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              sections: state.currentAdventure.sections.map(section =>
                section.id === id ? { ...section, ...updates } : section
              ),
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
        },
        
        deleteSection: (id: string) => {
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              sections: state.currentAdventure.sections.filter(section => section.id !== id),
              updatedAt: new Date().toISOString()
            } : null,
            activeSectionId: state.activeSectionId === id ? null : state.activeSectionId,
            hasUnsavedChanges: true
          }))
        },
        
        reorderSections: (sectionIds: string[]) => {
          set(state => {
            if (!state.currentAdventure) return state
            
            const reorderedSections = sectionIds.map((id, index) => {
              const section = state.currentAdventure!.sections.find(s => s.id === id)
              return section ? { ...section, order: index } : null
            }).filter(Boolean) as AdventureSection[]
            
            return {
              currentAdventure: {
                ...state.currentAdventure,
                sections: reorderedSections,
                updatedAt: new Date().toISOString()
              },
              hasUnsavedChanges: true
            }
          })
        },
        
        setActiveSection: (id: string) => {
          set({ activeSectionId: id })
        },
        
        addStatBlock: (statBlock: Omit<DnDStatBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
          const now = new Date().toISOString()
          const newStatBlock: DnDStatBlock = {
            ...statBlock,
            id: `statblock-${Date.now()}`,
            createdAt: now,
            updatedAt: now
          }
          
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              statBlocks: {
                ...state.currentAdventure.statBlocks,
                [newStatBlock.id]: newStatBlock
              },
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
          
          return newStatBlock
        },
        
        updateStatBlock: (id: string, updates: Partial<DnDStatBlock>) => {
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              statBlocks: {
                ...state.currentAdventure.statBlocks,
                [id]: {
                  ...state.currentAdventure.statBlocks[id],
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              },
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
        },
        
        deleteStatBlock: (id: string) => {
          set(state => {
            if (!state.currentAdventure) return state
            
            const { [id]: deleted, ...remainingStatBlocks } = state.currentAdventure.statBlocks
            
            return {
              currentAdventure: {
                ...state.currentAdventure,
                statBlocks: remainingStatBlocks,
                sections: state.currentAdventure.sections.map(section => ({
                  ...section,
                  statBlocks: section.statBlocks.filter(sbId => sbId !== id)
                })),
                updatedAt: new Date().toISOString()
              },
              hasUnsavedChanges: true
            }
          })
        },
        
        linkStatBlockToSection: (statBlockId: string, sectionId: string) => {
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              sections: state.currentAdventure.sections.map(section =>
                section.id === sectionId ? {
                  ...section,
                  statBlocks: [...new Set([...section.statBlocks, statBlockId])]
                } : section
              ),
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
        },
        
        unlinkStatBlockFromSection: (statBlockId: string, sectionId: string) => {
          set(state => ({
            currentAdventure: state.currentAdventure ? {
              ...state.currentAdventure,
              sections: state.currentAdventure.sections.map(section =>
                section.id === sectionId ? {
                  ...section,
                  statBlocks: section.statBlocks.filter(id => id !== statBlockId)
                } : section
              ),
              updatedAt: new Date().toISOString()
            } : null,
            hasUnsavedChanges: true
          }))
        },
        
        setPreviewMode: (enabled: boolean) => {
          set({ isPreviewMode: enabled })
        },
        
        setSidebarOpen: (open: boolean) => {
          set({ isSidebarOpen: open })
        },
        
        toggleStatBlockSelection: (id: string) => {
          set(state => ({
            selectedStatBlocks: state.selectedStatBlocks.includes(id)
              ? state.selectedStatBlocks.filter(sbId => sbId !== id)
              : [...state.selectedStatBlocks, id]
          }))
        },
        
        markUnsaved: () => {
          set({ hasUnsavedChanges: true })
        },
        
        markSaved: () => {
          set({ hasUnsavedChanges: false })
        }
      }),
      {
        name: 'adventure-store',
        partialize: (state) => ({
          adventures: state.adventures,
          currentAdventure: state.currentAdventure
        })
      }
    )
  )
)

// Helper function to generate HTML export
const generateHTMLExport = (adventure: Adventure): string => {
  const sections = adventure.sections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      const statBlocksHtml = section.statBlocks
        .map(id => adventure.statBlocks[id])
        .filter(Boolean)
        .map(statBlock => `
          <div class="stat-block">
            <h4>${statBlock.name}</h4>
            <pre>${JSON.stringify(statBlock.data, null, 2)}</pre>
          </div>
        `).join('')
      
      return `
        <section class="adventure-section" data-type="${section.sectionType}">
          <h2>${section.title}</h2>
          ${section.readAloudText ? `
            <div class="read-aloud">
              <h4>Read Aloud:</h4>
              <p>${section.readAloudText}</p>
            </div>
          ` : ''}
          <div class="content">
            ${section.content}
          </div>
          ${section.dmNotes ? `
            <div class="dm-notes">
              <h4>DM Notes:</h4>
              <p>${section.dmNotes}</p>
            </div>
          ` : ''}
          ${statBlocksHtml}
        </section>
      `
    }).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${adventure.title}</title>
      <style>
        body { font-family: 'Book Antiqua', serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .adventure-header { text-align: center; border-bottom: 3px solid #8B0000; padding-bottom: 20px; margin-bottom: 30px; }
        .adventure-section { margin-bottom: 40px; }
        .read-aloud { background: #f5f5dc; border-left: 4px solid #8B0000; padding: 15px; margin: 20px 0; }
        .dm-notes { background: #e8f4f8; border-left: 4px solid #4682B4; padding: 15px; margin: 20px 0; }
        .stat-block { background: #f9f9f9; border: 2px solid #8B0000; padding: 15px; margin: 20px 0; border-radius: 5px; }
        h1 { color: #8B0000; font-size: 2.5em; margin: 0; }
        h2 { color: #8B0000; border-bottom: 2px solid #8B0000; padding-bottom: 5px; }
        h4 { color: #4682B4; margin-top: 0; }
      </style>
    </head>
    <body>
      <div class="adventure-header">
        <h1>${adventure.title}</h1>
        <p><strong>Author:</strong> ${adventure.author} | <strong>Version:</strong> ${adventure.version}</p>
        <p><strong>Player Levels:</strong> ${adventure.playerLevels} | <strong>Duration:</strong> ${adventure.duration}</p>
        <p>${adventure.description}</p>
      </div>
      ${sections}
    </body>
    </html>
  `
}

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default useAdventureStore 