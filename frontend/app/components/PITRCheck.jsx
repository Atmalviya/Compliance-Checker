"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

function PITRCheck() {
    const [pitrStatus, setPitrStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function checkPITR() {
            try {
                const data = await api.checkPITR();
                setPitrStatus(data);
            } catch (err) {
                console.error('PITR Check Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        checkPITR();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <Shield className="h-6 w-6" />
                        <div>Loading PITR status...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {pitrStatus?.pitr_enabled ? (
                                <ShieldCheck className="h-6 w-6 text-green-500" />
                            ) : (
                                <ShieldAlert className="h-6 w-6 text-red-500" />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">Point in Time Recovery (PITR)</h3>
                                <p className="text-sm text-gray-500">
                                    Project: {pitrStatus?.project_name}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant={pitrStatus?.pitr_enabled ? "success" : "destructive"}
                        >
                            {pitrStatus?.pitr_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </div>
                    {!pitrStatus?.pitr_enabled && (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>PITR is not enabled</AlertTitle>
                            <AlertDescription>
                                Enable Point in Time Recovery in your Supabase dashboard to protect against data loss.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default PITRCheck;