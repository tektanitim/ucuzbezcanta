// app/blog/[slug]/page.tsx
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react'; // Bileşen tipleri için

// Tip tanımları (BlogPage'dekiyle aynı veya daha detaylı olabilir)
interface Author {
  name: string;
  slug: { current: string };
  image?: { _type: 'image'; asset: { _ref: string }; alt?: string };
  bio?: any; // PortableText content
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { _type: 'image'; asset: { _ref: string }; alt?: string };
  publishedAt: string;
  author?: Author;
  categories?: Category[];
  body: any; // PortableText content
  seoTitle?: string;
  seoDescription?: string;
}

interface PostPageProps {
  params: {
    slug: string; // URL'den gelecek slug
  };
}

// Tek bir blog gönderisini çeken fonksiyon
async function getPost(slug: string): Promise<Post> {
  const query = `
    *[_type == "post" && slug.current == "${slug}"][0]{
      _id,
      title,
      slug,
      mainImage{
        asset->{
          _ref,
          _type,
          url
        },
        alt
      },
      publishedAt,
      author->{
        name,
        slug,
        image,
        bio
      },
      categories[]->{
        _id,
        title,
        slug
      },
      body,
      // Eğer post şemanızda seoTitle ve seoDescription varsa
      seoTitle,
      seoDescription
    }
  `;
  const post = await client.fetch(query);
  return post;
}

// Portable Text render bileşenleri
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-80 my-8 rounded-lg overflow-hidden shadow-md">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog Görseli'}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 700px"
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold my-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold my-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold my-4">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold my-3">{children}</h4>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 py-2 italic my-4">{children}</blockquote>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a href={value.href} rel={rel} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
};

const PostPage: React.FC<PostPageProps> = async ({ params }) => {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    // 404 sayfası göstermek veya yönlendirmek için
    // return notFound(); // next/navigation'dan notFound'ı import edebilirsiniz
    return <div className="text-center py-20 text-xl font-semibold">Blog yazısı bulunamadı.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
      {/* Ana Görsel */}
      {post.mainImage && (
        <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden shadow-xl">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.mainImage.alt || post.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 800px"
            className="rounded-lg"
            priority
          />
        </div>
      )}

      {/* Başlık */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Yazar ve Tarih */}
      <div className="flex items-center text-gray-600 mb-8">
        {post.author && post.author.image && (
          <Image
            src={urlFor(post.author.image).width(40).height(40).url()}
            alt={post.author.name || 'Yazar'}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
        )}
        {post.author && (
          <span className="font-medium mr-4">Yazar: {post.author.name}</span>
        )}
        <span className="text-sm">
          {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Kategoriler */}
      {post.categories && post.categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Link key={category._id} href={`/kategoriler/${category.slug.current}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-blue-200 transition-colors">
              {category.title}
            </Link>
          ))}
        </div>
      )}

      {/* İçerik */}
      <div className="prose max-w-none text-gray-800">
        <PortableText value={post.body} components={components} />
      </div>

      {/* Yazar Biyografisi (eğer yazar detayları varsa) */}
      {post.author && post.author.bio && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Yazar Hakkında: {post.author.name}</h3>
          <div className="prose max-w-none text-gray-700">
            <PortableText value={post.author.bio} />
          </div>
        </div>
      )}

      {/* Geri Dön Butonu */}
      <div className="mt-12 text-center">
        <Link href="/blog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          &larr; Tüm Blog Yazılarına Geri Dön
        </Link>
      </div>
    </div>
  );
};

// Bu sayfa dinamik slug'a sahip olduğu için, Next.js'in statik olarak hangi sayfaları oluşturacağını bilmesi için generateStaticParams'i kullanabiliriz.
// Ancak getPost fonksiyonunu direkt async component içinde çağırırsak, Next.js otomatik olarak SSR yapar.
// Eğer SSG (Static Site Generation) istiyorsanız bu fonksiyonu eklemeniz gerekir:
export async function generateStaticParams() {
  const query = `*[_type == "post"].slug.current`;
  const slugs: string[] = await client.fetch(query);

  return slugs.map((slug) => ({ slug }));
}


// SEO Meta Verileri (generateMetadata)
import { Metadata } from 'next';

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
      description: 'Aradığınız blog yazısı bulunamadı.',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || (post.body && post.body[0]?.children[0]?.text?.substring(0, 160)) || 'Bu bir blog yazısıdır.'; // İlk paragraftan veya default metin

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: post.publishedAt,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.slug.current}`,
      images: post.mainImage ? [
        {
          url: urlFor(post.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: post.mainImage.alt || post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: post.mainImage ? [urlFor(post.mainImage).width(800).height(418).url()] : [],
    },
  };
}


export default PostPage;