import HeroSlider from "../../components/HeroSlider";
import ServiceFeatures from "../../components/ServiceFeatures";
import FeaturedProducts from "../../components/FeaturedProducts";
import { getFeaturedProducts } from "@/lib/sanity";
import { SliderItem } from "@/types";
import { client } from "@/lib/sanity";


async function getHeroSlides(): Promise<SliderItem[]> {
  const query = `
    *[_type == "heroSlider"] | order(order asc) {
      _id,
      title,
      subtitle,
      "slug": slug.current,
      image { // SanityImage'a uygun olarak çekildiğinden emin olun
        _type,
        asset->{
          _ref,
          _type,
          url
        },
        alt
      },
      buttonText,
      buttonLink,
      order
    }
  `;
  const slides = await client.fetch(query);
  return slides;
}



export default async function Home() {

  const featuredProducts = await getFeaturedProducts();
  const heroSlides = await getHeroSlides(); // Veriyi çekiyoruz

  
  return (
    <main>
      <div className="w-full h-170 py-5 mb-12">
      <HeroSlider slides={heroSlides}/>
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