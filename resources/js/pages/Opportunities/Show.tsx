import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import opportunities from '@/routes/opportunities';
import type { Opportunity, Contact, PipelineStage, Note, Activity, BreadcrumbItem } from '@/types';

interface Props {
    opportunity: Opportunity & {
        contact: Contact;
        stage: PipelineStage;
        notes: Note[];
        activities: Activity[];
    };
}

export default function OpportunityShow({ opportunity }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Opportunities', href: opportunities.index().url },
        { title: opportunity.title, href: opportunities.show(opportunity.id).url },
    ];

    const [lostOpen, setLostOpen] = useState(false);
    const lostForm = useForm({ reason: '' });

    function markWon() {
        router.post(opportunities.won(opportunity.id).url, {}, { preserveScroll: true });
    }

    function submitLost(e: React.FormEvent) {
        e.preventDefault();
        lostForm.post(opportunities.lost(opportunity.id).url, {
            onSuccess: () => {
                lostForm.reset();
                setLostOpen(false);
            },
        });
    }

    const isOpen = opportunity.status === 'open';

    const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
        open: 'default',
        won: 'secondary',
        lost: 'destructive',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={opportunity.title} />
            <div className="p-6 space-y-6 max-w-3xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{opportunity.title}</h1>
                        <p className="text-sm text-muted-foreground">{opportunity.contact.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={statusVariant[opportunity.status]} className="capitalize">
                            {opportunity.status}
                        </Badge>
                        {opportunity.status.toLowerCase() !== opportunity.stage.name.toLowerCase() && (
                            <Badge variant="outline">{opportunity.stage.name}</Badge>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="flex gap-2">
                        <Button onClick={markWon}>Mark Won</Button>
                        <Dialog open={lostOpen} onOpenChange={setLostOpen}>
                            <DialogTrigger render={<Button variant="destructive" />}>
                                Mark Lost
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Mark as Lost</DialogTitle></DialogHeader>
                                <form onSubmit={submitLost} className="space-y-4">
                                    <div>
                                        <Label htmlFor="reason">Reason</Label>
                                        <Textarea
                                            id="reason"
                                            value={lostForm.data.reason}
                                            onChange={(e) => lostForm.setData('reason', e.target.value)}
                                        />
                                        {lostForm.errors.reason && (
                                            <p className="text-sm text-destructive">{lostForm.errors.reason}</p>
                                        )}
                                    </div>
                                    <Button type="submit" variant="destructive" disabled={lostForm.processing}>
                                        Confirm Lost
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {opportunity.status === 'lost' && opportunity.lost_reason && (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Lost reason:</span> {opportunity.lost_reason}
                    </p>
                )}

                {/* Timeline (Notes + Activities) — full component built in Phase 8 */}
                <div>
                    <h2 className="text-lg font-medium mb-2">Timeline</h2>
                    <ul className="space-y-2">
                        {opportunity.notes.map((note) => (
                            <li key={`note-${note.id}`} className="text-sm border-l-2 pl-3 py-1">
                                {note.is_system_generated && (
                                    <Badge variant="secondary" className="mr-2 uppercase text-[10px] tracking-wider">
                                        System
                                    </Badge>
                                )}
                                <span className={note.is_system_generated ? "text-muted-foreground" : ""}>
                                    {note.body}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
