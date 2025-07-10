// app/api/contact/route.ts
import { client } from '@/lib/sanity'; // Sanity client'ınızı import edin

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json(); // Formdan gelen verileri alın

    // Basit bir doğrulama
    if (!name || !email || !message || !email.includes('@')) {
      return new Response(JSON.stringify({ message: 'Lütfen tüm gerekli alanları doldurun ve geçerli bir e-posta adresi girin.' }), { status: 400 });
    }

    // Yeni iletişim mesajı belgesini oluştur
    const newContactMessage = {
      _type: 'contactForm', // Sanity şemanızdaki "name" alanı ile aynı olmalı (contactForm)
      fullName: name, // Formdaki 'name' alanı Sanity'deki 'fullName' ile eşleşiyor
      email: email,
      message: message,
      subject: 'Website İletişim Formu', // Formda konu alanı olmadığı için varsayılan bir değer verdik
      sentAt: new Date().toISOString(),
    };

    const result = await client.create(newContactMessage); // Sanity'ye gönder

    return new Response(JSON.stringify({ message: 'Mesajınız başarıyla gönderildi, teşekkür ederiz!', data: result }), { status: 200 });

  } catch (error) {
    console.error('İletişim formu gönderim hatası:', error);
    return new Response(JSON.stringify({ message: 'Mesaj gönderilirken sunucu tarafında bir hata oluştu.' }), { status: 500 });
  }
}