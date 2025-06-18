import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// Import routes
import aiRoutes from './routes/ai'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// AI-specific rate limiting (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
  message: 'Too many AI requests, please try again later.'
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API Routes
app.use('/api/ai', aiLimiter, aiRoutes)

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    })
  }
  
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  socket.on('join-adventure', (adventureId: string) => {
    socket.join(`adventure-${adventureId}`)
    console.log(`User ${socket.id} joined adventure ${adventureId}`)
  })
  
  socket.on('leave-adventure', (adventureId: string) => {
    socket.leave(`adventure-${adventureId}`)
    console.log(`User ${socket.id} left adventure ${adventureId}`)
  })
  
  socket.on('content-change', (data) => {
    socket.to(`adventure-${data.adventureId}`).emit('content-change', {
      content: data.content,
      userId: socket.id,
      timestamp: new Date().toISOString()
    })
  })
  
  socket.on('cursor-position', (data) => {
    socket.to(`adventure-${data.adventureId}`).emit('cursor-position', {
      position: data.position,
      userId: socket.id,
      userName: data.userName || 'Anonymous'
    })
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🤖 AI Providers: ${process.env.OPENAI_API_KEY ? 'OpenAI' : ''}${process.env.ANTHROPIC_API_KEY ? ' Anthropic' : ''}`)
})

export { app, server, io } 