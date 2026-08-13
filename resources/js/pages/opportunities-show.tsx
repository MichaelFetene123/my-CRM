import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOpportunity } from '@/hooks/opportunities/use-opportunity';
import { useWonOpportunity } from '@/hooks/opportunities/use-won-opportunity';
import { useLostOpportunity } from '@/hooks/opportunities/use-lost-opportunity';
import AppLayout from '@/layouts/app-layout';
import { mergeTimeline, TimelineItem } from '@/components/timeline/timeline-item';
import { ActivityForm } from '@/components/activities/activity-form';
import { NoteForm } from '@/components/notes/note-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function OpportunityShow({ opportunity: initialOpportunity }: Props) {
    const { data: opportunity = initialOpportunity } = useOpportunity(initialOpportunity.id, initialOpportunity);
    const { mutate: markWonMutate } = useWonOpportunity();
    const { mutate: markLostMutate, isPending: isLosing } = useLostOpportunity();

    const [lostOpen, setLostOpen] = useState(false);
    
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            reason: '',
        },
    });

    function markWon() {
        markWonMutate({ id: opportunity.id });
    }

    const submitLost = (formData: any) => {
        markLostMutate({ id: opportunity.id, reason: formData.reason }, {
            onSuccess: () => {
                reset();
                setLostOpen(false);
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

    const isOpen = opportunity.status === 'open';

    const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
        open: 'default',
        won: 'secondary',
        lost: 'destructive',
    };

    return (
        <>
            <Head title={opportunity.title} />
            <div className="p-6 space-y-6 max-w-3xl">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{opportunity.title}</h1>
                        <p className="text-base text-muted-foreground">{opportunity.contact?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={statusVariant[opportunity.status]} className="capitalize">
                            {opportunity.status}
                        </Badge>
                        {opportunity.stage && opportunity.status.toLowerCase() !== opportunity.stage.name.toLowerCase() && (
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
                                <form onSubmit={handleSubmit(submitLost)} className="space-y-4">
                                    <div>
                                        <Label htmlFor="reason">Reason</Label>
                                        <Textarea id="reason" {...register('reason')} />
                                        {errors.reason && (
                                            <p className="text-sm text-destructive">{errors.reason.message as string}</p>
                                        )}
                                    </div>
                                    <Button type="submit" variant="destructive" disabled={isLosing}>
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Timeline</CardTitle>
                        <div className="flex gap-2">
                            <Dialog>
                                <DialogTrigger render={<Button size="sm" variant="outline" />}>Add Note</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>New Note</DialogTitle></DialogHeader>
                                    <NoteForm
                                        entityType="opportunity"
                                        entityId={opportunity.id}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger render={<Button size="sm" variant="outline" />}>Add Activity</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>New Activity</DialogTitle></DialogHeader>
                                    <ActivityForm
                                        entityType="opportunity"
                                        entityId={opportunity.id}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {opportunity.notes.length === 0 && opportunity.activities.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No timeline entries yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {mergeTimeline(opportunity.notes, opportunity.activities).map((entry) => (
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
    const { opportunity } = usePage<any>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Opportunities', href: opportunities.index().url },
        { title: opportunity?.title || 'Opportunity', href: opportunities.show(opportunity?.id || 0).url },
    ];
    
    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

OpportunityShow.layout = (page: React.ReactNode) => <ShowLayout>{page}</ShowLayout>;
