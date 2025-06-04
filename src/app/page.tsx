import { Suspense } from "react";
import { Container } from "@mui/material";
import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <Container maxWidth="xl">
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedProducts />
            </Suspense>
          </Container>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <Container maxWidth="xl">
            <Suspense fallback={<LoadingSpinner />}>
              <CategoriesGrid />
            </Suspense>
          </Container>
        </section>

        {/* Newsletter Section */}
        {/* <section className="py-16 bg-primary-600">
          <Container maxWidth="lg">
            <NewsletterSection />
          </Container>
        </section> */}
      </div>
    </MainLayout>
  );
}
