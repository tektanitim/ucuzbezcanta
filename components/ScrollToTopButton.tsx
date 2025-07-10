"use client";
// components/ScrollToTopButton.tsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Yukarı ok ikonu

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Sayfanın aşağı kaydırıldığını kontrol et
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // 300px aşağı kaydırıldığında görünür yap
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // En üste kaydır
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Yumuşak kaydırma
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Sayfanın en üstüne çık"
        >
          <FaArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;