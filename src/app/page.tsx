import { getProducts } from "@/lib/catalog";
import { getRecentReviews, getReviewStats } from "@/lib/reviews";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChoose } from "@/components/home/WhyChoose";
import { StorySection } from "@/components/home/StorySection";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/seo/StructuredData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, reviews, stats] = await Promise.all([
    getProducts(),
    getRecentReviews({ limit: 6 }),
    getReviewStats(),
  ]);

  return (
    <>
      <LocalBusinessJsonLd />
      <WebsiteJsonLd />
      <Hero />
      <FeaturedProducts products={products} />
      <WhyChoose />
      <StorySection />
      <Reviews initialReviews={reviews} avg={stats.avg} count={stats.count} />
      <Faq />
    </>
  );
}
