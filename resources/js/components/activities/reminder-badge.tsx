import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function useUnreadCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = () => {
            fetch('/notifications/unread-count')
                .then((res) => res.json())
                .then((data) => setCount(data.count))
                .catch(() => {});
        };
        fetchCount();
        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, []);

    return count;
}

export function ReminderBadge({ count }: { count: number }) {
    if (count === 0) return null;
    return <Badge variant="destructive" className="ml-2">{count}</Badge>;
}