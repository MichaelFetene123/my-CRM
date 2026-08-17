import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useOpportunity } from '@/hooks/opportunities/use-opportunity';
import { useWonOpportunity } from '@/hooks/opportunities/use-won-opportunity';
import { useLostOpportunity } from '@/hooks/opportunities/use-lost-opportunity';
import { useDeleteOpportunity } from '@/hooks/opportunities/use-delete-opportunity';
import { useReopenOpportunity } from '@/hooks/opportunities/use-reopen-opportunity';
import AppLayout from '@/layouts/app-layout';
import { Timeline } from '@/components/timeline/timeline';
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
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import opportunities from '@/routes/opportunities';
import type {
    Opportunity,
    Contact,
    PipelineStage,
    Note,
    Activity,
    BreadcrumbItem,
} from '@/types';

interface Props {
    opportunity: Opportunity & {
        contact: Contact;
        stage: PipelineStage;
        notes: Note[];
        activities: Activity[];
    };
}

export default function OpportunityShow({
    opportunity: initialOpportunity,
}: Props) {
    const { data: opportunity = initialOpportunity } = useOpportunity(
        initialOpportunity.id,
        initialOpportunity,
    );
    const { mutate: markWonMutate, isPending: isWinning } = useWonOpportunity();
    const { mutate: markLostMutate, isPending: isLosing } =
        useLostOpportunity();
    const { mutate: deleteMutate, isPending: isDeleting } = useDeleteOpportunity();
    const { mutate: reopenMutate, isPending: isReopening } = useReopenOpportunity();

    const [lostOpen, setLostOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);

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

    function reopen() {
        reopenMutate({ id: opportunity.id });
    }

    const submitLost = (formData: any) => {
        markLostMutate(
            { id: opportunity.id, reason: formData.reason },
            {
                onSuccess: () => {
                    reset();
                    setLostOpen(false);
                },
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

    const isOpen = opportunity.status === 'open';

    const statusVariant: Record<
        string,
        'default' | 'secondary' | 'destructive'
    > = {
        open: 'default',
        won: 'secondary',
        lost: 'destructive',
    };

    return (
        <>
            <Head title={opportunity.title} />
            <div className="max-w-3xl space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {opportunity.title}
                        </h1>
                        <p className="text-base text-muted-foreground">
                            {opportunity.contact?.name}
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Badge
                            variant={statusVariant[opportunity.status]}
                            className="capitalize"
                        >
                            {opportunity.status}
                        </Badge>
                        {opportunity.stage &&
                            opportunity.status.toLowerCase() !==
                                opportunity.stage.name.toLowerCase() && (
                                <Badge variant="outline">
                                    {opportunity.stage.name}
                                </Badge>
                            )}

                        <Dialog>
                            <DialogTrigger
                                render={
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        disabled={isDeleting}
                                    />
                                }
                            >
                                <Trash2 className="h-4 w-4" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Delete Opportunity</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this opportunity? This will permanently delete the opportunity and all of its associated notes and activities. This action cannot be undone.
                                </DialogDescription>
                                <DialogFooter className="gap-2 sm:justify-end">
                                    <DialogClose
                                        render={<Button variant="secondary" />}
                                    >
                                        Cancel
                                    </DialogClose>
                                    <DialogClose
                                        render={
                                            <Button
                                                variant="destructive"
                                                onClick={() => deleteMutate({ id: opportunity.id })}
                                            />
                                        }
                                    >
                                        Delete
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isOpen && (
                    <div className="flex gap-2">
                        <Button onClick={markWon} disabled={isWinning}>
                            {isWinning && (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            )}
                            Mark Won
                        </Button>
                        <Dialog open={lostOpen} onOpenChange={setLostOpen}>
                            <DialogTrigger
                                render={<Button variant="destructive" />}
                            >
                                Mark Lost
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Mark as Lost</DialogTitle>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit(submitLost)}
                                    className="space-y-4"
                                >
                                    <div>
                                        <Label htmlFor="reason">Reason</Label>
                                        <Textarea
                                            id="reason"
                                            {...register('reason')}
                                        />
                                        {errors.reason && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.reason
                                                        .message as string
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={isLosing}
                                    >
                                        {isLosing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Confirm Lost
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {!isOpen && (
                    <div className="flex gap-2">
                        <Button onClick={reopen} disabled={isReopening} variant="outline">
                            {isReopening && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Reopen Opportunity
                        </Button>
                    </div>
                )}

                {opportunity.status === 'lost' && opportunity.lost_reason && (
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Lost reason:</span>{' '}
                        {opportunity.lost_reason}
                    </p>
                )}

                {/* Timeline (Notes + Activities) — full component built in Phase 8 */}
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
                                        entityType="opportunity"
                                        entityId={opportunity.id}
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
                                        entityType="opportunity"
                                        entityId={opportunity.id}
                                        onSuccess={() => {
                                            setActivityOpen(false);
                                        }}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Timeline notes={opportunity.notes} activities={opportunity.activities} />
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
        {
            title: opportunity?.title || 'Opportunity',
            href: opportunities.show(opportunity?.id || 0).url,
        },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

OpportunityShow.layout = (page: React.ReactNode) => (
    <ShowLayout>{page}</ShowLayout>
);
