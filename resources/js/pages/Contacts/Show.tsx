import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import contacts from '@/routes/contacts';
import type { Contact, Lead, Opportunity, BreadcrumbItem } from '@/types';

interface Props {
    contact: Contact & { leads: Lead[]; opportunities: Opportunity[] };
}

export default function ContactShow({ contact }: Props) {
    const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
        prospect: 'outline',
        customer: 'default',
        inactive: 'secondary',
    };

    return (
        <>
            <Head title={contact.name} />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{contact.name}</h1>
                    <Badge variant={statusVariant[contact.status]}>{contact.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Company:</span> {contact.company ?? '—'}</div>
                    <div><span className="text-muted-foreground">Email:</span> {contact.email ?? '—'}</div>
                    <div><span className="text-muted-foreground">Phone:</span> {contact.phone ?? '—'}</div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-2">Leads ({contact.leads.length})</h2>
                    {contact.leads.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
                    <ul className="space-y-1">
                        {contact.leads.map((lead) => (
                            <li key={lead.id} className="text-sm">
                                {lead.name} — <Badge variant="outline">{lead.status}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-2">Opportunities ({contact.opportunities.length})</h2>
                    {contact.opportunities.length === 0 && <p className="text-sm text-muted-foreground">No opportunities yet.</p>}
                    <ul className="space-y-1">
                        {contact.opportunities.map((opp) => (
                            <li key={opp.id} className="text-sm">
                                {opp.title} — <Badge variant="outline">{opp.status}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
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
