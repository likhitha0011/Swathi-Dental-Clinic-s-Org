import React from 'react';
import { Phone, Clock, MapPin, Navigation, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { CLINIC_INFO, CLINIC_SERVICES, DOCTOR_PROFILE } from '../../data/clinicData';

interface FooterProps {
  onOpenBooking: (serviceName?: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenLegal,
  onNavigate,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#172A30] text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Clinic Profile */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#087F8C] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 11.5c1.5 2.5 4.5 4 8 2.5" stroke="#63C7C9" strokeWidth="2.5" />
                  <path d="M8 8.5h.01M16 8.5h.01" stroke="currentColor" strokeWidth="3" />
                </svg>
              </div>
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  {CLINIC_INFO.name}
                </span>
                <span className="block text-xs text-[#63C7C9]">
                  {CLINIC_INFO.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Providing patient-focused, conservative dental care and multi-speciality oral health solutions under the clinical guidance of {DOCTOR_PROFILE.name} ({DOCTOR_PROFILE.qualifications}).
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="text-white hover:text-[#63C7C9] transition-colors flex items-center gap-2 font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-[#087F8C]" />
                <span>{CLINIC_INFO.phone}</span>
              </a>
              <div className="text-slate-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#087F8C]" />
                <span>Mon–Sat: 5:00 PM – 9:00 PM (Closed Sundays)</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Dental Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctor')}
                  className="hover:text-white transition-colors"
                >
                  Doctor Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-care')}
                  className="hover:text-white transition-colors"
                >
                  Patient Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('location')}
                  className="hover:text-white transition-colors"
                >
                  Clinic Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Major Dental Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Treatments
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CLINIC_SERVICES.slice(0, 6).map((svc) => (
                <li key={svc.id}>
                  <button
                    onClick={() => onOpenBooking(svc.name)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {svc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Address & Direct Actions */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinic Location
            </h4>
            <address className="not-italic text-xs text-slate-400 leading-relaxed">
              {CLINIC_INFO.addressLine1},<br />
              {CLINIC_INFO.addressLine2},<br />
              {CLINIC_INFO.area}, {CLINIC_INFO.city},<br />
              Karnataka 560040
            </address>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#63C7C9]" />
                <span>Get Directions to Clinic</span>
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#087F8C] hover:bg-[#075B63] text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#63C7C9]" />
                <span>Book an Appointment</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {CLINIC_INFO.name}. All rights reserved. Attiguppe, Bengaluru.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-white transition-colors"
            >
              Medical Disclaimer
            </button>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Staff Portal
            </button>
          </div>
        </div>

        {/* Small Legal Disclaimer Banner */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] text-slate-400 text-center leading-relaxed">
          Medical Disclaimer: Dental information provided on this website is for educational purposes and should not be considered personal medical advice. Clinical decisions and treatment options are determined during a direct diagnostic examination by the dental professional.
        </div>

      </div>
    </footer>
  );
};
