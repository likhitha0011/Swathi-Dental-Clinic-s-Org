/**
 * Appointment Data Management Layer
 * Features persistent client-side database, double-booking prevention,
 * slot calculation based on clinic operating hours, and admin state management.
 */

import {
  saveAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  updateAppointmentInSupabase,
  testSupabaseConnection,
  SupabaseSyncResult
} from './supabaseClient';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Rescheduled' | 'Cancelled' | 'Completed';

export interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  email: string;
  service: string;
  appointment_date: string; // Format: YYYY-MM-DD
  appointment_time: string; // Format: e.g. "05:30 PM"
  patient_type: 'New Patient' | 'Existing Patient';
  message?: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  synced_to_supabase?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  bookedBy?: string;
}

const STORAGE_KEY = 'swathi_dental_appointments_v1';
const CLINIC_CONFIG_KEY = 'swathi_dental_clinic_config_v1';

export const STANDARD_EVENING_SLOTS = [
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM'
];

// Helper to format Date to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate realistic initial seed appointments if storage is empty
function getInitialAppointments(): Appointment[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + (today.getDay() === 0 ? 1 : 1)); // skip sunday if needed
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(tomorrow.getDate() + 1);
  if (dayAfter.getDay() === 0) dayAfter.setDate(dayAfter.getDate() + 1);

  const tomorrowStr = formatDateKey(tomorrow);
  const dayAfterStr = formatDateKey(dayAfter);

  return [
    {
      id: 'SW-2026-1001',
      patient_name: 'Rajesh Kumar',
      phone: '+91 98450 12345',
      email: 'rajesh.k@example.com',
      service: 'Root Canal Treatment',
      appointment_date: tomorrowStr,
      appointment_time: '05:30 PM',
      patient_type: 'New Patient',
      message: 'Experiencing mild sensitivity in lower right molar for the past week.',
      status: 'Confirmed',
      admin_notes: 'Confirmed by phone. Advised to bring previous dental X-rays if available.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 43200000).toISOString(),
      synced_to_supabase: true
    },
    {
      id: 'SW-2026-1002',
      patient_name: 'Priyanka Sharma',
      phone: '+91 98860 98765',
      email: 'priyanka.s@example.com',
      service: 'Scaling & Polishing',
      appointment_date: tomorrowStr,
      appointment_time: '07:00 PM',
      patient_type: 'Existing Patient',
      message: 'Routine bi-annual dental cleaning and check-up.',
      status: 'Pending',
      admin_notes: '',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      updated_at: new Date(Date.now() - 14400000).toISOString(),
      synced_to_supabase: true
    },
    {
      id: 'SW-2026-1003',
      patient_name: 'Sunil Rao',
      phone: '+91 94480 55432',
      email: 'sunil.rao@example.com',
      service: 'Dental Consultation',
      appointment_date: dayAfterStr,
      appointment_time: '06:00 PM',
      patient_type: 'New Patient',
      message: 'Consultation for crown restoration on upper premolar.',
      status: 'Pending',
      admin_notes: '',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      synced_to_supabase: true
    }
  ];
}

class AppointmentStore {
  private appointments: Appointment[] = [];
  private isSyncing = false;

  constructor() {
    this.loadFromStorage();
    // Auto-sync with Supabase in the background
    this.syncWithSupabase().catch((err) => {
      console.warn('Initial Supabase sync check:', err);
    });
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.appointments = JSON.parse(data);
      } else {
        this.appointments = getInitialAppointments();
        this.saveToStorage();
      }
    } catch {
      this.appointments = getInitialAppointments();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.appointments));
      window.dispatchEvent(new Event('swathi_appointments_updated'));
    } catch (e) {
      console.error('Failed to save appointments to storage', e);
    }
  }

  public async syncWithSupabase(): Promise<{
    success: boolean;
    syncedCount: number;
    error?: string;
  }> {
    if (this.isSyncing) return { success: true, syncedCount: 0 };
    this.isSyncing = true;

    try {
      const res = await fetchAppointmentsFromSupabase();
      if (!res.success) {
        this.isSyncing = false;
        return { success: false, syncedCount: 0, error: res.error };
      }

      if (res.appointments && res.appointments.length > 0) {
        // Merge Supabase appointments into local store
        const existingMap = new Map<string, Appointment>();
        this.appointments.forEach((a) => existingMap.set(a.id, a));

        res.appointments.forEach((remoteApt) => {
          existingMap.set(remoteApt.id, {
            ...remoteApt,
            synced_to_supabase: true
          });
        });

        this.appointments = Array.from(existingMap.values());
        this.saveToStorage();
        this.isSyncing = false;
        return { success: true, syncedCount: res.appointments.length };
      }

      this.isSyncing = false;
      return { success: true, syncedCount: 0 };
    } catch (err: any) {
      this.isSyncing = false;
      return { success: false, syncedCount: 0, error: err?.message };
    }
  }

  public getAll(): Appointment[] {
    this.loadFromStorage();
    return [...this.appointments].sort((a, b) => {
      // Sort by date, then time
      const dateCmp = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCmp !== 0) return dateCmp;
      return a.appointment_time.localeCompare(b.appointment_time);
    });
  }

  public getById(id: string): Appointment | undefined {
    this.loadFromStorage();
    return this.appointments.find((apt) => apt.id === id);
  }

  public isSunday(dateString: string): boolean {
    const [y, m, d] = dateString.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.getDay() === 0;
  }

  public getAvailableSlots(dateString: string): { isSunday: boolean; slots: TimeSlot[] } {
    this.loadFromStorage();

    if (this.isSunday(dateString)) {
      return { isSunday: true, slots: [] };
    }

    const activeAptsOnDate = this.appointments.filter(
      (apt) => apt.appointment_date === dateString && apt.status !== 'Cancelled'
    );

    const bookedTimes = new Set(activeAptsOnDate.map((apt) => apt.appointment_time));

    const slots: TimeSlot[] = STANDARD_EVENING_SLOTS.map((time) => {
      const isBooked = bookedTimes.has(time);
      const bookedApt = isBooked ? activeAptsOnDate.find((apt) => apt.appointment_time === time) : undefined;
      return {
        time,
        available: !isBooked,
        bookedBy: bookedApt ? bookedApt.patient_name : undefined
      };
    });

    return { isSunday: false, slots };
  }

  public async createAppointment(params: {
    patient_name: string;
    phone: string;
    email: string;
    service: string;
    appointment_date: string;
    appointment_time: string;
    patient_type: 'New Patient' | 'Existing Patient';
    message?: string;
  }): Promise<{
    success: boolean;
    appointment?: Appointment;
    supabaseResult?: SupabaseSyncResult;
    error?: string;
  }> {
    this.loadFromStorage();

    // Validate Sunday
    if (this.isSunday(params.appointment_date)) {
      return {
        success: false,
        error: 'Swathi Dental Clinic is closed on Sundays. Please select a date from Monday to Saturday.'
      };
    }

    // Prevent double booking
    const conflict = this.appointments.find(
      (apt) =>
        apt.appointment_date === params.appointment_date &&
        apt.appointment_time === params.appointment_time &&
        apt.status !== 'Cancelled'
    );

    if (conflict) {
      return {
        success: false,
        error: `The ${params.appointment_time} time slot on ${params.appointment_date} has just been reserved. Please select another available time.`
      };
    }

    // Generate unique readable ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newApt: Appointment = {
      id: `SW-${new Date().getFullYear()}-${randomSuffix}`,
      patient_name: params.patient_name.trim(),
      phone: params.phone.trim(),
      email: params.email.trim(),
      service: params.service,
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time,
      patient_type: params.patient_type,
      message: params.message?.trim() || '',
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced_to_supabase: false
    };

    // Save locally first so the appointment is never lost
    this.appointments.unshift(newApt);
    this.saveToStorage();

    // Now sync directly to Supabase
    let supabaseResult: SupabaseSyncResult = { success: false };
    try {
      supabaseResult = await saveAppointmentToSupabase(newApt);
      if (supabaseResult.success) {
        newApt.synced_to_supabase = true;
        this.saveToStorage();
      }
    } catch (e: any) {
      console.warn('Could not sync to Supabase immediately:', e);
      supabaseResult = { success: false, error: e?.message };
    }

    return { success: true, appointment: newApt, supabaseResult };
  }

  public updateStatus(id: string, status: AppointmentStatus, admin_notes?: string): boolean {
    this.loadFromStorage();
    const aptIndex = this.appointments.findIndex((a) => a.id === id);
    if (aptIndex === -1) return false;

    this.appointments[aptIndex] = {
      ...this.appointments[aptIndex],
      status,
      admin_notes: admin_notes !== undefined ? admin_notes : this.appointments[aptIndex].admin_notes,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage();

    // Async push update to Supabase
    updateAppointmentInSupabase(id, {
      status,
      admin_notes: this.appointments[aptIndex].admin_notes
    }).catch((e) => console.warn('Supabase status update error:', e));

    return true;
  }

  public reschedule(id: string, newDate: string, newTime: string, notes?: string): { success: boolean; error?: string } {
    this.loadFromStorage();
    const aptIndex = this.appointments.findIndex((a) => a.id === id);
    if (aptIndex === -1) return { success: false, error: 'Appointment not found' };

    if (this.isSunday(newDate)) {
      return { success: false, error: 'Clinic is closed on Sundays.' };
    }

    const conflict = this.appointments.find(
      (apt) =>
        apt.id !== id &&
        apt.appointment_date === newDate &&
        apt.appointment_time === newTime &&
        apt.status !== 'Cancelled'
    );

    if (conflict) {
      return { success: false, error: 'That time slot is already reserved by another patient.' };
    }

    this.appointments[aptIndex] = {
      ...this.appointments[aptIndex],
      appointment_date: newDate,
      appointment_time: newTime,
      status: 'Rescheduled',
      admin_notes: notes || this.appointments[aptIndex].admin_notes,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage();

    // Async push reschedule to Supabase
    updateAppointmentInSupabase(id, {
      appointment_date: newDate,
      appointment_time: newTime,
      status: 'Rescheduled',
      admin_notes: this.appointments[aptIndex].admin_notes
    }).catch((e) => console.warn('Supabase reschedule update error:', e));

    return { success: true };
  }

  public exportToCSV(): string {
    const list = this.getAll();
    const headers = [
      'Appointment ID',
      'Patient Name',
      'Phone',
      'Email',
      'Service',
      'Date',
      'Time',
      'Patient Type',
      'Status',
      'Created At',
      'Notes',
      'Synced to Supabase'
    ];

    const rows = list.map((a) => [
      a.id,
      `"${a.patient_name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.service}"`,
      a.appointment_date,
      a.appointment_time,
      a.patient_type,
      a.status,
      a.created_at,
      `"${(a.admin_notes || '').replace(/"/g, '""')}"`,
      a.synced_to_supabase ? 'Yes' : 'No'
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const appointmentStore = new AppointmentStore();
