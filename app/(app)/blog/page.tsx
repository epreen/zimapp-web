import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard } from "@/components/ui/cards/blog-card";
import DynamicBreadcrumb from "@/components/ui/dynamic-breadcrumb";
import { getAllBlogs } from "@/sanity/functions/blog";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const BlogPage = async () => {
  const blogs = await getAllBlogs(12);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/10">
      {/* Breadcrumb */}
      <div className="pt-6 max-w-7xl mx-auto px-4">
        <DynamicBreadcrumb />
      </div>

      {/* Blog Grid */}
      <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                Latest Articles
              </h2>
              <p className="text-foreground/60 text-sm sm:text-sm">
                Stay updated with our latest posts and insights
              </p>
            </div>
            {/* <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary/20"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View All Categories
            </Button> */}
          </div>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog?._id}
                blog={blog}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 sm:p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-foreground/10 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/40" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  No Blog Posts Yet
                </h3>
                <p className="text-sm sm:text-base text-foreground/60 mb-4">
                  We&apos;re working on some amazing content. Check back soon!
                </p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4">
        <Card className="bg-linear-to-r from-secondary/20 to-primary/20 border-0 rounded-none">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4">
                Stay Updated
              </h2>
              <p className="text-xs sm:text-sm text-foreground/60 mb-6">
                Subscribe to our newsletter and never miss an update. Get the
                latest articles, tips, and insights delivered straight to your
                inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button
                  size="lg"
                  className="bg-primary w-full sm:w-auto"
                >
                  Subscribe Newsletter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPage;
