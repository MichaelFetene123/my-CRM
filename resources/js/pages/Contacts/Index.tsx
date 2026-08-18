import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useContacts } from '@/hooks/contacts/use-contacts';
import { useCreateContact } from '@/hooks/contacts/use-create-contact';
import { useUpdateContact } from '@/hooks/contacts/use-update-contact';
import { useDeleteContact } from '@/hooks/contacts/use-delete-contact';
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
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Loader2Icon, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import contacts from '@/routes/contacts';
import type { Contact, PaginatedData, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Contacts', href: contacts.index().url },
];

import { usePermissions } from '@/hooks/use-permissions';

export default function Contacts() {
    const [open, setOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [contactToDelete, setContactToDelete] = useState<number | null>(null);
    const { hasPermission } = usePermissions();

    const { data: contactList, isLoading } = useContacts();
    const { mutate: createContact, isPending: isCreating } = useCreateContact();
    const { mutate: updateContact, isPending: isUpdating } = useUpdateContact(editingContact?.id || 0);
    const { mutate: deleteContact, isPending: deletePending } = useDeleteContact();
    const isPending = isCreating || isUpdating;

    const handleDelete = () => {
        if (contactToDelete) {
            deleteContact({ id: contactToDelete }, {
                onSuccess: () => setContactToDelete(null)
            });
        }
    };

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

    useEffect(() => {
        if (editingContact) {
            reset({
                name: editingContact.name,
                company: editingContact.company || '',
                email: editingContact.email || '',
                phone: editingContact.phone || '',
            });
        } else {
            reset({ name: '', company: '', email: '', phone: '' });
        }
    }, [editingContact, reset]);

    const onSubmit = (formData: any) => {
        const handler = editingContact ? updateContact : createContact;
        const payload = editingContact ? { id: editingContact.id, ...formData } : formData;

        handler(payload, {
            onSuccess: () => {
                reset({ name: '', company: '', email: '', phone: '' });
                setOpen(false);
                setEditingContact(null);
            },
            onError: (error) => {
                if (error.errors) {
                    Object.entries(error.errors).forEach(([key, messages]) => {
                        setError(key as any, {
                            type: 'server',
                            message: messages[0],
                        });
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
            <Dialog open={contactToDelete !== null} onOpenChange={(isOpen) => !isOpen && setContactToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Contact</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this contact? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setContactToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deletePending}>
                            {deletePending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Contacts</h1>
                    {hasPermission('contacts.create') && (
                        <Dialog open={open} onOpenChange={(isOpen) => {
                            if (!isOpen) setEditingContact(null);
                            setOpen(isOpen);
                        }}>
                            <DialogTrigger render={<Button onClick={() => setEditingContact(null)}>
                                New Contact
                            </Button>} />
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingContact ? 'Edit Contact' : 'New Contact'}</DialogTitle>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" {...register('name')} />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">
                                                {errors.name.message as string}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="company">Company</Label>
                                        <Input
                                            id="company"
                                            {...register('company')}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email.message as string}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" {...register('phone')} />
                                    </div>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && (
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Save
                                    </Button>
                                </form>
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
                                        <TableHead>Company</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="pr-6 text-right">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-12.5 pr-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contactList?.data?.map((contact) => (
                                        <TableRow
                                            key={contact.id}
                                            className="h-12 cursor-pointer transition-colors hover:bg-muted/50"
                                            onClick={() =>
                                                router.visit(
                                                    contacts.show(contact.id)
                                                        .url,
                                                )
                                            }
                                        >
                                            <TableCell className="pl-6 font-medium">
                                                {contact.name}
                                            </TableCell>
                                            <TableCell>
                                                {contact.company ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {contact.email ?? '—'}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            contact.status
                                                        ] || 'default'
                                                    }
                                                >
                                                    {contact.status}
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
                                                        {hasPermission('contacts.update') && (
                                                            <DropdownMenuItem onClick={() => {
                                                                setEditingContact(contact);
                                                                setOpen(true);
                                                            }}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {hasPermission('contacts.delete') && (
                                                            <DropdownMenuItem 
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => setContactToDelete(contact.id)}
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
                                    {(!contactList?.data ||
                                        contactList.data.length === 0) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center text-muted-foreground"
                                            >
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
