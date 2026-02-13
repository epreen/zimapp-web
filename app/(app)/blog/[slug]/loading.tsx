import { Skeleton } from "@/components/ui/skeleton";

export default function SingleBlogLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">

      {/* ================= HERO SECTION ================= */}
      <section className="relative border-b border-border">
        {/* Image */}
        <Skeleton className="w-full h-[50vh] min-h-[300px] max-h-[600px] bg-muted" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-10 w-full">

            {/* Categories */}
            <div className="flex justify-center gap-2 mb-4">
              <Skeleton className="h-6 w-20 bg-muted rounded-full" />
              <Skeleton className="h-6 w-16 bg-muted rounded-full" />
              <Skeleton className="h-6 w-24 bg-muted rounded-full" />
            </div>

            {/* Title */}
            <Skeleton className="h-10 md:h-14 w-3/4 mx-auto bg-muted rounded mb-4" />
            <Skeleton className="h-10 md:h-14 w-1/2 mx-auto bg-muted rounded" />

            {/* Meta Info */}
            <div className="flex justify-center gap-6 mt-6">
              <Skeleton className="h-4 w-32 bg-muted rounded" />
              <Skeleton className="h-4 w-24 bg-muted rounded" />
              <Skeleton className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-5 w-full bg-muted rounded" />
        <Skeleton className="h-5 w-5/6 bg-muted rounded" />
        <Skeleton className="h-5 w-4/6 bg-muted rounded" />

        <Skeleton className="h-64 w-full bg-muted rounded-2xl my-10" />

        <Skeleton className="h-5 w-full bg-muted rounded" />
        <Skeleton className="h-5 w-5/6 bg-muted rounded" />
        <Skeleton className="h-5 w-3/4 bg-muted rounded" />

        <Skeleton className="h-40 w-full bg-muted rounded-2xl my-10" />
      </section>

      {/* ================= AUTHOR SECTION ================= */}
      <section className="max-w-7xl mx-auto mt-10 border-t border-foreground/10 pt-12 px-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full bg-muted" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-muted rounded" />
            <Skeleton className="h-3 w-48 bg-muted rounded" />
          </div>
        </div>
      </section>

      {/* ================= SOCIAL SECTION ================= */}
      <section className="max-w-3xl mx-auto my-10 text-center space-y-4 px-4">
        <Skeleton className="h-6 w-48 mx-auto bg-muted rounded" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-9 w-24 bg-muted rounded-md" />
          <Skeleton className="h-9 w-24 bg-muted rounded-md" />
          <Skeleton className="h-9 w-24 bg-muted rounded-md" />
        </div>
      </section>

      {/* ================= RELATED BLOGS ================= */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <Skeleton className="h-6 w-40 bg-muted rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 bg-muted rounded-2xl" />
          <Skeleton className="h-64 bg-muted rounded-2xl" />
          <Skeleton className="h-64 bg-muted rounded-2xl" />
        </div>
      </section>

    </div>
  );
}