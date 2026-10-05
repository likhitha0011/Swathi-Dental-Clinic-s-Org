import React from 'react';
import { X, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { DentalService } from '../../data/clinicData';

interface ServiceDetailModalProps {
  service: DentalService | null;
  onClose: () => void;
  onBookService: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#075B63] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-xs uppercase tracking-wider text-[#63C7C9] font-bold mb-1.5">
            Dental Care Service
          </div>
          <h2 id="service-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {service.name}
          </h2>
          <p className="mt-2 text-sm text-emerald-100/90 max-w-xl leading-relaxed">
            {service.shortDescription}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64777D] mb-2">
              Clinical Overview
            </h3>
            <p className="text-sm text-[#172A30] leading-relaxed">
              {service.fullDescription}
            </p>
          </div>

          {/* Who it may be suitable for */}
          <div className="bg-[#F7FBFC] p-4 sm:p-5 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#075B63] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
              <span>Who It May Be Suitable For</span>
            </h3>
            <p className="text-sm text-[#172A30] leading-relaxed">
              {service.suitableFor}
            </p>
          </div>

          {/* What the consultation involves */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64777D] mb-2">
              What the Clinical Consultation Involves
            </h3>
            <p className="text-sm text-[#172A30] leading-relaxed">
              {service.consultationInvolves}
            </p>
          </div>

          {/* Mandatory Responsible Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Clinical Note</strong>
              Treatment suitability and recommendations are determined after clinical examination by the dental professional. No procedure is initiated without a comprehensive diagnostic evaluation and patient consent.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#64777D] hover:text-[#172A30] transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onBookService(service.name);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#087F8C] hover:bg-[#075B63] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#63C7C9]" />
            <span>Book Consultation for {service.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
