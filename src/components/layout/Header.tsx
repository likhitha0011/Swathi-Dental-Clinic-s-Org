import React, { useState } from 'react';
import { Phone, Calendar, Menu, X, Shield, Clock, MapPin } from 'lucide-react';
import { CLINIC_INFO } from '../../data/clinicData';

interface HeaderProps {
  onOpenBooking: (serviceName?: string) => void;
  onOpenAdmin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenAdmin,
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctor', label: 'Doctor' },
    { id: 'patient-care', label: 'Patient Care' },
    { id: 'location', label: 'Location' },
    { id: 'faq', label: 'FAQ' }
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Top Notification Strip with factual hours */}
      <div className="bg-[#075B63] text-white text-xs py-2 px-4 border-b border-[#087F8C]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-4 text-emerald-50">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#63C7C9]" />
              <span>Evening Clinic: Mon–Sat 5:00 PM – 9:00 PM (Closed Sundays)</span>
            </span>
            <span className="hidden md:inline text-emerald-200/50">·</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-100">
              <MapPin className="w-3.5 h-3.5 text-[#63C7C9]" />
              <span>Attiguppe, Bengaluru</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="text-white hover:text-[#63C7C9] transition-colors font-medium flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#63C7C9]" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            <span className="text-emerald-200/40">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-xs text-emerald-100 hover:text-white transition-colors flex items-center gap-1"
              title="Clinic Staff Portal"
            >
              <Shield className="w-3 h-3 text-emerald-300" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand Zone — 4-6 Nav Links — 1-2 Primary Actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark with clean subtle smile emblem */}
          <button
            onClick={() => handleLinkClick('home')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-[#087F8C] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.5 2.5 6L5 21l3-1.5c1.2.6 2.5 1 4 1 5.5 0 10-4.5 10-10S17.5 2 12 2z" className="opacity-20" />
                <path d="M7 11.5c1.5 2.5 4.5 4 8 2.5" stroke="#63C7C9" strokeWidth="2.5" />
                <path d="M8 8.5h.01M16 8.5h.01" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-[#172A30] font-sans">
                Swathi Dental Clinic
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-[#64777D] uppercase">
                Attiguppe · Bengaluru
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 Nav Links (Single line with hover states) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#172A30]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors py-1 relative ${
                  activeSection === link.id
                    ? 'text-[#087F8C] font-semibold'
                    : 'text-[#64777D] hover:text-[#087F8C]'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087F8C] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#075B63] bg-[#F7FBFC] border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#087F8C]" />
              <span>Call Clinic</span>
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#087F8C] hover:bg-[#075B63] rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-[#63C7C9]" />
              <span>Book an Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#087F8C] rounded-lg shadow-sm"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#172A30] hover:text-[#087F8C] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-28 z-30 bg-white border-b border-slate-200 shadow-xl p-5 space-y-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#F7FBFC] text-[#087F8C] font-semibold'
                    : 'text-[#172A30] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-[#087F8C] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#63C7C9]" />
              <span>Book an Appointment</span>
            </button>

            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="w-full py-2.5 bg-slate-100 text-[#172A30] rounded-lg font-medium text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#087F8C]" />
              <span>Call Clinic (+91 98441 92226)</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
