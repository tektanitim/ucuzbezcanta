// src/app/kategoriler/[slug]/page.tsx
import React from 'react';
import { fetchSanityData } from '@/lib/sanity';
import ProductCard from '../../../../components/ProductCard';
import { Metadata } from 'next';
import Link from 'next/link'; // Link bileşeni eklendi

// Ürün tipi tanımı (mevcut haliyle kalacak)
interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
  images: Array<{
    _key: string;
    asset: any;
    alt?: string;
  }>;
  category: {
    _ref: string;
    _type: string;
  };
}

// Kategori tipi tanımı (mevcut haliyle kalacak)
interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

// Dinamik rota parametreleri için tip tanımı (mevcut haliyle kalacak)
interface CategoryPageProps {
  params: {
    slug: string; // URL'den gelecek kategori slug'ı
  };
}

// Dinamik metadata oluşturma (mevcut haliyle kalacak)
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorySlug = params.slug;
  const category: Category | null = await fetchSanityData(`
    *[_type == "category" && slug.current == "${categorySlug}"][0]{
      title
    }
  `);

  const title = category ? `${category.title} Bez Çantalar` : 'Kategori Bulunamadı';
  const description = category ? `${category.title} kategorisindeki tüm bez çanta modelleri ve fiyatları.` : 'Aradığınız kategori bulunamadı.';

  return {
    title: title,
    description: description,
  };
}

// generateStaticParams (mevcut haliyle kalacak)
export async function generateStaticParams() {
  const categories: Category[] = await fetchSanityData(`
    *[_type == "category"]{
      slug {
        current
      }
    }
  `);
  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const categorySlug = params.slug;

  // Hem kategori bilgisi, hem ürünler, hem de TÜM kategorileri çekiyoruz
  const data = await fetchSanityData(`
    {
      "currentCategory": *[_type == "category" && slug.current == "${categorySlug}"][0]{
        _id,
        title,
        slug {
          current
        }
      },
      "products": *[_type == "product" && category->slug.current == "${categorySlug}"]{
        _id,
        name,
        slug {
          current
        },
        price,
        images[]{
          asset,
          alt,
          _key
        }
      },
      "allCategories": *[_type == "category"] | order(title asc) { // Tüm kategorileri çek
        _id,
        title,
        slug {
          current
        }
      }
    }
  `);

  const currentCategory: Category | null = data.currentCategory;
  const products: Product[] = data.products;
  const allCategories: Category[] = data.allCategories; // Tüm kategoriler

  if (!currentCategory) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600">Kategori Bulunamadı</h1>
        <p className="mt-4 text-lg text-gray-700">Aradığınız kategoriye ait sayfa bulunamadı veya silinmiş olabilir.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">
        {currentCategory.title} Bez Çantalar
      </h1>

      <div className="flex flex-col md:flex-row gap-8"> {/* İki sütunlu layout */}
        {/* Sol Sütun: Kategori Listesi */}
        <aside className="w-full md:w-1/4 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tüm Kategoriler</h2>
          <ul className="space-y-2">
            {allCategories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/kategoriler/${category.slug.current}`}
                  className={`block py-2 px-3 rounded-md transition-colors duration-200
                    ${category.slug.current === currentCategory.slug.current
                      ? 'bg-blue-600 text-white font-bold' // Aktif kategori stili
                      : 'text-gray-700 hover:bg-gray-200' // Normal kategori stili
                    }`}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Sağ Sütun: Ürün Listesi */}
        <main className="w-full md:w-3/4">
          {products.length === 0 ? (
            <p className="text-center text-xl text-gray-600 mt-12">Bu kategoride henüz ürün bulunmamaktadır.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Ürün grid'i */}
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;