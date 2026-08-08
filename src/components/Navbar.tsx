import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, MessageCircle, Menu as MenuIcon, X, Crown, Shield, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, settings, setIsCartOpen, setIsAdminModalOpen, isAdminLoggedIn } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Chai', href: '#signature-chai' },
    { name: 'Menu', href: '#menu' },
    { name: 'Specials', href: '#combos' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.name}, I would like to inquire about your menu and special catering orders!`
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg md:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                  {settings.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  5-Star
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-amber-200/60 uppercase font-sans -mt-1">
                Chai Lounge & Café
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs uppercase tracking-widest text-stone-300 hover:text-amber-400 transition-colors font-medium relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 text-xs font-semibold tracking-wider transition-all shadow-lg hover:shadow-emerald-900/20"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WHATSAPP</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-500/30 transition-all hover:scale-105"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-black text-[11px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ORDER NOW CTA */}
            <button
              onClick={() => {
                const menuEl = document.querySelector('#menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 uppercase"
            >
              ORDER NOW
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className={`p-2 rounded-xl border transition-all text-xs font-medium flex items-center gap-1 ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-amber-400'
              }`}
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              {isAdminLoggedIn && <span className="text-[10px] uppercase tracking-wider font-bold">Admin</span>}
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-stone-900 text-amber-400 border border-amber-500/30"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-900 text-stone-300 border border-amber-500/20"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <MenuIcon className="w-6 h-6 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 px-4 rounded-2xl bg-stone-950/95 border border-amber-500/30 backdrop-blur-2xl space-y-3 shadow-2xl animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-amber-500/10 text-stone-200 hover:text-amber-400 text-xs font-medium tracking-wider uppercase border border-stone-800"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-amber-500/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const menuEl = document.querySelector('#menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-amber-500/20"
              >
                ORDER NOW
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>ORDER VIA WHATSAPP</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-stone-300 border border-stone-800 text-xs flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{isAdminLoggedIn ? 'OPEN ADMIN DASHBOARD' : 'ADMIN LOGIN'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
