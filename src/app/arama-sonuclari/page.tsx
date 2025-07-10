// app/arama-sonuclari/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity'; // <-- urlFor fonksiyonunu import ettik

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: { _type: 'image'; asset: { _ref: string } }[];
  categoryName: string; // Kategori adı, Sanity'den çekilen category->title'a karşılık gelir
  description?: string;
}

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setResults([]);
        setLoading(false);
        setError('Arama terimi belirtilmedi.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (response.ok) {
          setResults(data);
        } else {
          setError(data.message || 'Arama sonuçları alınırken bir hata oluştu.');
          setResults([]);
        }
      } catch (err) {
        console.error('Arama sonuçları fetch hatası:', err);
        setError('Arama yapılırken bir ağ hatası oluştu.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh]"> {/* min-h ekledim */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
        Arama Sonuçları: &quot;{searchTerm}&quot;
      </h1>

      {loading && <p className="text-center text-lg text-gray-600">Aranıyor...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && searchTerm && (
        <p className="text-center text-lg text-gray-600">
          &quot;{searchTerm}&quot;için hiçbir sonuç bulunamadı. Lütfen farklı bir terim deneyin.
        </p>
      )}
      {!loading && !error && !searchTerm && (
         <p className="text-center text-lg text-gray-600">
           Arama yapmak için lütfen yukarıdaki kutuya bir terim girin.
         </p>
      )}


      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map((product) => (
            <Link key={product._id} href={`/urunler/${product.slug.current}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                {product.images && product.images.length > 0 && product.images[0].asset && (
                  <div className="relative w-full h-48">
                    <Image
                      src={urlFor(product.images[0]).width(400).height(300).url()} // urlFor kullanıldı
                      alt={product.name} // Alt metni olarak ürün adını kullandık
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>
                  {product.categoryName && (
                    <p className="text-gray-600 text-sm mb-2">{product.categoryName}</p>
                  )}
                  <p className="text-orange-600 font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;