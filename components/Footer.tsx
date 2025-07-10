"use client"; // Bu satırın dosyanın en üstünde olduğundan emin olun

// components/Footer.tsx
import React, { useState } from 'react'; // useState hook'unu import ettik
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube, FaRss, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';

const Footer: React.FC = () => {
    // E-posta inputu için state
    const [email, setEmail] = useState('');
    // Kullanıcıya gösterilecek mesaj için state (başarı/hata mesajı)
    const [message, setMessage] = useState('');

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Formun varsayılan submit davranışını engelle
        console.log("Form gönderimi denendi!"); // Debug için
        setMessage(''); // Önceki mesajı temizle

        // E-posta boşsa veya geçersizse uyarı ver
        if (!email || !email.includes('@')) {
            setMessage('Lütfen geçerli bir e-posta adresi giriniz.');
            return;
        }

        try {
            // Next.js API rotasına POST isteği gönder
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // E-postayı JSON formatında gönder
            });

            const data = await response.json(); // API'den gelen yanıtı JSON olarak ayrıştır

            if (response.ok) { // HTTP durumu 2xx ise başarılı
                setMessage(data.message || 'E-bülten aboneliğiniz başarıyla alındı!');
                setEmail(''); // Başarılı olursa input'u temizle
            } else { // HTTP durumu 4xx veya 5xx ise hata
                setMessage(data.message || 'Abonelik işlemi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Abonelik işlemi sırasında bir ağ hatası oluştu:', error);
            setMessage('Abonelik işlemi sırasında bir ağ hatası oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <footer className="bg-gray-800 text-gray-300 py-12 px-4">
            <div className="container mx-auto">
                {/* Top Section: Logo/Slogan and Social Icons */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-8 border-b border-gray-700"> {/* mb-8 -> mb-6 yaptım */}
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center text-white text-3xl font-bold">
                            <div style={{ position: 'relative', width: '150px', height: '50px' }}> {/* Logonuzun genişlik ve yüksekliğine göre ayarlayın */}
                                        <Image
                                          src="/images/logo_white.png"
                                          alt="Şirket Logosu"
                                          layout="fill"
                                          objectFit="contain"
                                        />
                            </div>
                        </Link>
                    </div>
                    <div className="flex space-x-5">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaInstagram size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaPinterestP size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaYoutube size={20} />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <FaRss size={20} />
                        </a>
                    </div>
                </div>

                {/* Middle Section: Quick Links, Contact Us, Newsletter */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="hover:text-white transition-colors">Anasayfa</Link></li>
                            <li><Link href="/kategoriler" className="hover:text-white transition-colors">Kategoriler</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
                            <li><Link href="/contact-page" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4">Bize Ulaşın</h3>
                        <address className="not-italic space-y-3">
                            <p className="flex items-start">
                                <FaMapMarkerAlt size={20} className="mr-3 text-gray-500 flex-shrink-0 mt-1" />
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
                        </address>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4">Güncel Kalın</h3>
                        <p className="text-gray-400 mb-4">En son haberler ve özel teklifler için bültenimize abone olun.</p>
                        <form onSubmit={handleNewsletterSubmit}>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    className="flex-grow p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email} // State'e bağladık
                                    onChange={(e) => setEmail(e.target.value)} // Input değiştikçe state'i güncelle
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
                                >
                                    Abone Ol
                                </button>
                            </div>
                        </form>
                        {/* Abonelik mesajını göstermek için */}
                        {message && (
                            <p className={`mt-3 text-sm ${message.includes('hata') || message.includes('zaten') ? 'text-red-400' : 'text-green-400'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()}. Tüm hakları saklıdır.</p>
                    <p>Designed by TekTanitim</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;