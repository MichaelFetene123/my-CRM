import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import leadsRoute from '@/routes/leads';
import type { Lead, BreadcrumbItem } from '@/types';
import { usePermissions } from '@/hooks/use-permissions';
import { Button } from '@/components/ui/button';
import { Edit, Loader2, Loader2Icon, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { LeadForm } from '@/components/leads/lead-form';
import { useDeleteLead } from '@/hooks/leads/use-delete-lead';

interface Props {
    lead: Lead & {
        contact: any;
        owner: any;
    };
}

export default function LeadShow({ lead }: Props) {
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { hasPermission } = usePermissions();
    const { mutate: deleteLead, isPending: deletePending } = useDeleteLead();

    const handleDelete = () => {
        deleteLead(lead.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(leadsRoute.index().url);
            },
        });
    };

    const statusVariant: Record<string, any> = {
        new: 'info',
        qualified: 'warning',
        converted: 'success',
        discarded: 'secondary',
    };

    return (
        <>
            <Head title={lead.name} />
            <div className="w-full space-y-6 p-6">
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
                    <div className="flex items-center gap-2">
                        {hasPermission('leads.update') && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger
                                    render={
                                        <Button variant="outline">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Lead
                                        </Button>
                                    }
                                />
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Lead</DialogTitle>
                                    </DialogHeader>
                                    <LeadForm
                                        lead={lead}
                                        onSuccess={() => {
                                            setOpen(false);
                                            router.reload({ only: ['lead'] });
                                        }}
                                        onCancel={() => setOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        {hasPermission('leads.delete') && (
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger
                                    render={
                                        <Button variant="destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Lead
                                        </Button>
                                    }
                                />
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Lead</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this lead? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={deletePending}>
                                            {deletePending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
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
