import './config/environment.js';  
import express from 'express';
import cors from 'cors';
import { checkMFA } from './routes/check-mfa.js';
import { checkTokens } from './routes/check-tokens.js';
import { checkPITR } from './routes/check-pitr.js';
import { checkRLS } from './routes/check-rls.js';
import { logEvidence } from './lib/evidenceLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validateLogEvidence, validateAutoFix } from './middleware/validation.js';
import { enableRLS } from './lib/autoFix.js';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000', 
  'https://compliance-checker.atmalviya.cloud/'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/api/check-mfa', async (req, res) => {
  try {
    const result = await checkMFA();
    res.json(result);
  } catch (error) {
    console.error('Error checking MFA:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-tokens', async (req, res) => {
  try {
    const result = await checkTokens();
    res.json(result);
  } catch (error) {
    console.error('Error checking tokens:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-pitr', async (req, res) => {
  try {
    const result = await checkPITR();
    res.json(result);
  } catch (error) {
    console.error('Error checking PITR:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get('/api/check-rls', async (req, res) => {
  try {
    const result = await checkRLS();
    res.json(result);
  } catch (error) {
    console.error('Error checking RLS:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/log-evidence', validateLogEvidence, async (req, res) => {
  try {
    const { checkType, status, details } = req.body;
    const result = await logEvidence(checkType, status, details);
    res.json(result);
  } catch (error) {
    console.error('Error logging evidence:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auto-fix', validateAutoFix, async (req, res) => {
  try {
    const { fixType, resourceId } = req.body;
    
    let result;
    switch (fixType) {
      case 'ENABLE_RLS':
        result = await enableRLS(resourceId);
        break;
      default:
        throw new Error(`Unsupported fix type: ${fixType}`);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in auto-fix:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 