import { Head, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useForm } from 'react-hook-form';
import { useContact } from '@/hooks/contacts/use-contact';
import { useUpdateContact } from '@/hooks/contacts/use-update-contact';
import { Timeline } from '@/components/timeline/timeline';
import { ActivityForm } from '@/components/activities/activity-form';
import { NoteForm } from '@/components/notes/note-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2Icon } from 'lucide-react';
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
import contacts from '@/routes/contacts';
import type {
    Contact,
    Lead,
    Opportunity,
    BreadcrumbItem,
    Note,
    Activity,
} from '@/types';

interface Props {
    contact: Contact & {
        leads: Lead[];
        opportunities: Opportunity[];
        notes: Note[];
        activities: Activity[];
    };
}

export default function ContactShow({ contact: initialContact }: Props) {
    const { data } = useContact(initialContact.id, initialContact);
    const contact = data || initialContact;
    const { mutate, isPending } = useUpdateContact(contact.id);
    const [open, setOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: contact.name,
            company: contact.company || '',
            email: contact.email || '',
            phone: contact.phone || '',
        },
    });

    const onSubmit = (formData: any) => {
        mutate(
            { id: contact.id, ...formData },
            {
                onSuccess: () => setOpen(false),
                onError: (error) => {
                    if (error.errors) {
                        Object.entries(error.errors).forEach(
                            ([key, messages]) => {
                                setError(key as any, {
                                    type: 'server',
                                    message: messages[0],
                                });
                            },
                        );
                    }
                },
            },
        );
    };

    const statusVariant: Record<string, any> = {
        prospect: 'info',
        customer: 'success',
        inactive: 'secondary',
    };

    const leadStatusVariant: Record<string, any> = {
        new: 'info',
        qualified: 'warning',
        converted: 'success',
        discarded: 'secondary',
    };

    const oppStatusVariant: Record<string, any> = {
        open: 'info',
        won: 'success',
        lost: 'destructive',
    };

    return (
        <>
            <Head title={contact.name} />
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">
                            {contact.name}
                        </h1>
                        <Badge
                            variant={statusVariant[contact.status] || 'default'}
                        >
                            {contact.status}
                        </Badge>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button variant="outline" />}>
                            Edit Contact
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Contact</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name')} />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-destructive">
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
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.email.message as string}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" {...register('phone')} />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && (
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Company
                            </p>
                            <p className="font-medium">
                                {contact.company || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Email
                            </p>
                            <p className="font-medium">
                                {contact.email || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-sm font-medium text-muted-foreground">
                                Phone
                            </p>
                            <p className="font-medium">
                                {contact.phone || '—'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-base font-semibold">
                                Leads ({contact.leads.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {contact.leads.length === 0 ? (
                                <p className="p-6 pt-0 text-sm text-muted-foreground">
                                    No leads associated with this contact.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lead Name</TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contact.leads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="font-medium">
                                                    {lead.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={
                                                            leadStatusVariant[
                                                                lead.status
                                                            ] || 'default'
                                                        }
                                                    >
                                                        {lead.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-base font-semibold">
                                Opportunities ({contact.opportunities.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {contact.opportunities.length === 0 ? (
                                <p className="p-6 pt-0 text-sm text-muted-foreground">
                                    No opportunities associated with this
                                    contact.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contact.opportunities.map((opp) => (
                                            <TableRow key={opp.id}>
                                                <TableCell className="font-medium">
                                                    {opp.title}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={
                                                            oppStatusVariant[
                                                                opp.status
                                                            ] || 'default'
                                                        }
                                                    >
                                                        {opp.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline (Notes + Activities) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Timeline</CardTitle>
                        <div className="flex gap-2">
                            <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
                                <DialogTrigger
                                    render={
                                        <Button size="sm" variant="outline" />
                                    }
                                >
                                    Add Note
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>New Note</DialogTitle>
                                    </DialogHeader>
                                    <NoteForm
                                        entityType="contact"
                                        entityId={contact.id}
                                        onSuccess={() => {
                                            setNoteOpen(false);
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Dialog open={activityOpen} onOpenChange={setActivityOpen}>
                                <DialogTrigger
                                    render={
                                        <Button size="sm" variant="outline" />
                                    }
                                >
                                    Add Activity
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>New Activity</DialogTitle>
                                    </DialogHeader>
                                    <ActivityForm
                                        entityType="contact"
                                        entityId={contact.id}
                                        onSuccess={() => {
                                            setActivityOpen(false);
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Timeline notes={contact.notes} activities={contact.activities} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function ShowLayout({ children }: { children: React.ReactNode }) {
    const { contact } = usePage<any>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Contacts', href: contacts.index().url },
        {
            title: contact?.name || 'Contact',
            href: contacts.show(contact?.id || 0).url,
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

ContactShow.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
