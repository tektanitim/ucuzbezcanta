// components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  PhoneIcon,
} from '@heroicons/react/20/solid';

import { fetchSanityData } from '@/lib/sanity';

interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  order: number;
}

const socialLinks = [
  { name: 'Twitter', icon: '/icons/twitter.svg', link: 'https://twitter.com' },
  { name: 'Instagram', icon: '/icons/instagram.svg', link: 'https://instagram.com' },
  { name: 'Facebook', icon: '/icons/facebook.svg', link: 'https://facebook.com' },
];

const menuLinks = [
  { name: 'Anasayfa', href: '/' },
  { name: 'Hakkımızda', href: '/hakkimizda' },
  { name: 'Kampanyalar', href: '/kampanyalar' },
  { name: 'Kategoriler', href: '/', dropdown: true },
  { name: 'Blog', href: '/blog' },
  { name: 'İletişim', href: '/iletisim' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function getCategories() {
      try {
        const data: Category[] = await fetchSanityData(`
          *[_type == "category"] | order(title asc) {
            _id,
            title,
            slug
          }
        `);
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler çekilirken hata oluştu:", error);
      }
    }
    getCategories();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama-sonuclari?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md">
      {/* Top Header Bölümü */}
      <div className="bg-gray-100 text-gray-700 py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                <Image src={social.icon} alt={social.name} width={20} height={20} className="inline-block" />
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
          <div className="flex-grow text-center">
            <p className="font-semibold text-red-600">
              Yeni Sezon&apos;da Tüm Ürünler %15 İndirimli! Hızlı Kargo!
            </p>
          </div>
          <div>
            <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-green-600">
              <PhoneIcon className="h-5 w-5 text-green-500" />
              <span>Whatsapp Destek</span>
            </a>
          </div>
        </div>
      </div>

      {/* Ana Header Bölümü */}
      {/* md:flex-row ile desktop'ta yatay, flex-col ile mobile'da dikey düzen */}
      <nav className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center relative">
        {/* Sol Bölüm: Logo ve Mobil Hamburger Butonu */}
        {/* md:w-auto flex-grow-0: Desktop'ta kendi içeriği kadar yer kaplar */}
        {/* w-full justify-between: Mobile'da tüm genişliği kaplar ve logo ile butonu iki yana yaslar */}
        <div className="flex justify-between items-center w-full md:w-auto md:flex-grow-0">
          <div className="flex-shrink-0">
            <Link href="/">
              <div style={{ position: 'relative', width: '150px', height: '50px' }}>
                <Image src="/images/logo.png" alt="Şirket Logosu" layout="fill" objectFit="contain" />
              </div>
            </Link>
          </div>

          {/* Mobil Hamburger Butonu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
              <span className="sr-only">Menü</span>
            </button>
          </div>
        </div>

        {/* Orta Bölüm: Menüler (Desktop) */}
        {/* flex-grow: Desktop'ta kalan alanı doldurur. */}
        {/* hidden md:flex: Mobile'da gizli, Desktop'ta görünür. */}
        <div className="hidden md:flex md:flex-grow justify-center px-4"> {/* px-4 ile kenarlardan biraz boşluk */}
          <ul className="flex space-x-8">
            {menuLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link href={link.href} className="text-gray-700 hover:text-gray-900 font-medium">
                  {link.name}
                </Link>
                {link.dropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible z-10">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/kategoriler/${category.slug.current}`}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          {category.title}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-gray-500">Kategori yok</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ Bölüm: Arama Çubuğu */}
        {/* w-full order-last: Mobile'da her zaman en altta kalır */}
        {/* md:w-auto md:flex-grow-0: Desktop'ta kendi içeriği kadar yer kaplar */}
        <div className="w-full mt-4 md:mt-0 md:w-auto md:flex-grow-0 order-last md:order-none">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ürün adı, açıklama veya kategoriye göre ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
            >
              Ara
            </button>
          </form>
        </div>
      </nav>

      {/* Mobil Menü İçeriği (Hamburger Tıklanınca Açılan) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {menuLinks.map((link) => (
              <li key={link.name} className="w-full text-center">
                {!link.dropdown ? (
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 font-medium flex justify-center items-center"
                    >
                      {link.name}
                      <span className="ml-2">{isCategoriesOpen ? '▲' : '▼'}</span>
                    </button>
                    {isCategoriesOpen && (
                      <div className="flex flex-col items-center bg-gray-50 py-2">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/kategoriler/${category.slug.current}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                              {category.title}
                            </Link>
                          ))
                        ) : (
                          <span className="block px-4 py-2 text-gray-500">Kategori yok</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;