// components/FeaturedProducts.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity'; // Sanity'den gelen görsel URL'lerini oluşturmak için kullanılan fonksiyon

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: any[]; // Sanity'den gelen görsel yapısı
  category?: { name: string; slug: { current: string } };
}

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Öne Çıkan Ürünler</h2>
        <p className="text-center text-gray-600">Şu anda öne çıkan ürün bulunmamaktadır.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Öne Çıkan Ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link href={`/urunler/${product.slug.current}`}>
              <div className="relative w-full h-64 bg-gray-200">
                {product.images && product.images.length > 0 && (
                  <Image
                    src={urlFor(product.images[0]).url()} // urlFor kullanıldı
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                )}
                {!product.images || product.images.length === 0 && (
                  // Placeholder görsel
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 2 2 4-4 4 4v2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                )}
                <p className="text-2xl font-bold text-red-600">{product.price.toFixed(2)} TL</p>
                <p>den başlayan fiyatlar</p>
                <button className="mt-4 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                  İncele
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;