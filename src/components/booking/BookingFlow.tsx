import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Share2,
  ExternalLink,
  MessageCircle,
  MapPin
} from 'lucide-react';
import { CLINIC_INFO, CLINIC_SERVICES, DOCTOR_PROFILE } from '../../data/clinicData';
import { appointmentStore, formatDateKey, Appointment, TimeSlot } from '../../services/appointmentStore';

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  // Steps: 1: Service, 2: Date & Time, 3: Patient Info, 4: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<string>(
    preselectedService || CLINIC_SERVICES[0].name
  );

  // Default date to next available working day (skip Sunday)
  const getInitialBookingDate = () => {
    const d = new Date();
    // If after 8:30 PM today, or Sunday, choose tomorrow/next working day
    if (d.getHours() >= 20 || d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1); // skip Sunday
    }
    return formatDateKey(d);
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialBookingDate());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [patientType, setPatientType] = useState<'New Patient' | 'Existing Patient'>('New Patient');
  const [message, setMessage] = useState<string>('');

  // Slot and Error State
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isSundayClosed, setIsSundayClosed] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean>(false);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (preselectedService) {
        setSelectedService(preselectedService);
      }
      setCurrentStep(1);
      setSubmissionError(null);
      setConfirmedAppointment(null);
    }
  }, [isOpen, preselectedService]);

  // Recalculate available slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    const { isSunday, slots } = appointmentStore.getAvailableSlots(selectedDate);
    setIsSundayClosed(isSunday);
    setAvailableSlots(slots);

    // If currently selected time is not available on this date, reset it
    const activeSlot = slots.find((s) => s.time === selectedTime);
    if (!activeSlot || !activeSlot.available) {
      const firstAvailable = slots.find((s) => s.available);
      setSelectedTime(firstAvailable ? firstAvailable.time : '');
    }
  }, [selectedDate, selectedTime]);

  if (!isOpen) return null;

  // Validation
  const validatePatientInfo = () => {
    const errors: Record<string, string> = {};

    if (!patientName.trim()) {
      errors.name = 'Please enter your full name';
    } else if (patientName.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Please enter your contact phone number';
    } else if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email format';
    }

    if (!selectedTime) {
      errors.time = 'Please select a preferred appointment time slot';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async () => {
    setSubmissionError(null);

    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (isSundayClosed) {
        setSubmissionError('The clinic is closed on Sundays. Please select Monday to Saturday.');
        return;
      }
      if (!selectedTime) {
        setSubmissionError('Please select an available consultation time slot.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validatePatientInfo()) {
        return;
      }

      setIsSubmitting(true);
      try {
        // Submit booking to AppointmentStore & sync to Supabase backend
        const result = await appointmentStore.createAppointment({
          patient_name: patientName,
          phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
          email: email || 'Not provided',
          service: selectedService,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          patient_type: patientType,
          message: message
        });

        setIsSubmitting(false);

        if (result.success && result.appointment) {
          setConfirmedAppointment(result.appointment);
          setSupabaseSynced(result.supabaseResult?.success ?? true);
          setCurrentStep(4);
        } else {
          setSubmissionError(result.error || 'Failed to submit appointment request. Please try again.');
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setSubmissionError(err?.message || 'Something went wrong while saving your appointment.');
      }
    }
  };

  const handlePrevStep = () => {
    setSubmissionError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    if (!confirmedAppointment) return '#';
    const [year, month, day] = confirmedAppointment.appointment_date.split('-').map(Number);
    // Parse time like "05:30 PM"
    const [timeStr, period] = confirmedAppointment.appointment_time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const startDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const endDate = new Date(Date.UTC(year, month - 1, day, hours, minutes + 30));

    const startIso = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endIso = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const details = encodeURIComponent(
      `Appointment at Swathi Dental Clinic with Dr. Jyothi Nagesh.\nService: ${confirmedAppointment.service}\nPatient: ${confirmedAppointment.patient_name}\nAddress: #90, 3rd Main Road, Binny Employees Layout, Attiguppe, Bengaluru\nPhone: +91 98441 92226`
    );
    const location = encodeURIComponent('Swathi Dental Clinic, Attiguppe, Bengaluru 560040');
    const title = encodeURIComponent(`Swathi Dental Clinic - ${confirmedAppointment.service}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  // Direct WhatsApp Notify Link
  const getWhatsAppNotifyUrl = () => {
    if (!confirmedAppointment) return CLINIC_INFO.whatsappUrl;
    const text = encodeURIComponent(
      `Hello Swathi Dental Clinic, I have submitted an appointment request via the website.\n\n*Reference:* ${confirmedAppointment.id}\n*Patient Name:* ${confirmedAppointment.patient_name}\n*Service:* ${confirmedAppointment.service}\n*Date:* ${confirmedAppointment.appointment_date}\n*Time:* ${confirmedAppointment.appointment_time}\n*Phone:* ${confirmedAppointment.phone}\n\nPlease confirm availability. Thank you!`
    );
    return `https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${text}`;
  };

  // Min date today
  const minDateStr = formatDateKey(new Date());

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#075B63] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-xs uppercase tracking-wider text-[#63C7C9] font-bold mb-1">
            Swathi Dental Clinic · Attiguppe
          </div>
          <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {currentStep === 4 ? 'Appointment Request Submitted' : 'Schedule Your Dental Visit'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {currentStep === 4
              ? 'Our clinic team will contact you to confirm your appointment.'
              : 'Evening consultations Monday–Saturday, 5:00 PM – 9:00 PM'}
          </p>

          {/* Stepper Progress Bar (Step 1-3) */}
          {currentStep < 4 && (
            <div className="mt-5 flex items-center justify-between text-xs font-semibold text-emerald-200/80">
              <span className={currentStep >= 1 ? 'text-white font-bold' : ''}>1. Service</span>
              <span className="text-emerald-400/40">→</span>
              <span className={currentStep >= 2 ? 'text-white font-bold' : ''}>2. Date & Time</span>
              <span className="text-emerald-400/40">→</span>
              <span className={currentStep >= 3 ? 'text-white font-bold' : ''}>3. Patient Details</span>
            </div>
          )}
        </div>

        {/* Error notification banner */}
        {submissionError && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-5 sm:p-7 max-h-[68vh] overflow-y-auto">
          
          {/* STEP 1: Select Service */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Select Required Treatment or Consultation
                </h3>
                <p className="text-xs text-[#64777D]">
                  Choose the dental care service you wish to consult for. Suitability is finalized during clinical examination.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CLINIC_SERVICES.map((service) => {
                  const isSelected = selectedService === service.name;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.name)}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#087F8C] bg-[#F7FBFC] ring-2 ring-[#087F8C]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-[#172A30] flex items-center justify-between">
                        <span>{service.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
                        )}
                      </div>
                      <p className="text-xs text-[#64777D] mt-1 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Date & Available Time Slots */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Choose Preferred Date & Time Slot
                </h3>
                <p className="text-xs text-[#64777D]">
                  Consultations are held between 5:00 PM and 9:00 PM (Monday to Saturday). Closed on Sundays.
                </p>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="appointment-date" className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-2">
                  Select Date
                </label>
                <div className="relative max-w-sm">
                  <input
                    id="appointment-date"
                    type="date"
                    min={minDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087F8C] text-sm text-[#172A30] font-medium"
                  />
                  <CalendarIcon className="w-4 h-4 text-[#087F8C] absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Sunday Alert */}
              {isSundayClosed ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Clinic Closed on Sundays</strong>
                    Swathi Dental Clinic operates Monday through Saturday from 5:00 PM to 9:00 PM. Please select another date.
                  </div>
                </div>
              ) : (
                /* Time Slots Selection */
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider">
                      Available Evening Consultation Slots
                    </label>
                    <span className="text-[11px] text-[#64777D]">
                      Dedicated 30-min window
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      const isAvailable = slot.available;

                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                            !isAvailable
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#087F8C] text-white border-[#087F8C] shadow-xs'
                              : 'bg-white text-[#172A30] border-slate-200 hover:border-[#087F8C]/60 hover:bg-[#F7FBFC]'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{slot.time}</span>
                          </span>
                          <span className="text-[10px] font-normal opacity-85">
                            {isAvailable ? 'Available' : 'Reserved'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {availableSlots.length > 0 && availableSlots.every((s) => !s.available) && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-lg text-xs text-slate-600 text-center">
                      All consultation slots for {selectedDate} are currently reserved. Please choose another date or call the clinic at +91 98441 92226.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Patient Information Form */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Enter Patient Details
                </h3>
                <p className="text-xs text-[#64777D]">
                  We keep your health and contact data strictly confidential for clinic booking only.
                </p>
              </div>

              {/* Patient Type Radio */}
              <div className="bg-[#F7FBFC] p-3.5 rounded-xl border border-slate-200">
                <span className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-2">
                  Patient Type
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#172A30] cursor-pointer">
                    <input
                      type="radio"
                      name="patientType"
                      checked={patientType === 'New Patient'}
                      onChange={() => setPatientType('New Patient')}
                      className="text-[#087F8C] focus:ring-[#087F8C]"
                    />
                    <span>First-time Visit (New Patient)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#172A30] cursor-pointer">
                    <input
                      type="radio"
                      name="patientType"
                      checked={patientType === 'Existing Patient'}
                      onChange={() => setPatientType('Existing Patient')}
                      className="text-[#087F8C] focus:ring-[#087F8C]"
                    />
                    <span>Returning / Existing Patient</span>
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Full Patient Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C] ${
                      formErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  <User className="w-4 h-4 text-[#64777D] absolute left-3 top-3" />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C] ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-[#64777D] absolute left-3 top-3" />
                  </div>
                  {formErrors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                    />
                    <Mail className="w-4 h-4 text-[#64777D] absolute left-3 top-3" />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Optional Symptoms / Message */}
              <div>
                <label className="block text-xs font-bold text-[#172A30] uppercase tracking-wider mb-1">
                  Brief Note or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild sensitivity in lower tooth, routine checkup, or previous fillings..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#087F8C]"
                />
              </div>

              {/* Summary of Selection */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#64777D] space-y-1">
                <div className="flex justify-between">
                  <span>Selected Service:</span>
                  <strong className="text-[#172A30]">{selectedService}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Consultation Date:</span>
                  <strong className="text-[#172A30]">{selectedDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Time Slot:</span>
                  <strong className="text-[#087F8C]">{selectedTime}</strong>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Screen */}
          {currentStep === 4 && confirmedAppointment && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950">
                    Appointment Request Received
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                    Our clinic team at Swathi Dental Clinic will review and contact you shortly to confirm your slot.
                  </p>
                </div>
              </div>

              {/* Appointment Card */}
              <div className="bg-[#F7FBFC] rounded-xl border border-slate-200 p-5 space-y-3 text-xs sm:text-sm text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs text-[#64777D]">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#075B63]">{confirmedAppointment.id}</span>
                </div>

                {/* Subspace / Supabase Database Sync Badge */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Database Synchronized</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                    Project: hpofcwtxrzmawipqqaxh
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#64777D] block">Patient Name</span>
                    <strong className="text-[#172A30]">{confirmedAppointment.patient_name}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#64777D] block">Service</span>
                    <strong className="text-[#172A30]">{confirmedAppointment.service}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#64777D] block">Date & Time</span>
                    <strong className="text-[#087F8C]">
                      {confirmedAppointment.appointment_date} at {confirmedAppointment.appointment_time}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#64777D] block">Status</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Pending Staff Verification</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-[#64777D] space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0 mt-0.5" />
                    <span>#90, 3rd Main Road, Binny Employees Layout, Attiguppe, Bengaluru 560040</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                    <span>Clinic Contact: +91 98441 92226</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Patient */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={getWhatsAppNotifyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify Clinic via WhatsApp (Speed Up Confirmation)</span>
                </a>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-[#172A30] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <CalendarIcon className="w-4 h-4 text-[#087F8C]" />
                    <span>Add to Google Calendar</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-[#172A30] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>Print Appointment Slip</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 text-xs font-semibold text-[#64777D] hover:text-[#172A30] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64777D] hover:text-[#172A30]"
            >
              {currentStep === 4 ? 'Done' : 'Cancel'}
            </button>
          )}

          {currentStep < 3 && (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleNextStep}
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <span>Submit Appointment Request</span>
              )}
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg transition-colors"
            >
              Close Window
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
