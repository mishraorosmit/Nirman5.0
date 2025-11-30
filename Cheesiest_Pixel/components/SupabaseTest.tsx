import React, { useEffect, useState } from 'react';
import { supabase } from '../services/postgresService';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';

const SupabaseTest: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [data, setData] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const testConnection = async () => {
            try {
                // Try to fetch from the 'research_notes' table we suggested creating
                const { data, error } = await supabase
                    .from('research_notes')
                    .select('*')
                    .limit(5);

                if (error) throw error;

                setData(data || []);
                setStatus('success');
            } catch (err: any) {
                console.error("Supabase connection error:", err);
                setMessage(err.message || 'Failed to connect');
                setStatus('error');
            }
        };

        testConnection();
    }, []);

    return (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 max-w-md">
            <div className="flex items-center gap-2 mb-3">
                <Database size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">PostgreSQL Connection Test</h3>
            </div>

            {status === 'loading' && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 size={14} className="animate-spin" />
                    Testing connection to Supabase...
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                        <CheckCircle size={14} />
                        Connected Successfully
                    </div>
                    {data.length > 0 ? (
                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                            <p className="font-mono mb-1 text-[10px] uppercase text-slate-400">Data from 'research_notes':</p>
                            {data.map((item, i) => (
                                <div key={i} className="mb-1 last:mb-0">
                                    • {item.title || JSON.stringify(item)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Table 'research_notes' is empty or doesn't exist yet.</p>
                    )}
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-start gap-2 text-xs text-red-500">
                    <XCircle size={14} className="mt-0.5" />
                    <div>
                        <p className="font-bold">Connection Failed</p>
                        <p className="opacity-80">{message}</p>
                        <p className="mt-1 text-[10px] text-slate-400">Did you create the 'research_notes' table in Supabase SQL Editor?</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupabaseTest;
