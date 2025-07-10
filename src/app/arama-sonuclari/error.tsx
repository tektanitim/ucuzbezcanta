// app/arama-sonuclari/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh] text-center">
      <h2 className="text-red-500 text-xl font-bold">Hata!</h2>
      <p className="mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tekrar Dene
      </button>
    </div>
  );
}