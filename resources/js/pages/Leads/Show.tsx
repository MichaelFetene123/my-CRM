import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import leadsRoute from '@/routes/leads';
import type { Lead, BreadcrumbItem } from '@/types';

interface Props {
    lead: Lead & {
        contact: any;
        owner: any;
    };
}

export default function LeadShow({ lead }: Props) {
    const statusVariant: Record<string, any> = {
        new: 'info',
        qualified: 'warning',
        converted: 'success',
        discarded: 'secondary',
    };

    return (
        <>
            <Head title={lead.name} />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">
                            {lead.name}
                        </h1>
                        <Badge
                            variant={statusVariant[lead.status] || 'default'}
                        >
                            {lead.status}
                        </Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Lead Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Email
                            </p>
                            <p className="font-medium">
                                {lead.email || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Source
                            </p>
                            <p className="font-medium">
                                {lead.source || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Owner
                            </p>
                            <p className="font-medium">
                                {lead.owner?.name || '—'}
                            </p>
                        </div>
                        {lead.contact && (
                            <div>
                                <p className="mb-1 text-sm font-medium text-muted-foreground">
                                    Contact
                                </p>
                                <p className="font-medium">
                                    {lead.contact.name || '—'}
                                </p>
                            </div>
                        )}
                        {lead.discard_reason && (
                            <div className="col-span-full">
                                <p className="mb-1 text-sm font-medium text-muted-foreground">
                                    Discard Reason
                                </p>
                                <p className="font-medium">
                                    {lead.discard_reason}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function ShowLayout({ children }: { children: React.ReactNode }) {
    const { lead } = usePage<any>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leads', href: leadsRoute.index().url },
        {
            title: lead?.name || 'Lead',
            href: leadsRoute.show(lead?.id || 0).url,
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

LeadShow.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
