import { createClient } from '@supabase/supabase-js';
import { Appointment } from './appointmentStore';

export const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID || 'hpofcwtxrzmawipqqaxh';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_3S1DT9-x6sLVbZi22ng4Ng_RpIhxGS8';

// Initialize the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor to initialize the appointments table:
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    patient_type TEXT DEFAULT 'New Patient',
    message TEXT,
    status TEXT DEFAULT 'Pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous/publishable key users to insert appointments (online booking)
CREATE POLICY "Allow public booking inserts" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow reading appointments (for checking availability and staff portal)
CREATE POLICY "Allow reading appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Allow updates (for confirming, rescheduling, updating status)
CREATE POLICY "Allow updating appointments" 
ON public.appointments 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);
`;

export interface SupabaseSyncResult {
  success: boolean;
  message?: string;
  error?: string;
  tableMissing?: boolean;
}

/**
 * Test connectivity with the Supabase project
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .limit(1);

    if (error) {
      // Check if error is because table doesn't exist yet (relation does not exist)
      if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist')) {
        return { connected: true, tableExists: false, error: 'Table "appointments" does not exist yet.' };
      }
      return { connected: false, tableExists: false, error: error.message };
    }

    return { connected: true, tableExists: true };
  } catch (err: any) {
    return { connected: false, tableExists: false, error: err?.message || 'Network error connecting to Supabase.' };
  }
}

/**
 * Save an appointment to Supabase
 */
export async function saveAppointmentToSupabase(appointment: Appointment): Promise<SupabaseSyncResult> {
  try {
    const payload = {
      id: appointment.id,
      patient_name: appointment.patient_name,
      phone: appointment.phone,
      email: appointment.email || null,
      service: appointment.service,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      patient_type: appointment.patient_type,
      message: appointment.message || null,
      status: appointment.status,
      admin_notes: appointment.admin_notes || null,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    };

    const { error } = await supabase
      .from('appointments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase insert warning:', error);
      const isMissing = error.code === '42P01' || error.message.toLowerCase().includes('does not exist');
      return {
        success: false,
        tableMissing: isMissing,
        error: error.message
      };
    }

    return { success: true, message: 'Saved to Supabase database successfully.' };
  } catch (err: any) {
    console.warn('Supabase network exception:', err);
    return {
      success: false,
      error: err?.message || 'Failed to sync with Supabase backend.'
    };
  }
}

/**
 * Fetch all appointments from Supabase
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  success: boolean;
  appointments: Appointment[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) {
      return { success: false, appointments: [], error: error.message };
    }

    if (!data) {
      return { success: true, appointments: [] };
    }

    const mapped: Appointment[] = data.map((item: any) => ({
      id: item.id,
      patient_name: item.patient_name,
      phone: item.phone,
      email: item.email || '',
      service: item.service,
      appointment_date: item.appointment_date,
      appointment_time: item.appointment_time,
      patient_type: item.patient_type || 'New Patient',
      message: item.message || '',
      status: item.status || 'Pending',
      admin_notes: item.admin_notes || '',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
    }));

    return { success: true, appointments: mapped };
  } catch (err: any) {
    return { success: false, appointments: [], error: err?.message || 'Error fetching from Supabase' };
  }
}

/**
 * Update an appointment status or notes in Supabase
 */
export async function updateAppointmentInSupabase(
  id: string,
  updates: Partial<Appointment>
): Promise<SupabaseSyncResult> {
  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.status) payload.status = updates.status;
    if (updates.admin_notes !== undefined) payload.admin_notes = updates.admin_notes;
    if (updates.appointment_date) payload.appointment_date = updates.appointment_date;
    if (updates.appointment_time) payload.appointment_time = updates.appointment_time;

    const { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
