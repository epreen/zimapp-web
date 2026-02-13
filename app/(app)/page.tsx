import { ALL_CATEGORIES_QUERY } from '@/sanity/queries/categories';
import { FEATURED_PRODUCTS_QUERY, FILTER_PRODUCTS_BY_NAME_QUERY, FILTER_PRODUCTS_BY_PRICE_ASC_QUERY, FILTER_PRODUCTS_BY_PRICE_DESC_QUERY, FILTER_PRODUCTS_BY_RELEVANCE_QUERY } from '@/sanity/queries/products';
import { sanityFetch } from '@/sanity/lib/live';
import { Suspense } from 'react';
import { FeaturedCarousel } from '@/components/ui/carousels/featured-carousel';
import { FeaturedCarouselSkeleton } from '@/components/ui/skeletons/featured-carousel-skeleton';
import { ProductSection } from '@/components/ui/sections/product-section';
import CategoriesMarquee from '@/components/ui/layout/marquee/categories-marquee';
import NewsletterSection from '@/components/ui/sections/newsletter-section';
import BusinessApplicationSection from '@/components/ui/sections/business-application-section';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? '';
  const categorySlug = params.category ?? '';
  const color = params.color ?? '';
  const material = params.material ?? '';
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? 'name';
  const inStock = params.inStock === 'true';

  // Select query based on sort parameter
  const getQuery = () => {
    // If searching and sort is relevance, use relevance query
    if (searchQuery && sort === 'relevance') {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case 'price_asc':
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case 'price_desc':
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case 'relevance':
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products with filters (server-side via GROQ)
  const { data: products } = await sanityFetch({
    query: getQuery(),
    params: {
      searchQuery,
      categorySlug,
      color,
      material,
      minPrice,
      maxPrice,
      inStock,
    },
  });

  // Fetch categories for filter sidebar
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch featured products for carousel
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  return (
    <>
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}
      <div className='max-w-7xl mx-auto'>
        {/* Page Banner */}
        <div>
          <div className="mx-auto px-4 pt-8 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight uppercase">
              Shop {categorySlug ? categorySlug : "All Featured Products"}
            </h1>
            <p className="mt-1 text-sm text-foreground/60">
              Shop all featured products by their category
            </p>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <ProductSection />
          </div>

          <div className="px-4 py-8">
            <BusinessApplicationSection />
          </div>
        </div>
      </div>
    </>
  );
}
