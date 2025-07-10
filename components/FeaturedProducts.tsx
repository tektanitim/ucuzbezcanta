// components/FeaturedProducts.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
// SanityImageSource, urlFor fonksiyonu için `@sanity/image-url/lib/types/types` paketinden geliyor.
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Merkezi Product tipi import edildi
import { Product } from '@/types';

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
                {/* Product.images bir array olduğu için ilk görseli kullanıyoruz */}
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={urlFor(product.images[0] as SanityImageSource).url()} // urlFor'a doğru tip verildi
                    alt={product.images[0].alt || product.name || 'Ürün Resmi'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  // Placeholder görseli (görsel yoksa)
                  <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 2 2 4-4 4 4v2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                {/* Category tipindeki isim alanı 'name' değil 'title' olarak güncellendi */}
                {product.category && (
                  <p className="text-sm text-gray-500 mb-2">{product.category.title}</p>
                )}
                <p className="text-2xl font-bold text-red-600">{product.price.toFixed(2)} TL</p>
                <p className='text-gray-500 text-sm'>den başlayan fiyatlarla</p> {/* Daha okunur hale getirildi */}
                <button type="button" className="mt-4 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
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