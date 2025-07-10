// components/ProductCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';
import { Product } from '@/types'; // Product tipini içe aktar


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link
    href={`/urunler/${product.slug.current}`}
    className="group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
    >
      <div className="relative w-full h-64 bg-gray-100 overflow-hidden"> 
        {mainImage ? (
          <Image
            src={urlFor(mainImage).url()}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Resim Yok
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between"> {/* flex-grow ve justify-between eklendi */}
        <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 text-center"> {/* text-center eklendi */}
          {product.name}
        </h3>
        <p className="mt-2 text-xl font-bold text-gray-900 text-right"> {/* text-right eklendi */}
          {product.price} TL<p className='text-xs text-gray-500'> den başlayan fiyatlarla</p>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;