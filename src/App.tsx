import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
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
import { AdminLogin } from './components/AdminLogin';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRoute, isAdminLoggedIn, authLoading, isAdminModalOpen, setIsAdminModalOpen } = useStore();

  const normalizedRoute = currentRoute.replace(/\/+$/, '') || '/';
  const isAdminRoute = normalizedRoute === '/admin' || normalizedRoute.startsWith('/admin/');

  // 1. Loading Screen during Firebase Auth resolution on direct admin routes
  if (authLoading && isAdminRoute) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-amber-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-semibold tracking-wider uppercase text-stone-400">
          Connecting to Firebase Authentication...
        </p>
      </div>
    );
  }

  // 2. Admin Login Route (/admin/login)
  if (normalizedRoute === '/admin/login') {
    if (isAdminLoggedIn) {
      return (
        <ErrorBoundary fallbackTitle="Admin Dashboard Recovery">
          <Toast />
          <AdminDashboard />
        </ErrorBoundary>
      );
    }
    return (
      <ErrorBoundary fallbackTitle="Admin Login Recovery">
        <Toast />
        <AdminLogin />
      </ErrorBoundary>
    );
  }

  // 3. Admin Dashboard Route (/admin/dashboard, /admin, or any /admin/*)
  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return (
        <ErrorBoundary fallbackTitle="Admin Login Recovery">
          <Toast />
          <AdminLogin />
        </ErrorBoundary>
      );
    }
    return (
      <ErrorBoundary fallbackTitle="Admin Dashboard Recovery">
        <Toast />
        <AdminDashboard />
      </ErrorBoundary>
    );
  }

  // 4. Default Public Storefront (/)
  return (
    <ErrorBoundary fallbackTitle="Storefront Recovery">
      <div className="min-h-screen bg-black text-stone-100 font-sans selection:bg-amber-500 selection:text-black">
        {/* Global Toast Notification */}
        <Toast />

        {/* Fixed Header Navbar */}
        <Navbar />

        {/* Page Main Content */}
        <main>
          {/* 1. Hero Banner */}
          <div id="home">
            <Hero />
          </div>

          {/* 2. Signature Chai Showcase */}
          <div id="signature-chai">
            <SignatureChai />
          </div>

          {/* 3. Special Combos */}
          <div id="combos">
            <SpecialCombos />
          </div>

          {/* 4. Grand Menu with Category Filters */}
          <div id="menu">
            <MenuSection />
          </div>

          {/* 5. Customer Bestsellers */}
          <Bestsellers />

          {/* 6. Why Choose Us (5-Star Standard) */}
          <WhyChooseUs />

          {/* 7. Promotions & Offers */}
          <OffersSection />

          {/* 8. Table / Seat Booking System */}
          <div id="booking">
            <TableBookingSection />
          </div>

          {/* 9. Emotional Brand Story & Craft */}
          <div id="about">
            <AboutSection />
          </div>

          {/* 10. Photo Gallery with Lightbox */}
          <div id="gallery">
            <GallerySection />
          </div>

          {/* 11. Customer Reviews & Review Submission */}
          <div id="reviews">
            <ReviewsSection />
          </div>

          {/* 12. Google Maps Location & Store Timings */}
          <LocationSection />

          {/* 13. Direct Enquiry Form */}
          <div id="contact">
            <ContactSection />
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Slide-Over Cart Drawer & Checkout */}
        <CartDrawer />

        {/* Optional Admin Modal Popup if opened via modal */}
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
            {isAdminLoggedIn ? (
              <AdminDashboard isModalMode onCloseModal={() => setIsAdminModalOpen(false)} />
            ) : (
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white"
                >
                  ✕ Close
                </button>
                <AdminLogin />
              </div>
            )}
          </div>
        )}

        {/* Sticky Mobile Bottom Navigation Bar & WhatsApp Floating Button */}
        <MobileBottomNav />
      </div>
    </ErrorBoundary>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackTitle="Application Recovery">
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
