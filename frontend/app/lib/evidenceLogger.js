import { api } from '../../services/api';

export async function logEvidence(checkType, status, details) {
  try {
    return await api.logEvidence(checkType, status, details);
  } catch (error) {
    console.error('Error logging evidence:', error);
    throw error;
  }
}