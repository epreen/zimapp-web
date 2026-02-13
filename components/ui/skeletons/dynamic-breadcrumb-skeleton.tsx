import { Skeleton } from '../skeleton'

const DynamicBreadcrumbSkeleton = () => {
    return (
        <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" />
                <span className="text-foreground/40">/</span>
            <Skeleton className="h-4 w-16" />
        </div>
    )
}

export default DynamicBreadcrumbSkeleton