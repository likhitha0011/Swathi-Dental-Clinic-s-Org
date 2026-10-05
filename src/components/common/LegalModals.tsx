import React from 'react';
import { X, Shield, FileText, AlertCircle } from 'lucide-react';
import { CLINIC_INFO } from '../../data/clinicData';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#075B63] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' && <Shield className="w-5 h-5 text-[#63C7C9]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#63C7C9]" />}
            {type === 'disclaimer' && <AlertCircle className="w-5 h-5 text-[#63C7C9]" />}
            <h3 className="text-lg font-bold">
              {type === 'privacy' && 'Patient Privacy & Data Policy'}
              {type === 'terms' && 'Clinic Terms of Service'}
              {type === 'disclaimer' && 'Clinical & Medical Disclaimer'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-4 max-h-[60vh] overflow-y-auto text-sm text-[#172A30] leading-relaxed">
          {type === 'privacy' && (
            <>
              <p>
                At <strong>{CLINIC_INFO.name}</strong>, patient confidentiality and trust are central to our care standards.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">1. Data Collection</h4>
              <p className="text-[#64777D]">
                We only collect essential contact information (patient name, phone number, email) and preferred consultation timings solely to schedule and manage your clinical appointments.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">2. Confidentiality & Security</h4>
              <p className="text-[#64777D]">
                Your information is never sold, leased, or disclosed to third-party advertisers. All records are maintained confidentially for clinic coordination.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">3. Communications</h4>
              <p className="text-[#64777D]">
                Contact details are used exclusively for appointment confirmation, scheduling notifications, and direct clinic communications requested by the patient.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                These terms govern appointment requests and general website usage for <strong>{CLINIC_INFO.name}</strong>.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">1. Appointment Scheduling</h4>
              <p className="text-[#64777D]">
                Submitting an appointment request through the website records your preferred slot. Final confirmation is communicated by our clinic team via phone or messaging based on clinic schedule availability.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">2. Rescheduling & Cancellations</h4>
              <p className="text-[#64777D]">
                If you need to reschedule or cancel a visit, please inform the clinic at least 3 hours prior to the scheduled time so that the slot may be allocated to other patients needing care.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">3. Clinic Operating Hours</h4>
              <p className="text-[#64777D]">
                Consultations take place Monday through Saturday from 5:00 PM to 9:00 PM. Emergency situations outside these hours should seek local hospital emergency facilities.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs font-medium">
                Information published on this website is for general educational and informational purposes only.
              </div>
              <h4 className="font-bold text-[#075B63] pt-2">1. Not a Substitute for Clinical Examination</h4>
              <p className="text-[#64777D]">
                Content regarding treatments such as root canals, implants, orthodontics, or teeth whitening does not constitute personal medical diagnosis or clinical treatment prescription. Treatment suitability is strictly determined after thorough physical examination by the dental professional.
              </p>
              <h4 className="font-bold text-[#075B63] pt-2">2. Emergency Dental Care</h4>
              <p className="text-[#64777D]">
                In cases of severe facial trauma, uncontrolled bleeding, or acute breathing obstruction, please visit the nearest hospital casualty emergency department immediately.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
