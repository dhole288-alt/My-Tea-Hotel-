import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Toast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignatureChai } from './components/SignatureChai';
import { SpecialCombos } from './components/SpecialCombos';
import { MenuSection } from './components/MenuSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Bestsellers } from './components/Bestsellers';
import { OffersSection } from './components/OffersSection';
import { TableBookingSection } from './components/TableBooking';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-black text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
        {/* Global Toast Notification */}
        <Toast />

        {/* Fixed Header Navbar */}
        <Navbar />

        {/* Page Main Content */}
        <main>
          {/* 1. Hero Banner */}
          <Hero />

          {/* 2. Signature Chai Showcase */}
          <SignatureChai />

          {/* 3. Special Combos */}
          <SpecialCombos />

          {/* 4. Grand Menu with Category Filters */}
          <MenuSection />

          {/* 5. Customer Bestsellers */}
          <Bestsellers />

          {/* 6. Why Choose Us (5-Star Standard) */}
          <WhyChooseUs />

          {/* 7. Promotions & Offers */}
          <OffersSection />

          {/* 8. Table / Seat Booking System */}
          <TableBookingSection />

          {/* 9. Emotional Brand Story & Craft */}
          <AboutSection />

          {/* 10. Photo Gallery with Lightbox */}
          <GallerySection />

          {/* 11. Customer Reviews & Review Submission */}
          <ReviewsSection />

          {/* 12. Google Maps Location & Store Timings */}
          <LocationSection />

          {/* 13. Direct Enquiry Form */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Slide-Over Cart Drawer & Checkout */}
        <CartDrawer />

        {/* Full-Featured Admin Portal Modal */}
        <AdminDashboard />

        {/* Sticky Mobile Bottom Navigation Bar & WhatsApp Floating Button */}
        <MobileBottomNav />
      </div>
    </StoreProvider>
  );
};

export default App;
