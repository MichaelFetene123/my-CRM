import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <>
            <Head title="Activities" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
                <div className="rounded-md border border-sidebar-border/70 bg-sidebar p-6">
                    <p className="text-muted-foreground">Placeholder page</p>
                </div>
            </div>
        </>
    );
}
