// lib/sanity.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-06-30", // Kullanmak istediğiniz API versiyonu (genellikle güncel tarih kullanılır)
  useCdn: true, // Verileri daha hızlı çekmek için CDN kullan
  token: process.env.SANITY_API_TOKEN, // Eğer kimlik doğrulama gerekiyorsa
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Sanity'den veri çekmek için genel bir fonksiyon
export async function fetchSanityData(query: string) {
  const data = await client.fetch(query);
  return data;
}

// Öne Çıkan ürünler
export async function getFeaturedProducts() {
  const query = `*[_type == "product" && isFeatured == true]{
    _id,
    name,
    slug,
    price,
    images,
    category->{name,slug},
  }`;
  return client.fetch(query);
}

// Diğer mevcut Sanity client fonksiyonlarınız varsa buraya ekleyebilirsiniz.
// Örneğin:
export async function getProducts() {
  const query = `
    *[_type == "product"] {
      _id,
      name,
      slug,
      price,
      images,
      category->{name, slug},
    }
  `;
  return client.fetch(query);
}

export async function getProduct(slug: string) {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      price,
      images,
      category->{name, slug},
      details,
      care,
    }
  `;
  return client.fetch(query, { slug });
}

export async function getCategories() {
  const query = `
    *[_type == "category"] {
      _id,
      name,
      slug,
      description,
    }
  `;
  return client.fetch(query);
}

export async function getProductsByCategory(categorySlug: string) {
  const query = `
    *[_type == "product" && category->slug.current == $categorySlug] {
      _id,
      name,
      slug,
      price,
      images,
      category->{name, slug},
    }
  `;
  return client.fetch(query, { categorySlug });
}