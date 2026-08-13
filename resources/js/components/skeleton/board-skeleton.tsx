import { Skeleton } from '@/components/ui/skeleton';

export function BoardSkeleton() {
    return (
        <div className="flex h-full min-w-max gap-4">
            <Skeleton className="h-96 w-80 rounded-xl" />
            <Skeleton className="h-96 w-80 rounded-xl" />
            <Skeleton className="h-96 w-80 rounded-xl" />
            <Skeleton className="h-96 w-80 rounded-xl" />
        </div>
    );
}
