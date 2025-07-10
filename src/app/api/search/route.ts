import { client } from '@/lib/sanity';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { message: 'Lütfen arama terimi giriniz' }, 
        { status: 400 }
      );
    }



    const searchTerm = query.trim().toLowerCase().replace(/[^\w\s-ğüşıöçĞÜŞİÖÇ]/g, "");

    const searchResults = await client.fetch(`
      *[_type == "product" && (
        lower(name) match "${searchTerm}*" ||
        lower(description) match "${searchTerm}*" ||
        lower(category->title) match "${searchTerm}*"
      )]{
        _id,
        name,
        "slug": slug.current,
        price,
        images,
        "categoryName": category->title,
        description
      }
    `);

    return NextResponse.json(searchResults.length > 0 ? searchResults : []);

  } catch (error) {
    return NextResponse.json(
      { message: 'Arama işlemi başarısız' },
      { status: 500 }
    );
  }
}