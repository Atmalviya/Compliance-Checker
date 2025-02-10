"use client";

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AutoFix from './AutoFix';

function RLSCheck() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkRLS = async () => {
        try {
            const data = await api.checkRLS();
            setTables(data || []);
        } catch (err) {
            console.error('RLS Check Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkRLS();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">RLS Status Check</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-4">
                    {tables.map((table) => (
                        <div key={table.table_name} className="border p-4 rounded">
                            <p>Table: {table.table_name}</p>
                            <p className={table.rls_enabled ? "text-green-500" : "text-red-500"}>
                                RLS: {table.rls_enabled ? "Enabled" : "Disabled"}
                            </p>
                            {!table.rls_enabled && (
                                <AutoFix 
                                    type="ENABLE_RLS" 
                                    resourceId={table.table_name}
                                    onComplete={() => checkRLS()}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RLSCheck;