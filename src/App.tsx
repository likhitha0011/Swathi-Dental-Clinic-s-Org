import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { WhyChoose } from './components/home/WhyChoose';
import { ServicesSection } from './components/home/ServicesSection';
import { DoctorSection } from './components/home/DoctorSection';
import { PatientExperienceSection } from './components/home/PatientExperienceSection';
import { LocationSection } from './components/home/LocationSection';
import { FaqSection } from './components/home/FaqSection';
import { AppointmentCtaBanner } from './components/home/AppointmentCtaBanner';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { BookingFlow } from './components/booking/BookingFlow';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { LegalModal } from './components/common/LegalModals';
import { DentalService } from './data/clinicData';

export default function App() {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<DentalService | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  // Active section for header indicator
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleOpenBooking = (serviceName?: string) => {
    setBookingPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setBookingPreselectedService(undefined);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFC] text-[#172A30] font-sans">
      
      {/* Header following Top Bar Contract */}
      <Header
        onOpenBooking={handleOpenBooking}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => handleNavigate('services')}
        />

        {/* 2. Why Choose Swathi Dental Clinic (Factual Service Values) */}
        <WhyChoose />

        {/* 3. Dental Services Directory & Preview */}
        <ServicesSection
          onOpenBooking={handleOpenBooking}
          onSelectServiceDetail={(svc) => setSelectedServiceDetail(svc)}
        />

        {/* 4. Doctor / Clinical Leadership (Dr. Jyothi Nagesh) */}
        <DoctorSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 5. Patient Experience & Reassurance */}
        <PatientExperienceSection
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 6. FAQ Section */}
        <FaqSection
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 7. Location & Verified Google Map */}
        <LocationSection
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 8. Prominent Appointment CTA Banner */}
        <AppointmentCtaBanner
          onOpenBooking={() => handleOpenBooking()}
        />

      </main>

      {/* Footer with Legal & Contact Information */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenLegal={(type) => setLegalModalType(type)}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Persistent Sticky Bottom Action Bar (<15% viewport height) */}
      <MobileStickyBar
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Interactive Appointment Booking Flow Modal */}
      <BookingFlow
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedService={bookingPreselectedService}
      />

      {/* Service Details Drawer / Modal */}
      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onBookService={(name) => handleOpenBooking(name)}
      />

      {/* Secure Staff Portal / Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Privacy, Terms, and Medical Disclaimer Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
