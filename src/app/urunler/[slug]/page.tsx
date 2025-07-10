// src/app/urunler/[slug]/page.tsx
import React from 'react';
import { fetchSanityData, urlFor } from '@/lib/sanity'; // urlFor kullanılacağı için import edildi

import Link from 'next/link';
import { notFound } from 'next/navigation'; // Ürün bulunamadığında 404 döndürmek için
import { Metadata } from 'next';

// Merkezi tip tanımlarımızı import ediyoruz
import { Product, GalleryImage } from '@/types';
import { SanityImageSource } from '@sanity/image-url/lib/types/types'; // urlFor için gerekli

import ImageGallery from '../../../../components/ImageGallery';


interface ProductPageProps {
  params: { slug: string };
}

// Tek bir ürünü Sanity'den çeken fonksiyon
async function getProduct(slug: string): Promise<Product | null> {
  // Sanity GROQ sorgunuzu Product tipine tam uyumlu hale getirin
  const query = `
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      price,
      description, // 'type: "text"' olarak tanımlı olduğu için string olarak dönecek
      images[]{ // Ürün şemanızdaki images array'i
        _key,
        _type,
        asset->{
          _ref,
          _type,
          url
        },
        alt,
        crop,
        hotspot
      },
      category->{ // Kategori referansını çözüyoruz
        _id,
        title, // Category şemanızdaki ad 'title'
        slug
      },
      stock, // Sanity şemanızdan gelen 'stock' alanı
      isFeatured, // Sanity şemanızdan gelen 'isFeatured' alanı
      publishedAt // Sanity şemanızdan gelen 'publishedAt' alanı
      // Eğer 'sku' alanı şemanızda varsa buraya eklemelisiniz. Yoksa Product tipinde de olmamalı.
    }
  `;
  const product = await fetchSanityData<Product | null>(query, { slug });
  return product;
}




// Dinamik metadata oluşturma (SEO için)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
      description: 'Aradığınız ürün bulunamadı.',
    };
  }

  // description string olduğu için direkt kullanabiliriz
  const descriptionText = product.description;

  return {
    title: product.name,
    description: descriptionText,
    openGraph: {
      title: product.name,
      description: descriptionText,
      type: 'website', // Daha önce aldığınız "Invalid OpenGraph type: product" hatası için 'website' veya 'article' kullanın
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/urunler/${product.slug.current}`,
      // Ana görsel için product.images[0] kullanıldı, çünkü ayrı mainImage yok
      images: product.images && product.images.length > 0 ? [urlFor(product.images[0] as SanityImageSource).width(1200).height(630).url()] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: descriptionText,
      images: product.images && product.images.length > 0 ? [urlFor(product.images[0] as SanityImageSource).width(1200).height(630).url()] : [],
    },
  };
}

// Bu fonksiyon, Next.js'in statik yolları derleme zamanında önceden oluşturmasını sağlar (SSG için)
export async function generateStaticParams() {
  const products: Product[] = await fetchSanityData<Product[]>(`
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
  const { slug } = params;
  const product = await getProduct(slug); // Ürün detaylarını Sanity'den çekelim

  if (!product) {
    notFound(); // Ürün bulunamazsa 404 sayfasını göster
  }

  // ImageGallery için görselleri Product'tan alıyoruz ve GalleryImage tipine dönüştürüyoruz
  const galleryImages: GalleryImage[] = product.images.map((img, index) => ({
    ...img, // SanityImage'ın tüm özelliklerini kopyala
    _key: img._key || img.asset._ref || `image-${index}`, // _key garanti et
  }));


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
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
                {product.category.title} {/* category.title kullanıldı */}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
          )}
          <li className="flex items-center">
            <span className="text-gray-800 font-semibold">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sol Sütun: Ürün Görselleri (ImageGallery bileşeni ile) */}
        {product.images && product.images.length > 0 ? (
          <ImageGallery images={galleryImages} productName={product.name} />
        ) : (
          <div className="w-full lg:w-1/2 flex items-center justify-center h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg text-gray-400 text-2xl">
            Bu ürün için görsel bulunmamaktadır.
          </div>
        )}

        {/* Sağ Sütun: Ürün Bilgileri ve İletişim Butonu */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            {product.category && (
              <Link href={`/kategoriler/${product.category.slug.current}`} className="text-blue-600 text-lg hover:underline mb-4 block">
                {product.category.title} {/* category.title kullanıldı */}
              </Link>
            )}

            <p className="text-5xl font-bold text-red-600 mb-6">{product.price.toFixed(2)} TL</p>
            <p className='text-md text-gray-500 mb-6'>den başlayan fiyatlarla</p>

            <div className="text-gray-700 mb-6">
              <h2 className="text-2xl font-semibold mb-3">Ürün Açıklaması</h2>
              {/* Product.description bir string olduğu için direkt render ediyoruz, PortableText'e gerek yok */}
              <p className="prose prose-lg max-w-none">{product.description}</p>
            </div>

            {/* Stok ve SKU bilgileri */}
            <div className="mb-6 text-lg font-medium">
              <p className={`mb-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Stok Durumu: {product.stock > 0 ? `Stokta Var (${product.stock} Adet)` : 'Stokta Yok'}
              </p>
              {/* Product şemanızda SKU olmadığı için bu satırı yorumladım veya kaldırabilirsiniz */}
              {/* {product.sku && <p className="text-gray-600">SKU: {product.sku}</p>} */}
            </div>
          </div>

          {/* İletişim Butonu */}
          <Link
            href="/iletisim"
            className="w-full py-4 bg-blue-600 text-white text-xl font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center shadow-md"
          >
            İletişime Geç
          </Link>

          <div className="mt-8">
            <Link href="/urunler" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              &larr; Tüm Ürünlere Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;