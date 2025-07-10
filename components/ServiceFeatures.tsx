// src/components/ServiceFeatures.tsx
"use client";

import ServiceCard from './ServiceCard'; // ServiceCard bileşenini içe aktarıyoruz
// Gerekli ikonları react-icons kütüphanesinden içe aktarıyoruz
import { 
  FiGlobe,       // Worldwide Shipping
  FiCreditCard,  // Secured Payment (veya FiLock)
  FiRefreshCw,   // 30-Days Free Returns (veya FiTruck, FiBox)
  FiGift         // Surprise Gift
} from 'react-icons/fi';

const serviceItems = [
  {
    id: 1,
    Icon: FiGlobe,
    title: 'Tüm Dünyaya Gönderim',
    description: 'World Wide Free Shipping',
  },
  {
    id: 2,
    Icon: FiCreditCard, // Ekran görüntüsündeki cüzdan ikonuna yakın FiCreditCard'ı kullandım
    title: 'Güvenli Ödeme',
    description: 'Safe & Secured Payments',
  },
  {
    id: 3,
    Icon: FiRefreshCw, // Geri dönüş ikonuna yakın FiRefreshCw kullandım
    title: 'Geri Dönüştürülebilir Ürünler',
    description: 'Within 30 Days for an Exchange',
  },
  {
    id: 4,
    Icon: FiGift,
    title: 'Özel İndirimler',
    description: 'Free gift cards & vouchers',
  },
];

export default function ServiceFeatures() {
  return (
    <section className="bg-white py-8 md:py-2">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceItems.map((item) => (
            <ServiceCard
              key={item.id}
              Icon={item.Icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}