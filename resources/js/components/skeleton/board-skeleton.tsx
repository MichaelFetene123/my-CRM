import { Skeleton } from '@/components/ui/skeleton';

export function BoardSkeleton() {
    return (
        <div className="flex gap-4 min-w-max h-full">
            <Skeleton className="w-80 h-96 rounded-xl" />
            <Skeleton className="w-80 h-96 rounded-xl" />
            <Skeleton className="w-80 h-96 rounded-xl" />
            <Skeleton className="w-80 h-96 rounded-xl" />
        </div>
    );
}
