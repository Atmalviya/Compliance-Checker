// "use client";

// import { useState } from 'react';

// export default function AutoFix({ resourceId, onComplete }) {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     const handleFix = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch('/api/auto-fix', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     fixType: 'ENABLE_RLS',
//                     resourceId
//                 })
//             });

//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.error || 'Failed to enable RLS');
//             }

//             setSuccess(true);
//             if (onComplete) onComplete();
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="mt-2">
//             <button
//                 onClick={handleFix}
//                 disabled={loading || success}
//                 className={`px-4 py-2 rounded ${
//                     success 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-blue-500 hover:bg-blue-600 text-white'
//                 } disabled:opacity-50`}
//             >
//                 {loading ? 'Enabling RLS...' : success ? 'RLS Enabled!' : 'Enable RLS'}
//             </button>
//             {error && (
//                 <p className="text-red-500 text-sm mt-1">{error}</p>
//             )}
//         </div>
//     );
// } 


"use client";

import { useState } from 'react';
import { api } from '../../services/api';

export default function AutoFix({ type, resourceId, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFix = async () => {
        setLoading(true);
        setError(null);
        try {
            if (type === 'ENABLE_RLS') {
                await api.enableRLS(resourceId);
            }
            setSuccess(true);
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2">
            <button
                onClick={handleFix}
                disabled={loading || success}
                className={`px-4 py-2 rounded ${
                    success 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:opacity-50`}
            >
                {loading ? 'Enabling RLS...' : success ? 'RLS Enabled!' : 'Enable RLS'}
            </button>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
} 