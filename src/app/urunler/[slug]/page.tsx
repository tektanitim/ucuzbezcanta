// src/app/urunler/[slug]/page.tsx
import React from 'react';
import { fetchSanityData, urlFor } from '@/lib/sanity'; // urlFor da eklendi
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ImageGallery from '../../../../components/ImageGallery';

// Ürün tipi tanımı
interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
  description: string;
  images: Array<{
    _key: string;
    asset: any;
    alt?: string;
  }>;
  category:{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
}

// Dinamik rota parametreleri için tip tanımı
interface ProductPageProps {
  params: {
    slug: string; // URL'den gelecek ürün slug'ı
  };
}

// Dinamik metadata oluşturma (SEO için)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productSlug = params.slug;

  const product: Product | null = await fetchSanityData(`
    *[_type == "product" && slug.current == "${productSlug}"][0]{
      name,
      description
    }
  `);

  const title = product ? `${product.name} - Ürün Detay` : 'Ürün Bulunamadı';
  const description = product ? product.description : 'Aradığınız ürün bulunamadı.';

  return {
    title: title,
    description: description,
  };
}

// Bu fonksiyon, Next.js'in statik yolları derleme zamanında önceden oluşturmasını sağlar (SSG için)
export async function generateStaticParams() {
  const products: Product[] = await fetchSanityData(`
    *[_type == "product"]{
      slug {
        current
      }
    }
  `);

  return products.map((product) => ({
    slug: product.slug.current,
  }));
}

const ProductDetailPage: React.FC<ProductPageProps> = async ({ params }) => {
  const productSlug = params.slug;

  // Ürün detaylarını Sanity'den çekelim
  const product: Product | null = await fetchSanityData(`
    *[_type == "product" && slug.current == "${productSlug}"][0]{
      _id,
      name,
      slug {
        current
      },
      price,
      description,
      images[]{
        _key,
        asset,
        alt
      },
      category->{ // Ürünün referans verdiği 'category' belgesinin bilgilerini çekiyoruz
        _id,
        title,
        slug {
          current
        }
      }
    }
  `);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600">Ürün Bulunamadı</h1>
        <p className="mt-4 text-lg text-gray-700">Aradığınız ürün bulunamadı veya silinmiş olabilir.</p>
      </div>
    );
  }

  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-6" aria-label="breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-blue-600 hover:underline">
              Anasayfa
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          {product.category && (
            <li className="flex items-center">
              <Link href={`/kategoriler/${product.category.slug.current}`} className="text-blue-600 hover:underline">
                {product.category.title}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
          )}
          <li className="flex items-center">
            <span className="text-gray-800 font-semibold">{product.name}</span>
          </li>
        </ol>
      </nav>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sol Sütun: Ürün Görselleri (ImageGallery bileşeni ile) */}
        {/* product.images varsa ImageGallery'yi render et, yoksa varsayılan bir görsel yok mesajı göster */}
        {product.images && product.images.length > 0 ? (
          <ImageGallery images={product.images} productName={product.name} />
        ) : (
          // Eğer ürün görseli yoksa placeholder veya bir mesaj
          <div className="w-full lg:w-1/2 flex items-center justify-center h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg text-gray-400 text-2xl">
            Bu ürün için görsel bulunmamaktadır.
          </div>
        )}
        
        {/* Sağ Sütun: Ürün Bilgileri ve İletişim Butonu */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-red-600 mb-6">{product.price} TL</p>
            <p className='text-md text-gray-500 mb-6'> den başlayan fiyatlarla</p>
            <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>
          </div>

          <Link
            href="/iletisim"
            className="w-full py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center shadow-md"
          >
            İletişime Geç
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;