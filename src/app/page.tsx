import HeroSlider from "../../components/HeroSlider";
import ServiceFeatures from "../../components/ServiceFeatures";
import FeaturedProducts from "../../components/FeaturedProducts";
import { getFeaturedProducts } from "@/lib/sanity";



export default async function Home() {

  const featuredProducts = await getFeaturedProducts();
  
  return (
    <main>
      <div className="w-full h-170 py-5 mb-12">
      <HeroSlider />
      </div>
      <div className="w-full px-4 md:px-10 py-5">
      <ServiceFeatures />
      </div>
      <div className="w-full px-4 md:px-10 py-5">
      <FeaturedProducts products={featuredProducts} />
      </div>
    </main>
  );
}