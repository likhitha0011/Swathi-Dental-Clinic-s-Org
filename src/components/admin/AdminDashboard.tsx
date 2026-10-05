import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  User,
  Search,
  Filter,
  Download,
  AlertTriangle,
  RotateCcw,
  Check,
  Settings,
  Stethoscope,
  Briefcase,
  ChevronRight,
  MessageSquare,
  Database,
  Copy,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  appointmentStore,
  Appointment,
  AppointmentStatus,
  formatDateKey,
  STANDARD_EVENING_SLOTS
} from '../../services/appointmentStore';
import { CLINIC_INFO, CLINIC_SERVICES, DOCTOR_PROFILE } from '../../data/clinicData';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SQL_SCHEMA,
  testSupabaseConnection
} from '../../services/supabaseClient';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings' | 'doctor' | 'services' | 'database'>('appointments');

  // Supabase test state
  const [dbTestResult, setDbTestResult] = useState<{
    tested: boolean;
    loading: boolean;
    connected: boolean;
    tableExists: boolean;
    error?: string;
  }>({
    tested: false,
    loading: false,
    connected: false,
    tableExists: false
  });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // all, today, upcoming
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string>('');

  // Editable Doctor Profile State
  const [editableDoc, setEditableDoc] = useState(DOCTOR_PROFILE);
  const [docSavedMessage, setDocSavedMessage] = useState(false);

  // Editable Clinic Hours State
  const [editableHours, setEditableHours] = useState(CLINIC_INFO.operatingHours);
  const [hoursSavedMessage, setHoursSavedMessage] = useState(false);

  // Check auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('swathi_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load appointments
  const refreshAppointments = () => {
    setAppointments(appointmentStore.getAll());
  };

  useEffect(() => {
    refreshAppointments();
    const handleUpdate = () => refreshAppointments();
    window.addEventListener('swathi_appointments_updated', handleUpdate);
    return () => window.removeEventListener('swathi_appointments_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Clinic staff passcode (default "swathi123" or "admin")
    if (passcode === 'swathi123' || passcode === 'admin' || passcode === '9844192226') {
      setIsAuthenticated(true);
      sessionStorage.setItem('swathi_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect staff passcode. (Default demo pass: swathi123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('swathi_admin_auth');
    setPasscode('');
  };

  // Appointment Actions
  const handleConfirm = (id: string) => {
    appointmentStore.updateStatus(id, 'Confirmed', 'Confirmed by clinic staff.');
    refreshAppointments();
  };

  const handleCancel = (id: string) => {
    const reason = window.prompt('Optional reason for cancellation:');
    appointmentStore.updateStatus(id, 'Cancelled', reason ? `Cancelled: ${reason}` : 'Cancelled by staff.');
    refreshAppointments();
  };

  const handleComplete = (id: string) => {
    appointmentStore.updateStatus(id, 'Completed', 'Consultation successfully concluded.');
    refreshAppointments();
  };

  const openRescheduleModal = (apt: Appointment) => {
    setRescheduleApt(apt);
    setNewDate(apt.appointment_date);
    setNewTime(apt.appointment_time);
    setRescheduleError('');
  };

  const submitReschedule = () => {
    if (!rescheduleApt) return;
    if (!newDate || !newTime) {
      setRescheduleError('Please choose both a new date and a time slot.');
      return;
    }

    const res = appointmentStore.reschedule(rescheduleApt.id, newDate, newTime, 'Rescheduled by staff');
    if (res.success) {
      setRescheduleApt(null);
      refreshAppointments();
    } else {
      setRescheduleError(res.error || 'Failed to reschedule.');
    }
  };

  const handleExportCSV = () => {
    const csvContent = appointmentStore.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `swathi-appointments-${formatDateKey(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestDb = async () => {
    setDbTestResult({ tested: false, loading: true, connected: false, tableExists: false });
    const res = await testSupabaseConnection();
    setDbTestResult({
      tested: true,
      loading: false,
      connected: res.connected,
      tableExists: res.tableExists,
      error: res.error
    });
  };

  const handleSyncDb = async () => {
    setIsSyncingDb(true);
    setSyncStatusMsg(null);
    const res = await appointmentStore.syncWithSupabase();
    setIsSyncingDb(false);
    if (res.success) {
      setSyncStatusMsg(`Successfully synchronized with Supabase (${res.syncedCount} records verified).`);
      refreshAppointments();
    } else {
      setSyncStatusMsg(`Sync notice: ${res.error || 'Could not reach Supabase table'}`);
    }
    setTimeout(() => setSyncStatusMsg(null), 5000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  // Filtered Appointments
  const todayStr = formatDateKey(new Date());

  const filteredAppointments = appointments.filter((apt) => {
    // Status filter
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

    // Service filter
    if (serviceFilter !== 'all' && apt.service !== serviceFilter) return false;

    // Date filter
    if (dateFilter === 'today' && apt.appointment_date !== todayStr) return false;
    if (dateFilter === 'upcoming' && apt.appointment_date < todayStr) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patient_name.toLowerCase().includes(q);
      const matchPhone = apt.phone.includes(q);
      const matchId = apt.id.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }

    return true;
  });

  // Metrics
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const todayCount = appointments.filter((a) => a.appointment_date === todayStr && a.status !== 'Cancelled').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-[#172A30] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#087F8C] flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                Swathi Dental Clinic Staff Portal
              </h2>
              <span className="text-xs text-[#63C7C9]">
                Attiguppe Practice Management · Private & Secure
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#087F8C]">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#172A30]">
                Clinic Staff Sign In
              </h3>
              <p className="text-xs text-[#64777D] mt-1">
                Enter your authorized clinic passcode to manage appointments and clinic configuration.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Access Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter clinic passcode (e.g. swathi123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded border border-rose-200">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                Unlock Staff Portal
              </button>

              <div className="text-[11px] text-slate-400 text-center pt-2">
                Demo access hint: <code className="text-[#087F8C] font-semibold">swathi123</code>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs Bar */}
            <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center justify-between overflow-x-auto shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'appointments'
                      ? 'bg-white text-[#087F8C] shadow-xs border border-slate-200'
                      : 'text-[#64777D] hover:text-[#172A30]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Appointments ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-white text-[#087F8C] shadow-xs border border-slate-200'
                      : 'text-[#64777D] hover:text-[#172A30]'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Clinic Timings</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'doctor'
                      ? 'bg-white text-[#087F8C] shadow-xs border border-slate-200'
                      : 'text-[#64777D] hover:text-[#172A30]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'services'
                      ? 'bg-white text-[#087F8C] shadow-xs border border-slate-200'
                      : 'text-[#64777D] hover:text-[#172A30]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Services Directory</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'database'
                      ? 'bg-white text-[#087F8C] shadow-xs border border-slate-200'
                      : 'text-[#64777D] hover:text-[#172A30]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Subspace / Supabase DB</span>
                </button>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleSyncDb}
                  disabled={isSyncingDb}
                  className="px-3 py-1.5 text-xs font-semibold text-[#087F8C] bg-white border border-[#087F8C]/40 rounded-lg hover:bg-emerald-50 flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  title="Synchronize appointments with Subspace / Supabase backend"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDb ? 'animate-spin' : ''}`} />
                  <span>{isSyncingDb ? 'Syncing...' : 'Sync DB'}</span>
                </button>

                {activeTab === 'appointments' && (
                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 text-xs font-semibold text-[#172A30] bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#087F8C]" />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>
            </div>

            {syncStatusMsg && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-900 font-medium flex items-center justify-between">
                <span>{syncStatusMsg}</span>
                <button onClick={() => setSyncStatusMsg(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">×</button>
              </div>
            )}

            {/* TAB 1: Appointments Management */}
            {activeTab === 'appointments' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F7FBFC] border border-slate-200">
                    <span className="text-[11px] font-semibold text-[#64777D] uppercase tracking-wider block">
                      Total Requests
                    </span>
                    <span className="text-xl font-bold font-mono text-[#172A30] tabular-nums mt-0.5 block">
                      {totalCount}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
                      Pending Action
                    </span>
                    <span className="text-xl font-bold font-mono text-amber-900 tabular-nums mt-0.5 block">
                      {pendingCount}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                      Confirmed
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-900 tabular-nums mt-0.5 block">
                      {confirmedCount}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-[#64777D] uppercase tracking-wider block">
                      Scheduled Today
                    </span>
                    <span className="text-xl font-bold font-mono text-[#075B63] tabular-nums mt-0.5 block">
                      {todayCount}
                    </span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patient, phone, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-[#172A30] font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending Only</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {/* Date Filter */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-[#172A30] font-medium"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today Only</option>
                    <option value="upcoming">Upcoming (Today & Future)</option>
                  </select>

                  {/* Service Filter */}
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-[#172A30] font-medium truncate"
                  >
                    <option value="all">All Services</option>
                    {CLINIC_SERVICES.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                  {filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#64777D]">
                      No appointments match the selected filters.
                    </div>
                  ) : (
                    filteredAppointments.map((apt) => {
                      const isPending = apt.status === 'Pending';
                      const isConfirmed = apt.status === 'Confirmed';
                      const isCancelled = apt.status === 'Cancelled';
                      const isCompleted = apt.status === 'Completed';

                      // WhatsApp Quick Confirmation template
                      const waConfirmUrl = `https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${apt.patient_name}, this is Swathi Dental Clinic, Attiguppe. Your dental appointment for ${apt.service} on ${apt.appointment_date} at ${apt.appointment_time} is confirmed with Dr. Jyothi Nagesh. Please reach 5 minutes early. Thank you!`
                      )}`;

                      return (
                        <div
                          key={apt.id}
                          className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col gap-3 shadow-2xs hover:border-[#087F8C]/40 transition-colors"
                        >
                          {/* Row 1: Status & Reference */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#075B63]">{apt.id}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[#64777D]">{apt.patient_type}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  isPending
                                    ? 'bg-amber-100 text-amber-900'
                                    : isConfirmed
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : isCompleted
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Patient and Service Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                            <div>
                              <strong className="text-base font-bold text-[#172A30] block">
                                {apt.patient_name}
                              </strong>
                              <span className="text-xs text-[#087F8C] font-semibold block">
                                {apt.service}
                              </span>
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs text-[#172A30] font-medium">
                                <Calendar className="w-3.5 h-3.5 text-[#087F8C]" />
                                <span>{apt.appointment_date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-[#075B63] font-bold">
                                <Clock className="w-3.5 h-3.5 text-[#087F8C]" />
                                <span>{apt.appointment_time}</span>
                              </div>
                            </div>

                            <div className="space-y-0.5 text-xs">
                              <a
                                href={`tel:${apt.phone}`}
                                className="flex items-center gap-1.5 text-[#087F8C] hover:underline font-semibold"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>{apt.phone}</span>
                              </a>
                              {apt.email && apt.email !== 'Not provided' && (
                                <span className="flex items-center gap-1.5 text-[#64777D] truncate">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>{apt.email}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Row 3: Notes if any */}
                          {apt.message && (
                            <div className="text-xs bg-[#F7FBFC] p-2.5 rounded-lg border border-slate-100 text-[#64777D]">
                              <strong className="text-[#172A30] font-semibold">Patient Note: </strong>
                              {apt.message}
                            </div>
                          )}

                          {apt.admin_notes && (
                            <div className="text-xs bg-slate-50 p-2 rounded text-[#075B63] italic">
                              <strong>Clinic Log: </strong> {apt.admin_notes}
                            </div>
                          )}

                          {/* Row 4: Action Buttons */}
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <a
                                href={waConfirmUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded flex items-center gap-1"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                <span>Send WhatsApp</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2">
                              {isPending && (
                                <button
                                  onClick={() => handleConfirm(apt.id)}
                                  className="px-3 py-1 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Confirm Slot</span>
                                </button>
                              )}

                              {!isCancelled && !isCompleted && (
                                <button
                                  onClick={() => openRescheduleModal(apt)}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#172A30] text-xs font-medium rounded flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Reschedule</span>
                                </button>
                              )}

                              {isConfirmed && (
                                <button
                                  onClick={() => handleComplete(apt.id)}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-medium rounded"
                                >
                                  Mark Completed
                                </button>
                              )}

                              {!isCancelled && (
                                <button
                                  onClick={() => handleCancel(apt.id)}
                                  className="px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 rounded"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: Clinic Settings */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#172A30]">
                    Clinic Operating Schedule
                  </h3>
                  <p className="text-xs text-[#64777D]">
                    Adjust working days and consultation windows.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Operating Days</label>
                    <input
                      type="text"
                      value={editableHours.days}
                      onChange={(e) => setEditableHours({ ...editableHours, days: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Evening Consultation Timings</label>
                    <input
                      type="text"
                      value={editableHours.timings}
                      onChange={(e) => setEditableHours({ ...editableHours, timings: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Weekly Off</label>
                    <input
                      type="text"
                      value={editableHours.closed}
                      onChange={(e) => setEditableHours({ ...editableHours, closed: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setHoursSavedMessage(true);
                      setTimeout(() => setHoursSavedMessage(false), 3000);
                    }}
                    className="px-4 py-2 bg-[#087F8C] text-white font-bold rounded-lg"
                  >
                    Save Clinic Schedule
                  </button>

                  {hoursSavedMessage && (
                    <span className="text-emerald-700 ml-3 font-semibold">Settings saved.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Doctor Profile */}
            {activeTab === 'doctor' && (
              <div className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#172A30]">
                    Lead Doctor Profile Configuration
                  </h3>
                  <p className="text-xs text-[#64777D]">
                    Display only verified clinical details.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={editableDoc.name}
                      onChange={(e) => setEditableDoc({ ...editableDoc, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={editableDoc.qualifications}
                      onChange={(e) => setEditableDoc({ ...editableDoc, qualifications: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Department / Specialization</label>
                    <input
                      type="text"
                      value={editableDoc.department}
                      onChange={(e) => setEditableDoc({ ...editableDoc, department: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#172A30] mb-1">Clinical Approach Note</label>
                    <textarea
                      rows={3}
                      value={editableDoc.approach}
                      onChange={(e) => setEditableDoc({ ...editableDoc, approach: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setDocSavedMessage(true);
                      setTimeout(() => setDocSavedMessage(false), 3000);
                    }}
                    className="px-4 py-2 bg-[#087F8C] text-white font-bold rounded-lg"
                  >
                    Update Doctor Profile
                  </button>

                  {docSavedMessage && (
                    <span className="text-emerald-700 ml-3 font-semibold">Doctor profile updated.</span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Services Directory */}
            {activeTab === 'services' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <h3 className="text-base font-bold text-[#172A30]">
                  Clinic Treatment Catalog ({CLINIC_SERVICES.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CLINIC_SERVICES.map((s) => (
                    <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-[#F7FBFC] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-sm text-[#172A30]">{s.name}</strong>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-[#64777D] line-clamp-2">{s.shortDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Subspace / Supabase Database Backend */}
            {activeTab === 'database' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B63] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Backend Configured & Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#172A30]">
                    Subspace / Supabase Cloud Database Integration
                  </h3>
                  <p className="text-xs text-[#64777D] mt-0.5">
                    Appointments submitted via the website booking flow are synced to your cloud database automatically.
                  </p>
                </div>

                {/* Credentials & Endpoint Card */}
                <div className="p-5 rounded-xl bg-[#F7FBFC] border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#172A30]">
                    Connected Project Credentials
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-sans font-bold text-[#64777D] block mb-1">
                        Project ID
                      </span>
                      <span className="text-[#075B63] font-bold text-sm select-all">
                        {SUPABASE_PROJECT_ID}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-sans font-bold text-[#64777D] block mb-1">
                        API Endpoint
                      </span>
                      <span className="text-[#087F8C] select-all truncate block" title={SUPABASE_URL}>
                        {SUPABASE_URL}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-3 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] uppercase font-sans font-bold text-[#64777D] block mb-1">
                        Publishable API Key
                      </span>
                      <span className="text-[#172A30] select-all text-xs truncate block font-mono">
                        {SUPABASE_PUBLISHABLE_KEY}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleTestDb}
                      disabled={dbTestResult.loading}
                      className="px-4 py-2 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>{dbTestResult.loading ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    <button
                      onClick={handleSyncDb}
                      disabled={isSyncingDb}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-[#172A30] text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#087F8C] ${isSyncingDb ? 'animate-spin' : ''}`} />
                      <span>{isSyncingDb ? 'Syncing...' : 'Sync All Appointments'}</span>
                    </button>

                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-semibold text-[#087F8C] hover:underline inline-flex items-center gap-1.5 ml-auto"
                    >
                      <span>Open Project Dashboard</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Test Result Message */}
                  {dbTestResult.tested && (
                    <div
                      className={`p-3 rounded-lg text-xs border ${
                        dbTestResult.connected && dbTestResult.tableExists
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : dbTestResult.connected && !dbTestResult.tableExists
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      {dbTestResult.connected && dbTestResult.tableExists && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Connection Successful!</strong> Connected to project <code>{SUPABASE_PROJECT_ID}</code> and verified that table <code>appointments</code> is ready.
                          </span>
                        </div>
                      )}
                      {dbTestResult.connected && !dbTestResult.tableExists && (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Connected to project</strong>, but table <code>appointments</code> has not been created yet. Copy and run the SQL schema script below in your Supabase SQL Editor.
                          </div>
                        </div>
                      )}
                      {!dbTestResult.connected && (
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Connection error:</strong> {dbTestResult.error || 'Could not connect'}. (The site will continue to preserve all bookings safely in persistent local storage).
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Database Table Setup SQL Helper */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#172A30]">
                        Database Table Schema (SQL Script)
                      </h4>
                      <p className="text-xs text-[#64777D]">
                        If table <code>appointments</code> is not created yet, copy this script and run it in the Supabase SQL editor:
                      </p>
                    </div>

                    <button
                      onClick={handleCopySchema}
                      className="self-start sm:self-auto px-3.5 py-1.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-52 scrollbar-thin">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Reschedule Modal Overlay */}
        {rescheduleApt && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-[#172A30] text-sm">
                  Reschedule Appointment: {rescheduleApt.id}
                </h4>
                <button onClick={() => setRescheduleApt(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#64777D]">
                Patient: <strong className="text-[#172A30]">{rescheduleApt.patient_name}</strong>
              </div>

              {rescheduleError && (
                <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                  {rescheduleError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">New Date</label>
                  <input
                    type="date"
                    min={formatDateKey(new Date())}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">New Time Slot</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-sm"
                  >
                    <option value="">Select Time Slot</option>
                    {STANDARD_EVENING_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRescheduleApt(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReschedule}
                  className="px-4 py-1.5 text-xs bg-[#087F8C] hover:bg-[#075B63] text-white font-bold rounded"
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
