import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ContactLoading = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 rounded w-12" />
            <Skeleton className="h-4 rounded w-4" />
            <Skeleton className="h-4 rounded w-16" />
          </div>
        </div>

        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-8 lg:h-12 rounded w-64 mx-auto mb-4" />
          <Skeleton className="h-4 rounded w-96 mx-auto" />
          <Skeleton className="h-4 rounded w-80 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <Skeleton className="h-6 rounded w-48 mb-6" />

              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="w-11 h-11 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 rounded w-24 mb-1" />
                      <Skeleton  className="h-3 rounded w-32 mb-1" />
                      <Skeleton className="h-3 rounded w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
              <Skeleton className="h-6 rounded w-48 mb-6" />

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-4 rounded w-20 mb-2" />
                    <Skeleton className="h-12 rounded" />
                  </div>
                  <div>
                    <Skeleton className="h-4 rounded w-24 mb-2" />
                    <Skeleton className="h-12 rounded" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-4 rounded w-16 mb-2" />
                  <Skeleton className="h-12 rounded" />
                </div>

                <div>
                  <Skeleton className="h-4 rounded w-20 mb-2" />
                  <Skeleton className="h-32 rounded" />
                </div>

                <Skeleton className="h-12 rounded w-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center mt-12">
          <div className="flex items-center gap-2 text-gofarm-green">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading contact page...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactLoading;
