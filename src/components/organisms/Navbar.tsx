"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/atoms/Button';
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';

const Navbar = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 relative">
                <Image 
                  src="/logo.svg" 
                  alt="Caiz mi? Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-emerald-600">Caiz mi?</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/contact" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              İletişim
            </Link>
            
            {!loading && (
              user ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-2">
                    <Link href="/profile" passHref>
                      <Button size="sm" variant="outline" leftIcon={<FiUser size={16} />}>
                        Profil
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      leftIcon={<FiLogOut size={16} />} 
                      onClick={signOut}
                    >
                      Çıkış Yap
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="primary" 
                  leftIcon={<FiLogIn size={16} />} 
                  onClick={signIn}
                >
                  Gmail ile Giriş
                </Button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Menüyü Aç</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              İletişim
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!loading && (
              user ? (
                <div className="space-y-1">
                  <Link 
                    href="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <Button 
                    fullWidth
                    variant="primary" 
                    leftIcon={<FiLogIn size={16} />} 
                    onClick={() => {
                      signIn();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Gmail ile Giriş
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
