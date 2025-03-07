"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FiHome, FiMail, FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Scroll durumunu izle
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: '/', label: 'Ana Sayfa', icon: <FiHome className="mr-2" /> },
    { href: '/iletisim', label: 'İletişim', icon: <FiMail className="mr-2" /> },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur-sm' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-500 transition-colors">
              Caiz<span className="text-gray-800 dark:text-white">mi?</span>
            </span>
          </Link>

          {/* Masaüstü Menü */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Tema Değiştirme Butonu */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {/* Kullanıcı Menüsü */}
            {user ? (
              <div className="relative ml-2 flex items-center">
                <Link
                  href="/profil"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiUser className="mr-2" />
                  Profil
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                className="ml-2 flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                <FiLogIn className="mr-2" />
                Giriş Yap
              </Link>
            )}
          </nav>

          {/* Mobil Menü Butonu */}
          <div className="flex items-center md:hidden">
            {/* Tema Değiştirme Butonu (Mobil) */}
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menüyü aç/kapat"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-custom mx-auto px-4 py-2 space-y-1 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors ${
                pathname === link.href
                  ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Kullanıcı Menüsü (Mobil) */}
          {user ? (
            <>
              <Link
                href="/profil"
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiUser className="mr-2" />
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiLogOut className="mr-2" />
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="flex items-center px-4 py-3 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <FiLogIn className="mr-2" />
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
