'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Calendar } from 'lucide-react';
import type { Language } from '@/types/legacy';

const LANGUAGES = [
  { code: 'en' as const, flag: '🇺🇸', label: 'English' },
  { code: 'he' as const, flag: '🇮🇱', label: 'עברית' },
] as const;

interface HeaderProps {
  lang: Language;
  showLogin?: boolean;
  showSignup?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  hasAnnouncementBar?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  lang,
  showLogin = false,
  showSignup = false,
  ctaLabel,
  ctaUrl,
  hasAnnouncementBar = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: lang === 'he' ? 'יתרונות' : 'Features', href: '#features' },
    { label: lang === 'he' ? 'איך זה עובד' : 'How It Works', href: '#how-it-works' },
    { label: lang === 'he' ? 'הצוות' : 'Team', href: '#team' },
    { label: lang === 'he' ? 'שאלות נפוצות' : 'FAQ', href: '#faq' },
    { label: lang === 'he' ? 'צור קשר' : 'Contact', href: `/${lang}/contact` },
  ];

  return (
    <header
      className={`fixed start-0 end-0 z-50 transition-all duration-300 ${
        hasAnnouncementBar ? 'top-[36px]' : 'top-0'
      } ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white/80 backdrop-blur-sm py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:from-violet-700 group-hover:to-teal-600 transition-all">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">RevBrain</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-neutral-600 hover:text-primary-600 font-medium transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-primary-600 transition-colors px-2 py-1.5 rounded hover:bg-neutral-100"
                aria-label="Switch Language"
                aria-expanded={langMenuOpen}
              >
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-sm font-medium">{currentLang.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {langMenuOpen && (
                <div className="absolute top-full end-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 min-w-[140px] z-50">
                  {LANGUAGES.map((language) => (
                    <Link
                      key={language.code}
                      href={`/${language.code}`}
                      className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        language.code === lang
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                      onClick={() => setLangMenuOpen(false)}
                    >
                      <span className="text-base leading-none">{language.flag}</span>
                      <span>{language.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {showLogin && (
              <Link
                href="https://app.revbrain.ai/login"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2"
              >
                {lang === 'he' ? 'התחברות' : 'Login'}
              </Link>
            )}
            {showSignup && (
              <Link
                href="https://app.revbrain.ai/signup"
                className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {lang === 'he' ? 'הרשמה' : 'Sign Up'}
              </Link>
            )}
            {ctaLabel && ctaUrl && !showSignup && (
              <Link
                href={ctaUrl}
                className="flex items-center gap-1.5 text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {ctaLabel}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {LANGUAGES.filter((l) => l.code !== lang).map((language) => (
              <Link
                key={language.code}
                href={`/${language.code}`}
                className="flex items-center gap-1 text-neutral-500 font-medium text-sm"
              >
                <span className="text-base leading-none">{language.flag}</span>
                <span>{language.label}</span>
              </Link>
            ))}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 p-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full start-0 end-0 bg-white border-b border-neutral-200 shadow-xl p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-neutral-600 hover:text-primary-600 font-medium py-3 px-2 rounded-lg hover:bg-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {ctaLabel && ctaUrl && (
            <Link
              href={ctaUrl}
              className="mt-2 flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="w-4 h-4" />
              {ctaLabel}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
