// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import protectedRoutes from './routes/protectedRoutes';
import authRoutes from './routes/authRoutes';
import loanRoutes from './routes/loanRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Loan Manager API Running');
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://harshkasana05:1wc80SHW7oNimg9w@cluster0.5tbnnqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));