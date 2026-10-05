import React from 'react';
import { Phone, Calendar, Navigation } from 'lucide-react';
import { CLINIC_INFO } from '../../data/clinicData';

interface MobileStickyBarProps {
  onOpenBooking: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenBooking }) => {
  return (
    <aside
      aria-label="Quick Actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 items-center">
        {/* Call button */}
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[#172A30] active:bg-slate-200 min-h-[46px] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#087F8C]" />
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Call</span>
        </a>

        {/* Primary Book CTA */}
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#087F8C] text-white active:bg-[#075B63] min-h-[46px] shadow-sm transition-colors"
        >
          <Calendar className="w-4 h-4 text-[#63C7C9]" />
          <span className="text-[11px] font-bold tracking-tight mt-0.5">Book Visit</span>
        </button>

        {/* Directions button */}
        <a
          href={CLINIC_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[#172A30] active:bg-slate-200 min-h-[46px] transition-colors"
        >
          <Navigation className="w-4 h-4 text-[#087F8C]" />
          <span className="text-[11px] font-semibold tracking-tight mt-0.5">Directions</span>
        </a>
      </div>
    </aside>
  );
};
