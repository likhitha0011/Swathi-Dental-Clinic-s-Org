import React from 'react';
import { Calendar, Clock, Award, ShieldCheck, Stethoscope } from 'lucide-react';
import { DOCTOR_PROFILE, CLINIC_INFO } from '../../data/clinicData';

interface DoctorSectionProps {
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const DoctorSection: React.FC<DoctorSectionProps> = ({ onOpenBooking, onOpenAdmin }) => {
  return (
    <section id="doctor" className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Doctor Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
                Clinical Leadership & Care
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans">
                {DOCTOR_PROFILE.name}
              </h2>
              <div className="mt-2 text-base font-semibold text-[#075B63]">
                {DOCTOR_PROFILE.qualifications}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7FBFC] border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#64777D]">
                Speciality & Focus Area
              </div>
              <p className="text-sm text-[#172A30] font-medium">
                {DOCTOR_PROFILE.department}
              </p>
              <p className="text-xs sm:text-sm text-[#64777D] leading-relaxed pt-1">
                {DOCTOR_PROFILE.approach}
              </p>
            </div>

            {/* Verified Clinical Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                <Clock className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172A30]">Consultation Timings</div>
                  <div className="text-xs text-[#64777D] mt-0.5">{CLINIC_INFO.operatingHours.days}</div>
                  <div className="text-xs font-semibold text-[#075B63]">{CLINIC_INFO.operatingHours.timings}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
                <ShieldCheck className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#172A30]">Practice Philosophy</div>
                  <div className="text-xs text-[#64777D] mt-0.5">Tooth-preserving endodontics and dedicated patient time</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-5 py-3 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#63C7C9]" />
                <span>Book Consultation with Dr. Jyothi Nagesh</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-xs text-[#64777D] hover:text-[#172A30] underline py-2 px-1"
                  title="Update profile details via Staff Portal"
                >
                  Edit Profile in Staff Portal
                </button>
              )}
            </div>

          </div>

          {/* Visual Doctor Profile Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F7FBFC] rounded-2xl border border-slate-200 p-8 text-center sm:text-left relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[#087F8C] mb-6 mx-auto sm:mx-0">
                <Stethoscope className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-bold text-[#172A30]">
                {DOCTOR_PROFILE.name}
              </h3>
              <p className="text-xs font-semibold text-[#087F8C] mt-1">
                {DOCTOR_PROFILE.qualifications}
              </p>

              <div className="mt-5 space-y-3 text-xs text-[#64777D] border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#172A30]">Clinical Practice:</span>
                  <span>Swathi Dental Clinic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#172A30]">Location:</span>
                  <span>Attiguppe, Bengaluru</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#172A30]">Schedule:</span>
                  <span>By Prior Appointment</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 text-xs leading-relaxed">
                Focused on providing conservative treatment options with clear discussions on diagnosis, process, and aftercare.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
