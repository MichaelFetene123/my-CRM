import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLeads } from '@/hooks/leads/use-leads';
import { useCreateLead } from '@/hooks/leads/use-create-lead';
import { TableSkeleton } from '@/components/skeleton/table-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import leadsRoute from '@/routes/leads';
import type { Lead, PaginatedData, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Leads', href: leadsRoute.index().url }];

export default function LeadsIndex() {
    const [open, setOpen] = useState(false);
    
    const { data: leads, isLoading } = useLeads();
    const { mutate, isPending } = useCreateLead();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            source: '',
        },
    });

    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: (error) => {
                if (error.errors) {
                    Object.entries(error.errors).forEach(([key, messages]) => {
                        setError(key as any, { type: 'server', message: messages[0] });
                    });
                }
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
            <Head title="Leads" />
            <div className="p-6 space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Leads</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Lead
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Lead</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name')} />
                                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message as string}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message as string}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="source">Source</Label>
                                    <Input id="source" {...register('source')} />
                                    {errors.source && <p className="text-sm text-destructive mt-1">{errors.source.message as string}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isPending}>Save Lead</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead className="pr-6 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leads?.data?.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="pl-6 font-medium">
                                                {lead.name}
                                            </TableCell>
                                            <TableCell>{lead.email ?? '—'}</TableCell>
                                            <TableCell>{lead.source ?? '—'}</TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Badge variant={statusVariant[lead.status] || 'default'}>{lead.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!leads?.data || leads.data.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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
