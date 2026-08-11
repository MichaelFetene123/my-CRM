import { Badge } from '@/components/ui/badge';

export function ReminderBadge({ count }: { count: number }) {
    if (count === 0) return null;
    return <Badge variant="destructive" className="ml-2">{count}</Badge>;
}