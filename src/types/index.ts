// src/types/index.ts
// Sanity'deki asset referansı yapısı
export interface SanityImageAsset {
  _ref: string;
  _type: 'reference'; // Genellikle 'reference' veya 'sanity.imageAsset'
  url?: string; // GROQ sorgusunda asset->url çekiyorsanız oluşur
  _id?: string;
}

// Sanity'den gelen standart bir görsel nesnesinin yapısı.
// Bu arayüz, Sanity Studio'daki "Image" tipindeki bir alanın JSON çıktısını temsil eder.
export interface SanityImage {
  _type: 'image'; // Bu alan zorunludur ve "image" olmalıdır
  asset: SanityImageAsset; // Görselin asset referansı
  alt?: string; // Görselin alt metni (opsiyonel)
  crop?: {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    x: number;
    y: number;
    height: number;
    width: number;
  };
  _key?: string; // Array of image kullanıldığında Sanity tarafından eklenir
}

// PortableText içinde image block olarak kullanılan görsel tipi
// PortableTextComponents'daki `image` render fonksiyonunun `value` prop'u için kullanılır.
export interface PortableTextImageValue extends SanityImage {
  // PortableText'in image block'larında bulunan ek alanlar olabilir (örneğin caption)
  caption?: string; // Sizin şemalarınızda caption yok, ama örnek olarak kalsın.
}


// --- GENEL İÇERİK TİPLERİ (Çeşitli Modellerde Kullanılabilen) ---

// Kategori modeli için arayüz (schemas/category.ts'e göre birebir uyumlu)
export interface Category {
  _id: string;
  title: string; // schemas/category.ts'teki 'name: "title"' alanına karşılık gelir
  slug: { current: string };
  description?: string; // schemas/category.ts'te tanımlı olduğu için ekledik (opsiyonel)
}

// Yazar modeli için arayüz (schemas/author.ts'e göre birebir uyumlu)
export interface Author {
  name: string;
  slug: { current: string };
  image?: SanityImage; // Author şemasında 'image' alanı SanityImage
  bio?: PortableTextRaw; // Author şemasında 'bio' alanı Portable Text (array of block)
}


// --- BLOG (POST) TİPLERİ ---

// Blog gönderisi (Post) modeli için arayüz (schemas/post.ts'e göre birebir uyumlu)
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  author?: Author; // Referans çözüldüğünde Author tipinde gelir
  mainImage?: SanityImage; // Post şemasında 'mainImage' alanı SanityImage
  categories?: Category[]; // Referans çözüldüğünde Category dizisi gelir
  publishedAt: string;
  body: PortableTextRaw; // Post şemasında 'body' alanı Portable Text (array of block)
  // Post şemasında 'description', 'seoTitle', 'seoDescription' alanları yok,
  // bu yüzden bunları buradan kaldırıyorum.
  // Eğer bu alanlar Content Studio'da farklı bir yerden geliyorsa, o zaman buraya manuel eklemeniz gerekir.
  // Varsayılan olarak sadece şemada olanları yansıtıyorum.
  // Eğer post şemanıza seoTitle ve seoDescription eklemek isterseniz, o zaman buraya ekleyebilirsiniz.
  // Örn: seoTitle?: string; seoDescription?: string;
}


// --- ÜRÜN TİPLERİ ---

// Ürün modeli için arayüz (schemas/product.ts'e göre birebir uyumlu)
export interface Product {
  _id: string;
  name: string; // schemas/product.ts'teki 'name: "name"' alanına karşılık gelir
  slug: { current: string };
  images: SanityImage[]; // schemas/product.ts'teki 'images' alanı (array of image)
  price: number;
  description: string; // schemas/product.ts'teki 'description' alanı 'type: "text"' olduğu için string
                        // Eğer bu alanın Portable Text editörü olsaydı 'PortableTextRaw' olurdu.
  category?: Category; // Referans çözüldüğünde Category tipinde gelir
  stock: number;
  isFeatured: boolean;
  publishedAt: string; // schemas/product.ts'te datetime olarak tanımlanmış, string olarak çekiyoruz
  // schemas/product.ts'te 'sku' alanı tanımlı değil, bu yüzden buradan kaldırıyorum.
  // Eğer kullanıyorsanız, şemanıza da eklemelisiniz.
}


// --- DİĞER SAYFALAR / MODELLER İÇİN TİPLER ---

// Page modeli için arayüz (schemas/page.ts'e göre birebir uyumlu)
export interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  body: PortableTextRaw; // schemas/page.ts'teki 'body' alanı Portable Text (array of block)
  seoTitle?: string; // schemas/page.ts'te tanımlı (opsiyonel)
  seoDescription?: string; // schemas/page.ts'te tanımlı (opsiyonel)
}


// --- BİLEŞENLERE ÖZEL TİPLER ---

// HeroSlider bileşeni için bir slayt öğesinin arayüzü (schemas/sliderItem.ts'e göre birebir uyumlu)
export interface SliderItem {
  _id: string; // Genellikle document tipindeki her şemada _id olur.
  title: string;
  subtitle?: string;
  image: SanityImage; // image alanı zorunlu
  buttonText?: string;
  buttonLink?: string; // type: 'url' olduğu için string
  order: number;
}

// ImageGallery bileşeni için bir galeri görsel öğesinin arayüzü
// SanityImage'ın tüm özelliklerini devralır ve ek olarak _key içerir.
export interface GalleryImage extends SanityImage {
  _key: string; // ImageGallery component'inde kullanıldığı için zorunlu
}