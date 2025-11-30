import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fwmlwnrloqxxxtqnydyu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bWx3bnJsb3F4eHh0cW55ZHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDg3MzcsImV4cCI6MjA4MDAyNDczN30.DnBBNb8LBKeZ1FXAFAzka_qhFBKEu7MV1TZTbaEf4Ho";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPostgresPatients = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials missing. Please check POSTGRES_SETUP.md");
        return [];
    }

    const { data, error } = await supabase
        .from('patients')
        .select('*');

    if (error) {
        console.error('Error fetching from Postgres:', error);
        return [];
    }
    return data;
};

export const addPostgresRecord = async (table: string, record: any) => {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    const { data, error } = await supabase
        .from(table)
        .insert([record])
        .select();

    if (error) {
        console.error(`Error inserting into ${table}:`, error);
        return null;
    }
    return data;
};
