import './config/environment.js';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://compliance-checker.atmalviya.cloud',
    'http://compliance-checker.atmalviya.cloud'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 