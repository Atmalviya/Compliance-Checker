import { supabaseAdmin } from '../lib/supabaseClient.js';

export async function checkTokens() {
  try {
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('access_tokens')
      .select('*');

    if (tokensError) throw tokensError;

    const tokenAnalysis = tokens.map((token) => ({
      id: token.id,
      name: token.name,
      isExpired: new Date(token.expiry) < new Date(),
      lastUsed: token.last_used,
      created: token.created_at,
      usageCount: token.usage_count || 0
    }));

    const hasExpiredTokens = tokenAnalysis.some(token => token.isExpired);
    const unusedTokens = tokenAnalysis.filter(token => token.usageCount === 0);

    try {
      await supabaseAdmin
        .from('compliance_logs')
        .insert([
          {
            check_type: 'TOKEN_CHECK',
            status: !hasExpiredTokens && unusedTokens.length === 0,
            timestamp: new Date().toISOString(),
            details: {
              totalTokens: tokens.length,
              expiredTokens: tokenAnalysis.filter(t => t.isExpired).length,
              unusedTokens: unusedTokens.length,
              tokens: tokenAnalysis
            }
          }
        ]);
    } catch (logError) {
      console.error('Failed to log token check:', logError);
    }

    return {
      tokens: tokenAnalysis,
      totalTokens: tokens.length,
      expiredTokens: tokenAnalysis.filter(t => t.isExpired).length,
      unusedTokens: unusedTokens.length,
      status: !hasExpiredTokens && unusedTokens.length === 0
    };

  } catch (error) {
    throw error;
  }
} 