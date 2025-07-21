import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { 
  EditorState, 
  Adventure, 
  CollaborationState, 
  CollaborationUser,
  DnDContent 
} from '../types/editor'

interface EditorStore extends EditorState {
  // Adventure management
  currentAdventure: Adventure | null
  setCurrentAdventure: (adventure: Adventure | null) => void
  
  // Content management
  updateContent: (content: string) => void
  setSelection: (from: number, to: number) => void
  setEditable: (editable: boolean) => void
  markChanged: () => void
  markSaved: () => void
  
  // D&D content management
  dndContent: Record<string, DnDContent>
  addDnDContent: (content: DnDContent) => void
  updateDnDContent: (id: string, content: Partial<DnDContent>) => void
  removeDnDContent: (id: string) => void
  getDnDContent: (id: string) => DnDContent | undefined
  
  // Collaboration
  collaboration: CollaborationState
  setCollaborationUsers: (users: CollaborationUser[]) => void
  addCollaborationUser: (user: CollaborationUser) => void
  removeCollaborationUser: (userId: string) => void
  updateUserCursor: (userId: string, from: number, to: number) => void
  setConnectionStatus: (connected: boolean) => void
  setRoomId: (roomId: string) => void
  
  // Auto-save functionality
  autoSaveEnabled: boolean
  autoSaveInterval: number
  setAutoSave: (enabled: boolean, interval?: number) => void
  
  // Undo/Redo (will be handled by Tiptap, but we track state)
  canUndo: boolean
  canRedo: boolean
  setUndoRedoState: (canUndo: boolean, canRedo: boolean) => void
}

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // Initial editor state
      content: '',
      selection: { from: 0, to: 0 },
      isEditable: true,
      hasChanges: false,
      lastSaved: undefined,
      
      // Adventure state
      currentAdventure: null,
      setCurrentAdventure: (adventure) => 
        set({ currentAdventure: adventure }, false, 'setCurrentAdventure'),
      
      // Content management
      updateContent: (content) => 
        set({ 
          content, 
          hasChanges: true 
        }, false, 'updateContent'),
      
      setSelection: (from, to) => 
        set({ 
          selection: { from, to } 
        }, false, 'setSelection'),
      
      setEditable: (isEditable) => 
        set({ isEditable }, false, 'setEditable'),
      
      markChanged: () => 
        set({ hasChanges: true }, false, 'markChanged'),
      
      markSaved: () => 
        set({ 
          hasChanges: false, 
          lastSaved: new Date() 
        }, false, 'markSaved'),
      
      // D&D content management
      dndContent: {},
      
      addDnDContent: (content) => 
        set((state) => ({
          dndContent: {
            ...state.dndContent,
            [content.id]: content
          }
        }), false, 'addDnDContent'),
      
      updateDnDContent: (id, updates) => 
        set((state) => ({
          dndContent: {
            ...state.dndContent,
            [id]: state.dndContent[id] 
              ? { ...state.dndContent[id], ...updates, updatedAt: new Date() }
              : state.dndContent[id]
          }
        }), false, 'updateDnDContent'),
      
      removeDnDContent: (id) => 
        set((state) => {
          const { [id]: removed, ...rest } = state.dndContent
          return { dndContent: rest }
        }, false, 'removeDnDContent'),
      
      getDnDContent: (id) => get().dndContent[id],
      
      // Collaboration state
      collaboration: {
        users: [],
        isConnected: false,
        roomId: ''
      },
      
      setCollaborationUsers: (users) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            users
          }
        }), false, 'setCollaborationUsers'),
      
      addCollaborationUser: (user) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            users: [...state.collaboration.users, user]
          }
        }), false, 'addCollaborationUser'),
      
      removeCollaborationUser: (userId) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            users: state.collaboration.users.filter(u => u.id !== userId)
          }
        }), false, 'removeCollaborationUser'),
      
      updateUserCursor: (userId, from, to) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            users: state.collaboration.users.map(user => 
              user.id === userId 
                ? { ...user, cursor: { from, to } }
                : user
            )
          }
        }), false, 'updateUserCursor'),
      
      setConnectionStatus: (isConnected) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            isConnected
          }
        }), false, 'setConnectionStatus'),
      
      setRoomId: (roomId) => 
        set((state) => ({
          collaboration: {
            ...state.collaboration,
            roomId
          }
        }), false, 'setRoomId'),
      
      // Auto-save
      autoSaveEnabled: true,
      autoSaveInterval: 30000, // 30 seconds
      setAutoSave: (enabled, interval = 30000) => 
        set({ 
          autoSaveEnabled: enabled, 
          autoSaveInterval: interval 
        }, false, 'setAutoSave'),
      
      // Undo/Redo state
      canUndo: false,
      canRedo: false,
      setUndoRedoState: (canUndo, canRedo) => 
        set({ canUndo, canRedo }, false, 'setUndoRedoState'),
    }),
    {
      name: 'editor-store',
      partialize: (state) => ({
        // Only persist certain parts of the state
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveInterval: state.autoSaveInterval,
        currentAdventure: state.currentAdventure,
        dndContent: state.dndContent
      })
    }
  )
)

// Selectors for common use cases
export const useEditorContent = () => useEditorStore(state => state.content)
export const useEditorSelection = () => useEditorStore(state => state.selection)
export const useEditorChanges = () => useEditorStore(state => state.hasChanges)
export const useCurrentAdventure = () => useEditorStore(state => state.currentAdventure)
export const useCollaboration = () => useEditorStore(state => state.collaboration)
export const useDnDContent = () => useEditorStore(state => state.dndContent)
export const useAutoSave = () => useEditorStore(state => ({ 
  enabled: state.autoSaveEnabled, 
  interval: state.autoSaveInterval 
}))
export const useUndoRedo = () => useEditorStore(state => ({ 
  canUndo: state.canUndo, 
  canRedo: state.canRedo 
})) 