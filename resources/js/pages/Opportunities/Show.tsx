import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import opportunitiesRoute from '@/routes/opportunities';
import contactsRoute from '@/routes/contacts';
import type { Opportunity, BreadcrumbItem, Note, Activity } from '@/types';
import { Phone, Calendar, Mail, ClipboardList } from 'lucide-react';

export default function OpportunityShow({ opportunity }: { opportunity: Opportunity }) {
    const statusVariant: Record<string, any> = {
        open: 'info',
        won: 'success',
        lost: 'destructive',
    };

    return (
        <>
            <Head title={opportunity.title} />
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{opportunity.title}</h1>
                    <Badge variant={statusVariant[opportunity.status] || 'default'}>{opportunity.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Opportunity Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Stage</p>
                                    <Badge variant="secondary">{opportunity.stage?.name || '—'}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                                    <p className="font-medium text-sm">
                                        {new Date(opportunity.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {opportunity.contact ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                                        <Link href={contactsRoute.show(opportunity.contact.id).url} className="font-medium hover:underline">
                                            {opportunity.contact.name}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Company</p>
                                        <p className="font-medium text-sm">{opportunity.contact.company || '—'}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No contact associated.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="py-4 border-b">
                            <CardTitle className="text-base font-semibold">Activities ({opportunity.activities?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {(!opportunity.activities || opportunity.activities.length === 0) ? (
                                <p className="text-sm text-muted-foreground p-6 pt-4">No activities logged.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {opportunity.activities.map((activity: Activity) => (
                                            <TableRow key={activity.id}>
                                                <TableCell className="font-medium capitalize">
                                                    <div className="flex items-center gap-3">
                                                        {(() => {
                                                            switch (activity.type) {
                                                                case 'call':
                                                                    return (
                                                                        <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                                                                            <Phone className="w-4 h-4" />
                                                                        </div>
                                                                    );
                                                                case 'meeting':
                                                                    return (
                                                                        <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                                                                            <Calendar className="w-4 h-4" />
                                                                        </div>
                                                                    );
                                                                case 'email':
                                                                    return (
                                                                        <div className="p-2 rounded-md bg-purple-500/10 text-purple-500">
                                                                            <Mail className="w-4 h-4" />
                                                                        </div>
                                                                    );
                                                                case 'task':
                                                                    return (
                                                                        <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                                                                            <ClipboardList className="w-4 h-4" />
                                                                        </div>
                                                                    );
                                                                default:
                                                                    return null;
                                                            }
                                                        })()}
                                                        {activity.type}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{new Date(activity.due_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={activity.completed_at ? 'outline' : 'default'}>
                                                        {activity.completed_at ? 'Completed' : 'Pending'}
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
                        <CardHeader className="py-4 border-b">
                            <CardTitle className="text-base font-semibold">Notes ({opportunity.notes?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {(!opportunity.notes || opportunity.notes.length === 0) ? (
                                <p className="text-sm text-muted-foreground p-6 pt-4">No notes added.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Note</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {opportunity.notes.map((note: Note) => (
                                            <TableRow key={note.id}>
                                                <TableCell className="text-sm">{note.body}</TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function ShowLayout({ children }: { children: React.ReactNode }) {
    const { opportunity } = usePage<any>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Opportunities', href: opportunitiesRoute.index().url },
        { title: opportunity?.title || 'Opportunity', href: opportunitiesRoute.show(opportunity?.id || 0).url },
    ];
    
    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

OpportunityShow.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
