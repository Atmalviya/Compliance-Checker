import { supabaseAdmin } from '../lib/supabaseClient.js';

export async function checkMFA() {
  try {
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const usersWithMFA = users.map(user => {
      const hasMFA = Array.isArray(user.factors) && user.factors.length > 0;
      
      return {
        id: user.id,
        email: user.email,
        mfaEnabled: hasMFA,
        factorCount: user.factors?.length || 0
      };
    });

    const projectMfaEnabled = usersWithMFA.some(user => user.mfaEnabled);

    try {
      await supabaseAdmin
        .from('compliance_logs')
        .insert([
          {
            check_type: 'MFA_CHECK',
            status: usersWithMFA.every(u => u.mfaEnabled),
            timestamp: new Date().toISOString(),
            details: {
              projectMfaEnabled,
              userCount: users.length,
              mfaEnabledUsers: usersWithMFA.filter(u => u.mfaEnabled).length,
              users: usersWithMFA.map(u => ({
                email: u.email,
                mfaEnabled: u.mfaEnabled,
                factorCount: u.factorCount
              }))
            }
          }
        ]);
    } catch (logError) {
      console.error('Failed to log evidence:', logError);
    }

    return {
      users: usersWithMFA,
      projectMfaEnabled,
      totalUsers: users.length,
      mfaEnabledUsers: usersWithMFA.filter(u => u.mfaEnabled).length
    };

  } catch (error) {
    throw error;
  }
} 