// src/components/ServiceCard.tsx
import { IconType } from 'react-icons'; // İkon tipi için

interface ServiceCardProps {
  Icon: IconType; // React Icon bileşeni olarak gelecek
  title: string;
  description: string;
}

export default function ServiceCard({ Icon, title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg h-full">
      <div className="flex items-center justify-center p-2 rounded-full border border-blue-400 mb-2">
        <Icon className="h-8 w-8 text-blue-600" /> {/* İkonun boyutunu ve rengini ayarlıyoruz */}
      </div>
      <h3 className="text-blue-500 text-lg font-semilight mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}