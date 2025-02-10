const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async checkMFA() {
    const response = await fetch(`${API_BASE_URL}/api/check-mfa`);
    if (!response.ok) {
      throw new Error('Failed to check MFA status');
    }
    return response.json();
  },

  async checkTokens() {
    const response = await fetch(`${API_BASE_URL}/api/check-tokens`);
    if (!response.ok) {
      throw new Error('Failed to check tokens');
    }
    return response.json();
  },

  async checkPITR() {
    const response = await fetch(`${API_BASE_URL}/api/check-pitr`);
    if (!response.ok) {
      throw new Error('Failed to check PITR status');
    }
    return response.json();
  },

  async checkRLS() {
    const response = await fetch(`${API_BASE_URL}/api/check-rls`);
    if (!response.ok) {
      throw new Error('Failed to check RLS status');
    }
    return response.json();
  },

  async enableRLS(tableName) {
    const response = await fetch(`${API_BASE_URL}/api/auto-fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fixType: 'ENABLE_RLS',
        resourceId: tableName
      })
    });
    if (!response.ok) {
      throw new Error('Failed to enable RLS');
    }
    return response.json();
  },

  async logEvidence(checkType, status, details) {
    const response = await fetch(`${API_BASE_URL}/api/log-evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checkType, status, details }),
    });
    if (!response.ok) {
      throw new Error('Failed to log evidence');
    }
    return response.json();
  }
}; 