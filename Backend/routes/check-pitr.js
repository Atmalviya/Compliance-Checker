import { supabaseAdmin } from '../lib/supabaseClient.js';
import fetch from 'node-fetch';

export async function checkPITR() {
    try {
        if (!process.env.SUPABASE_PROJECT_ID) {
            throw new Error('SUPABASE_PROJECT_ID is not configured');
        }
        if (!process.env.SUPABASE_ACCESS_TOKEN) {
            throw new Error('SUPABASE_ACCESS_TOKEN is not configured');
        }

        console.log('Checking PITR for project:', process.env.SUPABASE_PROJECT_ID);

        const projectResponse = await fetch(
            `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_ID}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!projectResponse.ok) {
            const projectError = await projectResponse.text();
            console.error('Project API Response:', {
                status: projectResponse.status,
                error: projectError
            });
            throw new Error(`Project API Error (${projectResponse.status}): ${projectError}`);
        }

        const projectData = await projectResponse.json();
        console.log('Project data retrieved successfully');

        const backupResponse = await fetch(
            `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_ID}/database/backups`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!backupResponse.ok) {
            const backupError = await backupResponse.text();
            console.error('Backup API Response:', {
                status: backupResponse.status,
                error: backupError
            });
            throw new Error(`Backup API Error (${backupResponse.status}): ${backupError}`);
        }

        const backupData = await backupResponse.json();
        console.log('Backup data retrieved successfully:', backupData);

        const pitrEnabled = backupData.point_in_time_recovery_enabled || false;

        try {
            await supabaseAdmin
                .from('compliance_logs')
                .insert([
                    {
                        check_type: 'PITR_CHECK',
                        status: pitrEnabled,
                        details: {
                            pitr_enabled: pitrEnabled,
                            project_id: projectData.id,
                            project_name: projectData.name,
                            timestamp: new Date().toISOString(),
                        }
                    }
                ]);
            console.log('Evidence logged successfully');
        } catch (logError) {
            console.error('Failed to log evidence:', logError);
        }

        const result = {
            pitr_enabled: pitrEnabled,
            project_id: projectData.id,
            project_name: projectData.name
        };

        console.log('PITR check completed:', result);
        return result;

    } catch (error) {
        console.error('PITR Check Error:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
} 