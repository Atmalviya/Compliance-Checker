import { supabaseAdmin } from '../lib/supabaseClient.js';

export async function getLogs(limit = 10, offset = 0, filters = {}) {
  try {
    let query = supabaseAdmin
      .from('compliance_logs')
      .select('*', { count: 'exact' });

    if (filters.checkType) {
      query = query.eq('check_type', filters.checkType);
    }
    if (filters.status !== undefined) {
      query = query.eq('status', filters.status);
    }
    if (filters.dateFrom) {
      query = query.gte('timestamp', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('timestamp', filters.dateTo);
    }

    const { data, error, count } = await query
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      logs: data,
      total: count,
      limit,
      offset,
      hasMore: count > offset + limit
    };
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
} 