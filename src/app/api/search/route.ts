// app/api/search/route.ts - (Mevcut kodunuz geçerli, değişiklik yok)
import { client } from '@/lib/sanity';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: 'Arama terimi boş olamaz.' }, { status: 400 });
    }

    const searchTerm = query.trim().toLowerCase();

    const searchQuery = `
      *[_type == "product" && (
        lower(name) match "${searchTerm}*" ||
        lower(description) match "${searchTerm}*" ||
        lower(category->name) match "${searchTerm}*"
      )]{
        _id,
        name,
        slug,
        price,
        images,
        "categoryName": category->title, // category->name yerine category->title kullanıldı (Sanity category şemasında title alanı vardır)
        description
      }
    `;

    const searchResults = await client.fetch(searchQuery);

    return NextResponse.json(searchResults, { status: 200 });

  } catch (error) {
    console.error('Arama API hatası:', error);
    return NextResponse.json({ message: 'Arama sırasında bir hata oluştu.' }, { status: 500 });
  }
}