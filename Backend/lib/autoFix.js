import { supabaseAdmin } from './supabaseClient.js';

export async function enableRLS(tableName) {
  try {
    // Enable RLS on the specified table
    const { error: rlsError } = await supabaseAdmin.rpc('enable_rls', {
      table_name: tableName
    });

    if (rlsError) throw rlsError;

    // Log the auto-fix action
    const { error: logError } = await supabaseAdmin
      .from('compliance_logs')
      .insert([
        {
          check_type: 'AUTO_FIX',
          status: true,
          details: {
            action: 'ENABLE_RLS',
            table_name: tableName,
            timestamp: new Date().toISOString()
          }
        }
      ]);

    if (logError) {
      console.error('Error logging auto-fix:', logError);
    }

    return {
      success: true,
      message: `RLS enabled for table: ${tableName}`
    };

  } catch (error) {
    console.error('Auto-fix Error:', error);
    throw error;
  }
} 