import express from 'express';
import { checkMFA } from './check-mfa.js';
import { checkTokens } from './check-tokens.js';
import { checkPITR } from './check-pitr.js';
import { checkRLS } from './check-rls.js';
import { getLogs } from './get-logs.js';
import { logEvidence } from '../lib/evidenceLogger.js';
import { enableRLS } from '../lib/autoFix.js';
import { validateLogEvidence, validateAutoFix } from '../middleware/validation.js';

const router = express.Router();

router.get('/check-mfa', async (req, res, next) => {
  try {
    const result = await checkMFA();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/check-tokens', async (req, res, next) => {
  try {
    const result = await checkTokens();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/check-pitr', async (req, res, next) => {
  try {
    const result = await checkPITR();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/check-rls', async (req, res, next) => {
  try {
    const result = await checkRLS();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/log-evidence', validateLogEvidence, async (req, res, next) => {
  try {
    const { checkType, status, details } = req.body;
    const result = await logEvidence(checkType, status, details);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/auto-fix', validateAutoFix, async (req, res, next) => {
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
    next(error);
  }
});

router.get('/logs', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const result = await getLogs(limit, offset);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router; 