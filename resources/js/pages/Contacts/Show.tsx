import { Head } from '@inertiajs/react';

export default function Show() {
    return (
        <>
            <Head title="Contact Details" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold tracking-tight">Contact Details</h1>
                <div className="rounded-md border border-sidebar-border/70 bg-sidebar p-6">
                    <p className="text-muted-foreground">Placeholder page for Contact details</p>
                </div>
            </div>
        </>
    );
}
