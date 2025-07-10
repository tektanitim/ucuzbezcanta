// app/arama-sonuclari/page.tsx
"use client";

import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';

export default function SearchResultsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh]">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Arama sonuçları yükleniyor...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}