// app/api/subscribe/route.ts
import { client } from '@/lib/sanity'; // Sanity client'ınızı import edin

export async function POST(request: Request) {
  try {
    const { email } = await request.json(); // İsteğin body'sinden email'i alın

    // Basit bir doğrulama
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ message: 'Geçerli bir e-posta adresi giriniz.' }), { status: 400 });
    }

    // Sanity'de bu e-postanın zaten abone olup olmadığını kontrol et
    const existingSubscriber = await client.fetch(
      `*[_type == "newsletter" && email == $email][0]`, // Sizin şemanıza göre 'newsletter'
      { email }
    );

    if (existingSubscriber) {
      return new Response(JSON.stringify({ message: 'Bu e-posta adresi zaten abone.' }), { status: 409 }); // Conflict
    }

    // Yeni abone belgesini oluştur
    const newSubscriber = {
      _type: 'newsletter', // Sizin şemanızdaki "name" alanı ile aynı olmalı
      email: email,
      subscribedAt: new Date().toISOString(),
    };

    const result = await client.create(newSubscriber); // Sanity'ye gönder

    return new Response(JSON.stringify({ message: 'E-bülten aboneliğiniz başarıyla alındı!', subscriber: result }), { status: 200 });

  } catch (error) {
    console.error('E-bülten aboneliği hatası:', error);
    return new Response(JSON.stringify({ message: 'Abonelik işlemi sırasında bir hata oluştu.' }), { status: 500 });
  }
}