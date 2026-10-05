import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Layers,
  Activity,
  Smile,
  Zap,
  ArrowRight,
  Calendar,
  Info
} from 'lucide-react';
import { CLINIC_SERVICES, DentalService } from '../../data/clinicData';

interface ServicesSectionProps {
  onOpenBooking: (serviceName?: string) => void;
  onSelectServiceDetail: (service: DentalService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBooking,
  onSelectServiceDetail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'preventive', label: 'Preventive & Routine' },
    { id: 'restorative', label: 'Restorative & Endodontics' },
    { id: 'cosmetic', label: 'Cosmetic & Whitening' },
    { id: 'orthodontics', label: 'Orthodontics' },
    { id: 'surgical', label: 'Surgical & Extraction' }
  ];

  const filteredServices = CLINIC_SERVICES.filter((svc) => {
    if (selectedCategory === 'all') return true;
    return svc.category === selectedCategory;
  });

  return (
    <section id="services" className="py-16 sm:py-20 bg-[#F7FBFC] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
              Comprehensive Oral Healthcare
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans">
              Dental Services & Treatments
            </h2>
            <p className="mt-3 text-base text-[#64777D] leading-relaxed">
              From conservative tooth preservation and root canal therapy to routine hygiene and orthodontic care, explore our clinical services.
            </p>
          </div>

          <button
            onClick={() => onOpenBooking()}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#087F8C] hover:bg-[#075B63] rounded-lg shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#63C7C9]" />
            <span>Book Any Treatment</span>
          </button>
        </div>

        {/* Category Filter Tabs (Zero-pill, clean segmented control buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#087F8C] border-[#087F8C] shadow-xs'
                  : 'bg-white/80 text-[#64777D] border-slate-200 hover:border-slate-300 hover:text-[#172A30]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#087F8C]/50 hover:shadow-xs transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F7FBFC] border border-slate-200 flex items-center justify-center text-[#087F8C] group-hover:bg-[#087F8C] group-hover:text-white transition-colors">
                    {index % 4 === 0 && <Shield className="w-5 h-5" />}
                    {index % 4 === 1 && <Activity className="w-5 h-5" />}
                    {index % 4 === 2 && <Smile className="w-5 h-5" />}
                    {index % 4 === 3 && <Zap className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-semibold text-[#64777D] uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#172A30] mb-2 group-hover:text-[#087F8C] transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#64777D] leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>
              </div>

              {/* Action Links */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectServiceDetail(service)}
                  className="text-xs font-semibold text-[#087F8C] hover:text-[#075B63] inline-flex items-center gap-1 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Learn More</span>
                </button>

                <button
                  onClick={() => onOpenBooking(service.name)}
                  className="text-xs font-bold text-[#172A30] hover:text-[#087F8C] inline-flex items-center gap-1 group/btn"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Medically Responsible Footer Note */}
        <div className="mt-10 p-4 bg-white rounded-xl border border-slate-200 text-xs text-[#64777D] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            * Treatment suitability and recommendations are determined after clinical examination by the dental professional.
          </p>
          <button
            onClick={() => onOpenBooking()}
            className="text-xs font-bold text-[#087F8C] hover:underline whitespace-nowrap"
          >
            Schedule a Diagnostic Examination →
          </button>
        </div>

      </div>
    </section>
  );
};
