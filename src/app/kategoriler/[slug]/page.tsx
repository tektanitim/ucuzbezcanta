// src/app/kategoriler/[slug]/page.tsx
import React from 'react';
import { fetchSanityData } from '@/lib/sanity';
import ProductCard from '../../../../components/ProductCard';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Product, Category } from '@/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Dinamik metadata oluşturma
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categorySlug = params.slug;
  const category: Category | null = await fetchSanityData<Category | null>(`
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

// Statik yolları oluşturma
export async function generateStaticParams() {
  const categories: Category[] = await fetchSanityData<Category[]>(`
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

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const categorySlug = params.slug;

  const data = await fetchSanityData<{
    currentCategory: Category | null;
    products: Product[];
    allCategories: Category[];
  }>(`
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
          _key,
          _type,
          asset->{
            _ref,
            _type,
            url
          },
          alt
        }
      },
      "allCategories": *[_type == "category"] | order(title asc) {
        _id,
        title,
        slug {
          current
        }
      }
    }
  `);

  const currentCategory = data.currentCategory;
  const products = data.products;
  const allCategories = data.allCategories;

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">
        {currentCategory.title} Bez Çantalar
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tüm Kategoriler</h2>
          <ul className="space-y-2">
            {allCategories.map((category) => (
              <li key={category._id}>
                <Link
                  href={`/kategoriler/${category.slug.current}`}
                  className={`block py-2 px-3 rounded-md transition-colors duration-200
                    ${category.slug.current === currentCategory.slug.current
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="w-full md:w-3/4">
          {products.length === 0 ? (
            <p className="text-center text-xl text-gray-600 mt-12">Bu kategoride henüz ürün bulunmamaktadır.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
