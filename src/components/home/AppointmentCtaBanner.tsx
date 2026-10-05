import React from 'react';
import { Calendar, Phone, Clock, ArrowRight } from 'lucide-react';
import { CLINIC_INFO } from '../../data/clinicData';

interface AppointmentCtaBannerProps {
  onOpenBooking: () => void;
}

export const AppointmentCtaBanner: React.FC<AppointmentCtaBannerProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-[#075B63] to-[#087F8C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#63C7C9] block">
            Start Your Dental Care
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-balance">
            Ready to Take Care of Your Smile?
          </h2>

          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Book your dental appointment with Swathi Dental Clinic. Consultations scheduled Monday through Saturday, 5:00 PM to 9:00 PM in Attiguppe.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#075B63] hover:bg-emerald-50 font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2.5 text-sm active:scale-[0.98]"
            >
              <Calendar className="w-5 h-5 text-[#087F8C]" />
              <span>Book an Appointment</span>
              <ArrowRight className="w-4 h-4 text-[#087F8C]" />
            </button>

            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="w-full sm:w-auto px-6 py-4 bg-[#075B63]/80 hover:bg-[#075B63] text-white font-semibold rounded-lg border border-emerald-400/40 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4 text-[#63C7C9]" />
              <span>Call Clinic (+91 98441 92226)</span>
            </a>
          </div>

          <div className="pt-4 text-xs text-emerald-200/90 flex flex-wrap items-center justify-center gap-4">
            <span>✓ No advance payment required</span>
            <span>✓ Same-day response during clinic hours</span>
            <span>✓ Convenient evening slots</span>
          </div>
        </div>

      </div>
    </section>
  );
};
