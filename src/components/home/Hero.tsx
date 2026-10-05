import React from 'react';
import { Calendar, Phone, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO, CLINIC_IMAGES, DOCTOR_PROFILE } from '../../data/clinicData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F7FBFC] pt-8 pb-16 sm:pt-14 sm:pb-20 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust badge with natural unboxed typography */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#075B63] bg-[#EBF7F8] px-3.5 py-1.5 rounded-md border border-[#63C7C9]/30">
              <span className="w-2 h-2 rounded-full bg-[#087F8C] animate-pulse" />
              <span>Evening Consultations: Mon–Sat 5:00 PM – 9:00 PM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#172A30] leading-[1.18] text-balance font-sans">
              Confident Smiles Start With Better Dental Care
            </h1>

            <p className="text-base sm:text-lg text-[#64777D] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Professional dental care focused on your comfort, oral health and long-term smile. Multi-speciality treatments led by{' '}
              <strong className="font-semibold text-[#172A30]">{DOCTOR_PROFILE.name}</strong> ({DOCTOR_PROFILE.qualifications}) in Attiguppe, Bengaluru.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#087F8C] hover:bg-[#075B63] text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <Calendar className="w-5 h-5 text-[#63C7C9]" />
                <span>Book an Appointment</span>
              </button>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-[#172A30] font-semibold border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2.5 shadow-sm"
              >
                <Phone className="w-5 h-5 text-[#087F8C]" />
                <span>Call the Clinic</span>
              </a>
            </div>

            {/* Key Clinic Signals */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/70 text-left">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                <span className="text-xs text-[#172A30] font-medium leading-snug">
                  Attentive 1-on-1 Doctor Evaluation
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                <span className="text-xs text-[#172A30] font-medium leading-snug">
                  Strict Hygiene & Sterilization
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                <span className="text-xs text-[#172A30] font-medium leading-snug">
                  Conservative Tooth Preservation
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image with Card Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <img
                src={CLINIC_IMAGES.hero}
                alt="Swathi Dental Clinic modern consultation operatory in Attiguppe Bengaluru"
                className="w-full h-[340px] sm:h-[400px] object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Info Floating Card */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#172A30]">
                      {CLINIC_INFO.name}
                    </h2>
                    <p className="text-xs text-[#64777D] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#087F8C] shrink-0" />
                      <span>Binny Employees Layout, Attiguppe</span>
                    </p>
                  </div>
                  <button
                    onClick={onExploreServices}
                    className="text-xs font-semibold text-[#087F8C] hover:text-[#075B63] hover:underline shrink-0"
                  >
                    View Services →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Small Information Row Below Hero */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm font-medium text-[#64777D]">
            <span className="flex items-center gap-2 text-[#172A30]">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Dental Care</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-2 text-[#172A30]">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Professional Consultation</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-2 text-[#172A30]">
              <span className="w-2 h-2 rounded-full bg-[#087F8C]" />
              <span>Appointment-Based Visits</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
