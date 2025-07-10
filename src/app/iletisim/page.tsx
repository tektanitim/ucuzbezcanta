// app/iletisim/page.tsx
"use client"; // İstemci tarafı etkileşimleri için

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // İkonlar için

const ContactPage: React.FC = () => {
  // Form state'leri
  const [formData, setFormData] = useState({
    name: '', // fullname için 'name' kullandık
    email: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = useState(''); // Kullanıcıya gösterilecek mesaj

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(''); // Önceki mesajı temizle

    // Basit frontend doğrulama
    if (!formData.name || !formData.email || !formData.message || !formData.email.includes('@')) {
        setSubmitMessage('Lütfen tüm gerekli alanları doldurun ve geçerli bir e-posta adresi girin.');
        return;
    }

    try {
        const response = await fetch('/api/contact', { // Yeni oluşturduğumuz API rotasına istek
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // FormData objesini doğrudan gönderiyoruz
        });

        const data = await response.json(); // API'den gelen yanıtı al

        if (response.ok) { // HTTP durumu 2xx ise başarılı
            setSubmitMessage(data.message || 'Mesajınız başarıyla gönderildi!');
            setFormData({ name: '', email: '', message: '' }); // Formu temizle
        } else { // HTTP durumu 4xx veya 5xx ise hata
            setSubmitMessage(data.message || 'Mesaj gönderilirken bir hata oluştu.');
        }
    } catch (error) {
        console.error('İletişim formu gönderim hatası:', error);
        setSubmitMessage('Mesaj gönderilirken bir ağ hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

    // Google Maps iframe embed URL'si
  // Örn: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.053893284603!2d28.954052676307366!3d41.04595051710377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab0056d6fa5ad%3A0x64e792755325c3a3!2sUcuz%20Bez%20%C3%87anta!5e0!3m2!1str!2str!4v1752129569367!5m2!1str!2str"; // Örnek Beyoğlu adresi iframe kodu

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-12">
        Bize Ulaşın
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* İletişim Formu */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Mesaj Gönderin</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Adınız Soyadınız
              </label>
              <input
                type="text"
                id="name"
                name="name" // Sanity şemasındaki 'fullName' alanına karşılık geliyor
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                E-posta Adresiniz
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                placeholder="mail@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                placeholder="Mesajınızı buraya yazın..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md focus:outline-none focus:shadow-outline transition-colors"
            >
              Mesaj Gönder
            </button>
            {submitMessage && (
                <p className={`mt-4 text-center ${submitMessage.includes('hata') ? 'text-red-500' : 'text-green-600'}`}>
                    {submitMessage}
                </p>
            )}
          </form>
        </div>

        {/* İletişim Bilgileri ve Harita */}
        <div className="flex flex-col gap-8">
          {/* İletişim Detayları */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">İletişim Detayları</h2>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-center">
                <FaMapMarkerAlt size={20} className="mr-3 text-gray-500 flex-shrink-0" />
                Fetihtepe Mahallesi Tepe üstü sokak No:41A Beyoğlu - İstanbul (TR)
              </p>
              <p className="flex items-center">
                <FaPhoneAlt size={20} className="mr-3 text-gray-500" />
                +90 212 659 25 30
              </p>
              <p className="flex items-center">
                <FaEnvelope size={20} className="mr-3 text-gray-500" />
                info@ucuzbezcanta.com
              </p>
            </div>
          </div>

          {/* Harita */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={mapEmbedUrl}
              width="100%" // Genişliği responsive yaptık
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;