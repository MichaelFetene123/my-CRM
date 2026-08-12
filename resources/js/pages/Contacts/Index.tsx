import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContacts } from '@/hooks/contacts/use-contacts';
import { useCreateContact } from '@/hooks/contacts/use-create-contact';
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
import contacts from '@/routes/contacts';
import type { Contact, PaginatedData, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Contacts', href: contacts.index().url }];

export default function Contacts() {
    const [open, setOpen] = useState(false);
    
    const { data: contactList, isLoading } = useContacts();
    const { mutate, isPending } = useCreateContact();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            company: '',
            email: '',
            phone: '',
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
        prospect: 'info',
        customer: 'success',
        inactive: 'secondary',
    };

    return (
        <>
            <Head title="Contacts" />
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Contacts</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Contact
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Contact</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name')} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="company">Company</Label>
                                    <Input id="company" {...register('company')} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email.message as string}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" {...register('phone')} />
                                </div>
                                <Button type="submit" disabled={isPending}>Save</Button>
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
                                        <TableHead>Company</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="pr-6 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contactList?.data?.map((contact) => (
                                        <TableRow 
                                            key={contact.id} 
                                            className="h-12 cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => router.visit(contacts.show(contact.id).url)}
                                        >
                                            <TableCell className="pl-6 font-medium">
                                                {contact.name}
                                            </TableCell>
                                            <TableCell>{contact.company ?? '—'}</TableCell>
                                            <TableCell>{contact.email ?? '—'}</TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Badge variant={statusVariant[contact.status] || 'default'}>{contact.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!contactList?.data || contactList.data.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                No contacts found.
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

Contacts.layout = {
    breadcrumbs,
};
