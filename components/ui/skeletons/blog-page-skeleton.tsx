import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DynamicBreadcrumbSkeleton from "./dynamic-breadcrumb-skeleton";
import { BlogCardSkeleton } from "./blog-card-skeleton";

const BlogPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/10">
      {/* Breadcrumb Skeleton */}
      <div className="pt-6 max-w-7xl mx-auto px-4">
        <DynamicBreadcrumbSkeleton />
      </div>

      {/* Section Header Skeleton */}
      <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <Skeleton className="h-8 sm:h-10 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Blog Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <BlogCardSkeleton
              key={item}
            />
          ))}
        </div>
      </div>

      {/* Newsletter Section Skeleton */}
      <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4">
        <Card className="bg-linear-to-r from-secondary/20 to-primary/20 border-0 rounded-none">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <Skeleton className="w-12 h-12 mx-auto mb-4" />
              <Skeleton className="h-8 sm:h-10 w-64 mx-auto mb-4" />
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full max-w-md mx-auto" />
                <Skeleton className="h-4 w-3/4 max-w-sm mx-auto" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Skeleton className="h-11 w-full sm:w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPageSkeleton;