import React from 'react';
import { HeartHandshake, ShieldCheck, Smile, Award } from 'lucide-react';
import { WHY_CHOOSE_FACTS } from '../../data/clinicData';

const iconMap: Record<string, React.ReactNode> = {
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-[#087F8C]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#087F8C]" />,
  Smile: <Smile className="w-6 h-6 text-[#087F8C]" />,
  Award: <Award className="w-6 h-6 text-[#087F8C]" />
};

export const WhyChoose: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087F8C] block mb-2">
            Clinical Values & Practice Standards
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172A30] tracking-tight font-sans text-balance">
            Why Choose Swathi Dental Clinic
          </h2>
          <p className="mt-3 text-base text-[#64777D] leading-relaxed">
            Our practice focuses on delivering responsible, personalized oral healthcare in a quiet, hygienic setting with clear communication at every step.
          </p>
        </div>

        {/* 4 Factual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_FACTS.map((fact, index) => (
            <div
              key={fact.title}
              className="bg-[#F7FBFC] p-6 rounded-xl border border-slate-200 hover:border-[#087F8C]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-xs">
                  {iconMap[fact.icon]}
                </div>
                <div className="text-xs font-semibold text-[#64777D] mb-1">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-[#172A30] mb-2.5">
                  {fact.title}
                </h3>
                <p className="text-sm text-[#64777D] leading-relaxed">
                  {fact.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-medium text-[#075B63]">
                <span>Evidence-based clinical care</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
