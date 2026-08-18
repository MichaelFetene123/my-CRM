import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useLeads } from '@/hooks/leads/use-leads';
import { useDeleteLead } from '@/hooks/leads/use-delete-lead';
import { TableSkeleton } from '@/components/skeleton/table-skeleton';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import leadsRoute from '@/routes/leads';
import type { Lead, PaginatedData, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { usePermissions } from '@/hooks/use-permissions';
import { LeadForm } from '@/components/leads/lead-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Leads', href: leadsRoute.index().url },
];

export default function LeadsIndex() {
    const [open, setOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<number | null>(null);
    const { hasPermission } = usePermissions();

    const { data: leads, isLoading } = useLeads();
    const { mutate: deleteLead, isPending: deletePending } = useDeleteLead();

    const handleDelete = () => {
        if (leadToDelete) {
            deleteLead(leadToDelete, {
                onSuccess: () => setLeadToDelete(null)
            });
        }
    };

    const statusVariant: Record<string, any> = {
        new: 'info',
        qualified: 'warning',
        converted: 'success',
        discarded: 'secondary',
    };

    return (
        <>
            <Head title="Leads" />
            <Dialog open={leadToDelete !== null} onOpenChange={(isOpen) => !isOpen && setLeadToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Lead</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this lead? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLeadToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deletePending}>
                            {deletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="w-full space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Leads</h1>
                    {hasPermission('leads.create') && (
                        <Dialog open={open} onOpenChange={(isOpen) => {
                            if (!isOpen) setEditingLead(null);
                            setOpen(isOpen);
                        }}>
                            <DialogTrigger
                                render={
                                    <Button onClick={() => setEditingLead(null)}>
                                        New Lead
                                    </Button>
                                }
                            />
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingLead ? 'Edit Lead' : 'New Lead'}</DialogTitle>
                                </DialogHeader>
                                <LeadForm
                                    lead={editingLead || undefined}
                                    onSuccess={() => setOpen(false)}
                                    onCancel={() => setOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">
                                            Name
                                        </TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead className="text-right">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-12.5 pr-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leads?.data?.map((lead) => (
                                        <TableRow 
                                            key={lead.id}
                                            className="cursor-pointer"
                                            onClick={() => router.visit(leadsRoute.show(lead.id).url)}
                                        >
                                            <TableCell className="pl-6 font-medium">
                                                {lead.name}
                                            </TableCell>
                                            <TableCell>
                                                {lead.email ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {lead.source ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            lead.status
                                                        ] || 'default'
                                                    }
                                                >
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                    />
                                                    <DropdownMenuContent align="end">
                                                        {hasPermission('leads.update') && (
                                                            <DropdownMenuItem onClick={() => {
                                                                setEditingLead(lead);
                                                                setOpen(true);
                                                            }}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {hasPermission('leads.delete') && (
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setLeadToDelete(lead.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!leads?.data ||
                                        leads.data.length === 0) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No leads found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LeadsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
