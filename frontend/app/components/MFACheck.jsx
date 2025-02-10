"use client";

import { useState, useEffect } from 'react';
import { logEvidence } from '../lib/evidenceLogger';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { api } from '../../services/api';

function MFACheck() {
  const [users, setUsers] = useState([]);
  const [projectMfaEnabled, setProjectMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.checkMFA();
        const data = await response

        if (data.error) {
          throw new Error(data.error);
        }

        setUsers(data.users);
        setProjectMfaEnabled(data.projectMfaEnabled);

        const evidenceDetails = {
          total_users: data.users.length,
          users_with_mfa: data.users.filter(u => u.mfaEnabled).length,
          users_without_mfa: data.users.filter(u => !u.mfaEnabled).length,
          mfa_enabled_project: data.projectMfaEnabled,
          user_details: data.users.map(u => ({
            email: u.email,
            mfa_status: u.mfaEnabled
          }))
        };

        await logEvidence('MFA_CHECK', 
          evidenceDetails.users_without_mfa === 0 && data.projectMfaEnabled,
          evidenceDetails
        );
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant={projectMfaEnabled ? "default" : "warning"}>
        <Shield className="h-4 w-4" />
        <AlertTitle>Project MFA Status</AlertTitle>
        <AlertDescription>
          Project-wide MFA is currently {projectMfaEnabled ? "enabled" : "disabled"}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Factors: {user.factorCount}
                </p>
              </div>
              <Badge variant={user.mfaEnabled ? "success" : "destructive"}>
                {user.mfaEnabled ? (
                  <ShieldCheck className="h-3 w-3 mr-1" />
                ) : (
                  <ShieldAlert className="h-3 w-3 mr-1" />
                )}
                {user.mfaEnabled ? "MFA Enabled" : "MFA Disabled"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MFACheck;
