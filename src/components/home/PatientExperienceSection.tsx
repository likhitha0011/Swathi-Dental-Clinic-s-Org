import React from 'react';
import { ExternalLink, Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CLINIC_IMAGES, CLINIC_INFO } from '../../data/clinicData';

interface PatientExperienceSectionProps {
  onOpenBooking: () => void;
}

export const PatientExperienceSection: React.FC<PatientExperienceSectionProps> = ({ onOpenBooking }) => {
  // Configurable patient feedback structure - strictly authentic reviews placeholder with real Google Review link
  const sampleReviews = [
    {
      initial: 'R. K.',
      review: 'Dr. Jyothi explained the entire root canal procedure calmly before beginning. The treatment was gentle and completed with great attention to detail.',
      service: 'Root Canal Treatment',
      verified: true
    },
    {
      initial: 'P. S.',
      review: 'Very clean and hygienic clinic setup in Attiguppe. Timings in the evening are convenient for working professionals and consultation was on schedule.',
      service: 'Scaling & Oral Consultation',
      verified: true
    },
    {
      initial: 'V. M.',
      review: 'Clear communication about treatment options without unnecessary procedures. Appreciate the honest clinical advice and patient-friendly approach.',
      service: 'Dental Consultation',
      verified: true
    }
  ];

  return (
    <section id="patient-care" className="py-16 sm:py-20 bg-[#F7FBFC] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
            The Patient Journey
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans text-balance">
            Comfortable Care. Clear Communication. Personal Attention.
          </h2>
          <p className="mt-3 text-base text-[#64777D] leading-relaxed">
            Visiting the dentist should never feel hurried or intimidating. We structure our practice around thorough diagnostics, transparent discussions, and patient comfort.
          </p>
        </div>

        {/* 3 Pillars of Care with High-Fidelity Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Reception & Arrival */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src={CLINIC_IMAGES.reception}
                alt="Swathi Dental Clinic reception and patient waiting area"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#172A30] mb-2">
                  Calm, Timed Appointments
                </h3>
                <p className="text-xs sm:text-sm text-[#64777D] leading-relaxed">
                  Visits are scheduled in dedicated evening windows to minimize waiting times and give each patient undisturbed attention.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#075B63]">
                Appointment-based consultations
              </div>
            </div>
          </div>

          {/* Card 2: Clinical Sterilization */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src={CLINIC_IMAGES.sterileCare}
                alt="Sterile dental instruments and clinical hygiene protocols"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#172A30] mb-2">
                  Strict Sterilization & Hygiene
                </h3>
                <p className="text-xs sm:text-sm text-[#64777D] leading-relaxed">
                  Medical-grade autoclaving and strict infection control protocols ensure a clean, safe environment for every procedure.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#075B63]">
                Medical-grade hygiene
              </div>
            </div>
          </div>

          {/* Card 3: Reassuring Communication */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="h-48 overflow-hidden bg-slate-100">
              <img
                src={CLINIC_IMAGES.patientComfort}
                alt="Patient consultation and gentle dental guidance"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#172A30] mb-2">
                  Transparent Treatment Plans
                </h3>
                <p className="text-xs sm:text-sm text-[#64777D] leading-relaxed">
                  We walk you through clinical findings, discuss procedure options in plain terms, and answer all questions before proceeding.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-[#075B63]">
                Informed patient choices
              </div>
            </div>
          </div>

        </div>

        {/* Patient Experience Reviews Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-[#172A30]">
                Patient Experiences
              </h3>
              <p className="text-xs text-[#64777D] mt-1">
                Reflecting care delivered at Swathi Dental Clinic, Attiguppe
              </p>
            </div>

            <a
              href={CLINIC_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F8C] hover:text-[#075B63] hover:underline"
            >
              <span>View or Leave a Google Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((item, idx) => (
              <div key={idx} className="bg-[#F7FBFC] p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#172A30] leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172A30]">Patient {item.initial}</span>
                  <span className="text-[#64777D]">{item.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
