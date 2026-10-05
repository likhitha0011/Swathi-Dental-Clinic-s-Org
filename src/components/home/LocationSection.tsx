import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Calendar } from 'lucide-react';
import { CLINIC_INFO } from '../../data/clinicData';

interface LocationSectionProps {
  onOpenBooking: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  // Google Maps embed URL centered on Attiguppe, Bengaluru
  const mapEmbedSrc =
    "https://maps.google.com/maps?q=Swathi%20Dental%20Clinic%2C%20%2390%2C%203rd%20Main%20Road%2C%20Binny%20Employees%20Layout%2C%20Attiguppe%2C%20Bengaluru%2C%20Karnataka%20560040&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="location" className="py-16 sm:py-20 bg-[#F7FBFC] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
            Visit Our Practice
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans">
            Clinic Location & Hours
          </h2>
          <p className="mt-3 text-base text-[#64777D] leading-relaxed">
            Conveniently situated in Binny Employees Layout, Attiguppe, easily accessible from Vijayanagar and surrounding West Bengaluru areas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Clinic Details Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="text-xl font-bold text-[#172A30]">
                {CLINIC_INFO.name}
              </h3>
              <p className="text-xs font-semibold text-[#087F8C] mt-0.5">
                {CLINIC_INFO.tagline}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
              <MapPin className="w-5 h-5 text-[#087F8C] shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-[#172A30] uppercase tracking-wider block mb-1">
                  Clinic Address
                </span>
                <p className="text-sm text-[#64777D] leading-relaxed">
                  {CLINIC_INFO.addressLine1},<br />
                  {CLINIC_INFO.addressLine2},<br />
                  {CLINIC_INFO.area}, {CLINIC_INFO.city},<br />
                  {CLINIC_INFO.state} {CLINIC_INFO.pincode}
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
              <Clock className="w-5 h-5 text-[#087F8C] shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-[#172A30] uppercase tracking-wider block mb-1">
                  Consultation Timings
                </span>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#172A30] font-medium">{CLINIC_INFO.operatingHours.days}:</span>
                    <span className="font-bold text-[#075B63]">{CLINIC_INFO.operatingHours.timings}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-xs text-rose-700">
                    <span className="font-medium">Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone & Direct Contact */}
            <div className="flex items-start gap-3.5 pt-2 border-t border-slate-100">
              <Phone className="w-5 h-5 text-[#087F8C] shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold text-[#172A30] uppercase tracking-wider block mb-1">
                  Direct Clinic Phone
                </span>
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="text-base font-bold text-[#087F8C] hover:underline"
                >
                  {CLINIC_INFO.phone}
                </a>
                <p className="text-xs text-[#64777D] mt-0.5">
                  Tap to call directly during operating hours
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#087F8C] hover:bg-[#075B63] text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#63C7C9]" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-[#172A30] rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#087F8C]" />
                <span>Call Clinic</span>
              </a>
            </div>

          </div>

          {/* Google Maps Embed */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-[420px] sm:h-[480px] flex flex-col">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172A30] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#087F8C]" />
                <span>Interactive Map · Attiguppe, Bengaluru 560040</span>
              </span>
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#087F8C] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full relative bg-slate-100">
              <iframe
                title="Swathi Dental Clinic Location Map"
                src={mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
