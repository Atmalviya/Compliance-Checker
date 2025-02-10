import { supabaseAdmin } from './supabaseClient.js';

export async function logEvidence(checkType, status, details) {
  const { data, error } = await supabaseAdmin
    .from('compliance_logs')
    .insert([
      {
        check_type: checkType,
        status: status,
        details: details,
        timestamp: new Date().toISOString()
      }
    ]);

  if (error) {
    console.error('Error logging evidence:', error);
  }
  return data;
} 