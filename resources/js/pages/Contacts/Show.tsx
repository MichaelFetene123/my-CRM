import { Head, usePage, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { mergeTimeline, TimelineItem } from '@/components/timeline/timeline-item';
import { ActivityForm } from '@/components/activities/activity-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { Contact, Lead, Opportunity, BreadcrumbItem, Note, Activity } from '@/types';

interface Props {
    contact: Contact & { leads: Lead[]; opportunities: Opportunity[]; notes: Note[]; activities: Activity[] };
}

export default function ContactShow({ contact }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: contact.name,
        company: contact.company || '',
        email: contact.email || '',
        phone: contact.phone || '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(contacts.update(contact.id).url, {
            onSuccess: () => setOpen(false),
        });
    }

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
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">{contact.name}</h1>
                        <Badge variant={statusVariant[contact.status] || 'default'}>{contact.status}</Badge>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button variant="outline" />}>
                            Edit Contact
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Contact</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>Save Changes</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Company</p>
                            <p className="font-medium">{contact.company || '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                            <p className="font-medium">{contact.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium">{contact.phone || '—'}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between py-4">
                            <CardTitle className="text-base font-semibold">Leads ({contact.leads.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {contact.leads.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-6 pt-0">No leads associated with this contact.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lead Name</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contact.leads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="font-medium">{lead.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={leadStatusVariant[lead.status] || 'default'}>{lead.status}</Badge>
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
                            <CardTitle className="text-base font-semibold">Opportunities ({contact.opportunities.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {contact.opportunities.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-6 pt-0">No opportunities associated with this contact.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contact.opportunities.map((opp) => (
                                            <TableRow key={opp.id}>
                                                <TableCell className="font-medium">{opp.title}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={oppStatusVariant[opp.status] || 'default'}>{opp.status}</Badge>
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
                        <Dialog>
                            <DialogTrigger render={<Button size="sm" variant="outline" />}>Add Activity</DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>New Activity</DialogTitle></DialogHeader>
                                <ActivityForm
                                    entityType="contact"
                                    entityId={contact.id}
                                    onSuccess={() => router.reload({ only: ['contact'] })}
                                />
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {contact.notes.length === 0 && contact.activities.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No timeline entries yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {mergeTimeline(contact.notes, contact.activities).map((entry) => (
                                    <TimelineItem key={`${entry.kind}-${entry.data.id}`} entry={entry} />
                                ))}
                            </ul>
                        )}
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
        { title: contact?.name || 'Contact', href: contacts.show(contact?.id || 0).url },
    ];
    
    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

ContactShow.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
