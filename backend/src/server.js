import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import drillRoutes from './routes/drillRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import disasterTypeRoutes from './routes/disasterTypeRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import virtualDrillRoutes from './routes/virtualDrillRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Disaster Preparedness Education System API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      modules: '/api/modules',
      alerts: '/api/alerts',
      drills: '/api/drills',
      contacts: '/api/contacts',
      users: '/api/users',
      quizzes: '/api/quizzes',
      disasterTypes: '/api/disaster-types',
      virtualDrills: '/api/virtual-drills',
      settings: '/api/settings',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/disaster-types', disasterTypeRoutes);
app.use('/api/virtual-drills', virtualDrillRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
