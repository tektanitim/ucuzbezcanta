"use client";

import React, {useState} from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface SanityImage {
  _type: 'image';
  asset: {
     _ref: string;
     _type: 'reference';
     url?: string; // Sanity'den gelen görsel URL'si 
    };
  alt?: string; // Görselin alternatif metni
}

interface ImageType extends SanityImage {
  _key: string;
  
}

interface ImageGalleryProps {
  images: ImageType[];
  productName: string; // Alt metinler için ürün adı
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full lg:w-1/2 flex items-center justify-center h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg text-gray-400 text-2xl">
        Görsel Yok
      </div>
    );
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4">
      {/* Küçük Resimler (Thumbnails) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] md:max-h-full pb-2 md:pb-0">
          {images.map((img, index) => (
            <div
              key={img._key}
              className={`w-20 h-20 md:w-24 md:h-24 relative border rounded-md overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200
                ${index === currentImageIndex ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-200 hover:border-gray-400'}`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <Image
                src={urlFor(img).url()}
                alt={img.alt || productName}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      )}

      {/* Ana Görsel ve Navigasyon */}
      <div className="flex-grow relative h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={urlFor(currentImage).url()}
          alt={currentImage.alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 75vw"
          className="object-contain object-center"
        />

        {/* Navigasyon Okları */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-10"
              aria-label="Next image"
            >
              <FaChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;