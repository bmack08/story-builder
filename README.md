# 🐉 D&D Adventure Creator

A professional, AI-powered web application for creating and managing D&D adventures with rich text editing, real-time collaboration, and intelligent content generation.

## ✨ Features

- **Rich Text Editor** with D&D-specific slash commands (`/monster`, `/npc`, `/trap`, `/item`, `/encounter`)
- **AI-Powered Content Generation** using OpenAI and Anthropic Claude
- **D&D Beyond-Style Tooltips** for spells, monsters, items, and conditions
- **Real-time Collaboration** with WebSocket support
- **Initiative Tracker** with full combat management
- **Encounter Balancer** with XP calculations and difficulty scaling
- **Campaign Management** with adventure templates
- **Fantasy-Themed UI** with dark mode support
- **Professional DM Tools** designed for seamless gameplay

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** 
- **PostgreSQL 15+**
- **Redis 7+**

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "dnd story writer"
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd dnd-adventure-creator
   npm install
   
   # Backend
   cd ../dnd-backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # In dnd-backend directory
   cp env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd dnd-backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd dnd-adventure-creator
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001

## 🏗️ Architecture

### Frontend (`dnd-adventure-creator/`)
- **React 18** + TypeScript + Vite
- **Chakra UI** for fantasy-themed components
- **Tiptap** rich text editor with custom D&D extensions
- **Zustand** for state management
- **Socket.io** for real-time features

### Backend (`dnd-backend/`)
- **Node.js** + Express.js + TypeScript
- **PostgreSQL** with optimized schema for D&D content
- **Redis** for caching and session management
- **Socket.io** for WebSocket connections
- **Multi-provider AI** (OpenAI + Anthropic)

## 📁 Project Structure

```
dnd-adventure-creator/
├── src/
│   ├── components/
│   │   ├── editor/          # Rich text editor components
│   │   ├── tooltips/        # D&D content tooltips
│   │   ├── ai/              # AI generation components
│   │   ├── campaign/        # Campaign management
│   │   ├── layout/          # App layout components
│   │   └── ui/              # Reusable UI components
│   ├── services/            # API and external services
│   ├── stores/              # Zustand state stores
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   └── theme/               # Chakra UI theme configuration

dnd-backend/
├── src/
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── services/            # Business logic services
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── websocket/           # WebSocket handlers
│   └── database/            # Database migrations and seeds
```

## 🔧 Development Commands

### Frontend
```bash
cd dnd-adventure-creator
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

### Backend
```bash
cd dnd-backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run test         # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

## 🧪 Testing

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🗺️ Development Roadmap

### Phase 1: Project Foundation ✅ COMPLETED
- [x] Project structure and configuration
- [x] TypeScript setup for both frontend and backend
- [x] Package.json files with all dependencies
- [x] Fantasy-themed UI with Chakra UI
- [x] Development environment setup
- [x] Documentation and setup guides

### Phase 2: Core Editor Implementation ✅ COMPLETED
- [x] Rich text editor with Tiptap
- [x] Slash commands for D&D content insertion
- [x] Editor toolbar with formatting options
- [x] Auto-save functionality
- [x] Preview mode
- [x] Word/character counting
- [x] State management with Zustand

### Phase 3: AI Integration ✅ COMPLETED
- [x] Multi-provider AI service (OpenAI + Anthropic)
- [x] AI content generation for all D&D content types
- [x] AI Generation Dialog with customizable prompts
- [x] AI Assistant with quick generation options
- [x] Integration with slash commands (/ai-monster, /ai-npc, etc.)
- [x] Formatted content insertion into editor
- [x] Rate limiting and error handling for AI requests
- [x] Backend API endpoints for AI generation

### Phase 4: Advanced Features (Next)
- [ ] Real-time collaboration with Socket.io
- [ ] User authentication and authorization
- [ ] Adventure saving and loading
- [ ] D&D tooltips for spells, monsters, items
- [ ] Encounter balancing calculator
- [ ] Initiative tracker
- [ ] Campaign management
- [ ] Export to PDF/HTML

### Phase 5: Polish & Deployment (Future)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Advanced AI features (context-aware suggestions)
- [ ] Plugin system for custom content
- [ ] Community features
- [ ] Production deployment setup

## 🚢 Production Deployment (Optional)

For production deployment, Docker configurations are available:

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wizards of the Coast** for D&D 5e SRD
- **D&D Beyond** for UI/UX inspiration
- **Tiptap** for the excellent rich text editor
- **Chakra UI** for the component library
- **OpenAI & Anthropic** for AI capabilities

---

**Built with ❤️ for the D&D community** 