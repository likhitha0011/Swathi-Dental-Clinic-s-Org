import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS, CLINIC_INFO } from '../../data/clinicData';

interface FaqSectionProps {
  onOpenBooking: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenBooking }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#64777D] leading-relaxed">
            Essential facts about visiting Swathi Dental Clinic, scheduling visits, and clinic protocols.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden bg-[#F7FBFC] transition-colors"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-[#172A30] hover:text-[#087F8C] transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg tracking-tight">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#087F8C]' : 'text-[#64777D]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-[#64777D] leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="mt-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#172A30]">
              Have a specific question before booking?
            </h4>
            <p className="text-xs text-[#64777D] mt-0.5">
              Contact our clinic team directly during evening clinic hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="px-4 py-2 bg-white text-[#172A30] border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#087F8C]" />
              <span>Call Clinic</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-4 py-2 bg-[#087F8C] text-white rounded-lg text-xs font-bold hover:bg-[#075B63] transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
