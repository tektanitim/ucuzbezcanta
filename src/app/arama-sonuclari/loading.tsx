// app/arama-sonuclari/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh] text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    </div>
  );
}