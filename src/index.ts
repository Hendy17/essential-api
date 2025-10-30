import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import taskRoutes from './routes/taskRoutes';
import { testConnection, createTables } from './config/database';

dotenv.config();

const initializeApp = async (): Promise<void> => {
  try {
    await testConnection();
    
    await createTables();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Task Management API is running',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Inicia o servidor
const startServer = async (): Promise<void> => {
  try {
    // Inicializa o banco de dados
    await initializeApp();
    
    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Inicia a aplicação
startServer();

export default app;