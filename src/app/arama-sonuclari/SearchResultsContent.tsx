// app/arama-sonuclari/SearchResultsContent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: { _type: 'image'; asset: { _ref: string } }[];
  categoryName: string;
  description?: string;
}

const SearchResultsContent = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm || '')}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const timer = setTimeout(() => {
    if (searchTerm?.trim()) fetchResults();
    else setResults([]);
  }, 300); // 300ms debounce

  return () => clearTimeout(timer);
}, [searchTerm]);

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
        Arama Sonuçları: &quot;{searchTerm}&quot;
      </h1>

      {loading && <p className="text-center text-lg text-gray-600">Aranıyor...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && searchTerm && (
        <p className="text-center text-lg text-gray-600">
          &quot;{searchTerm}&quot; için hiçbir sonuç bulunamadı. Lütfen farklı bir terim deneyin.
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
            <Link 
              key={product._id} 
              href={`/urunler/${product.slug.current}`}
              className="block" // Link'e direkt className ekledik
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                {product.images?.[0]?.asset && (
                  <div className="relative w-full h-48">
                    <Image
                      src={urlFor(product.images[0]).width(400).height(300).url()}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-t-lg"
                      priority={false}
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
    </>
  );
};

export default SearchResultsContent;