import { Skeleton } from "@/components/ui/skeleton";

export function HeaderUserSkeleton() {
    return (
        <>
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex items-center justify-center gap-2.5 py-2 px-3">
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </>
    )
};