// app/blog/page.tsx
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react'; // Eğer post.body PortableText ise

// Tip tanımları
interface Author {
  name: string;
  slug: { current: string };
  image?: { _type: 'image'; asset: { _ref: string }; alt?: string };
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
  description?: string; // kısa açıklama veya body'nin ilk paragrafı için
}

// Tüm blog gönderilerini çeken fonksiyon
async function getPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
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
        image
      },
      categories[]->{
        _id,
        title,
        slug
      },
      body, // Tüm body içeriğini çekiyoruz
      "description": array::join(string::split(pt::text(body), ""), "")[0..200] + "..." // Body'nin ilk 200 karakteri gibi bir açıklama oluştur
    }
  `;
  const posts = await client.fetch(query);
  return posts;
}

const BlogPage: React.FC = async () => {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
        Blog Yazılarımız
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Henüz blog yazısı bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                {post.mainImage && (
                  <div className="relative w-full h-56">
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.mainImage.alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                      priority // İlk yüklenecek resimler için
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.author && (
                    <p className="text-gray-600 text-sm mb-2">
                      Yazar: <span className="font-medium">{post.author.name}</span>
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mb-3">
                    {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {/* Kısa açıklama veya body'nin ilk kısmı */}
                  <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {post.description || 'Bu yazının kısa bir açıklaması yok.'}
                  </p>
                  <div className="mt-auto"> {/* Alttaki buton veya linki en alta itmek için */}
                    <span className="text-blue-600 hover:underline font-semibold text-sm">
                      Devamını Oku &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;