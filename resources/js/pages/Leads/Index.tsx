import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Lead } from '@/types/index';

type LeadsIndexProps = PageProps<{
    leads: {
        data: Lead[];
        current_page: number;
        last_page: number;
        // ... other pagination props
    };
}>;

export default function Index({ leads }: LeadsIndexProps) {
    return (
        <>
            <Head title="Leads" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                
                <div className="rounded-md border border-sidebar-border/70 bg-sidebar p-6">
                    <p className="text-muted-foreground">
                        You have {leads?.data?.length || 0} leads on this page.
                    </p>
                    {/* Add your leads table or list here */}
                </div>
            </div>
        </>
    );
}
