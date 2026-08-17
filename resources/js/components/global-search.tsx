import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGlobalSearch } from '@/hooks/use-search';
import { Loader2Icon, SearchIcon } from 'lucide-react';

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { data: results, isLoading } = useGlobalSearch(query);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleSelect = (url: string) => {
        setOpen(false);
        router.visit(url);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden p-0 shadow-lg top-[20%] translate-y-0">
                <div className="flex items-center border-b px-3">
                    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {isLoading && <Loader2Icon className="h-4 w-4 animate-spin opacity-50" />}
                </div>
                
                <div className="max-h-75 overflow-y-auto p-2">
                    {!query && (
                        <p className="p-4 text-center text-sm text-muted-foreground">
                            Search for contacts, leads, and opportunities...
                        </p>
                    )}
                    {query && !isLoading && Object.keys(results || {}).length === 0 && (
                        <p className="p-4 text-center text-sm text-muted-foreground">
                            No results found.
                        </p>
                    )}
                    {Object.entries(results || {}).map(([group, items]: [string, any]) => (
                        <div key={group} className="mb-2">
                            <h4 className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                {group}
                            </h4>
                            {items.map((item: any) => (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => handleSelect(item.url)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.title}</span>
                                        <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
