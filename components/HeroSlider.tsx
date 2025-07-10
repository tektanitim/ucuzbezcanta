// components/HeroSlider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';


import { SliderItem } from '@/types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { fetchSanityData, urlFor } from '@/lib/sanity'; // @/src/lib/sanity DEĞİL, sizin durumunuzda @lib/sanity çalışıyor


const HeroSlider: React.FC = () => {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSliderItems() {
      try {
        const data: SliderItem[] = await fetchSanityData(`
          *[_type == "sliderItem"] | order(order asc) {
            _id,
            title,
            subtitle,
            image,
            buttonText,
            buttonLink,
            order
          }
        `);
        setSliderItems(data);
      } catch (err) {
        console.error("Slider öğeleri çekilirken hata oluştu:", err);
        setError("Slider öğeleri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    // HATA DÜZELTMESİ: Aşağıdaki satır "getCategories();" olarak kalmış olmalı,
    // o yüzden slider verisi çekilmiyordu veya sadece bir kere çekilip hata veriyordu.
    // Doğrusu "getSliderItems();" olmalı.
    getSliderItems(); // Bu satırın düzeltildiğinden emin olun
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-lg">Slider yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-lg text-red-600">{error}</div>;
  }

  if (sliderItems.length === 0) {
    return <div className="text-center py-20 text-lg text-gray-600">Henüz slider öğesi bulunamadı. Lütfen Sanity Studiodan ekleyin.</div>;
  }

  return (
    <section className="w-full relative h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="mySwiper w-full h-full"
      >
        {sliderItems.map((item) => (
          <SwiperSlide key={item._id}>
            <div className="relative w-full aspect-[16/9] sm:aspect-auto h-full">
              {item.image && (
                <Image
                  src={urlFor(item.image).url()}
                  alt={item.title}
                  fill
                  priority
                  className="object-cover object-center"
                />
              )}
              {/* İçerik Katmanı */}
              <div className="absolute inset-0 flex flex-col text-gray-600 px-10 pt-10 sm:pt-32 md:pt-40 lg:pt-48 xl:pt-56 justify-start items-start">
                <h2
                  className="text-4xl md:text-5xl lg:text-10xl font-bold mb-4 animate-fade-in-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  {item.title}
                </h2>
                {item.subtitle && (
                  <p
                    className="text-xl md:text-xl lg:text-4xl mb-6 max-w-2xl animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                  >
                    {item.subtitle}
                  </p>
                )}
                {item.buttonText && item.buttonLink && (
                  <Link
                    href={item.buttonLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-full text-xs md:text-lg transition-colors duration-300 animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                  >
                    {item.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;