import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useOpportunitiesStages } from '@/hooks/opportunities/use-opportunities-stages';
import { useCreateOpportunity } from '@/hooks/opportunities/use-create-opportunity';
import { useMoveOpportunity } from '@/hooks/opportunities/use-move-opportunity';
import { BoardSkeleton } from '@/components/skeleton/board-skeleton';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2Icon } from 'lucide-react';
import { StageColumn } from '@/components/pipeline-board/stage-column';
import opportunitiesRoute from '@/routes/opportunities';
import type {
    Opportunity,
    PipelineStage,
    Contact,
    BreadcrumbItem,
} from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Opportunities', href: opportunitiesRoute.index().url },
];

export default function OpportunitiesIndex({
    contacts,
}: {
    contacts: { id: number; name: string }[];
}) {
    const { data: stages, isLoading } = useOpportunitiesStages();
    const { mutate: createOpportunity, isPending: isCreating } =
        useCreateOpportunity();
    const { mutate: moveOpportunity } = useMoveOpportunity();

    // -----------------------------------------------------
    // Create Opportunity Form State
    // -----------------------------------------------------
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            contact_id: '',
            stage_id: '',
        },
    });

    const onSubmit = (formData: any) => {
        createOpportunity(formData, {
            onSuccess: () => {
                reset();
                setOpen(false);
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

    // -----------------------------------------------------
    // Drag and Drop Board State
    // -----------------------------------------------------
    // Local optimistic copy — lets the card move instantly, independent of the next Inertia reload
    const [board, setBoard] = useState(stages || []);
    const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);

    useEffect(() => {
        if (stages) {
            setBoard(stages);
        }
    }, [stages]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    function findOpp(
        id: number,
    ): { opp: Opportunity; stageIndex: number } | null {
        for (let i = 0; i < board.length; i++) {
            const opp = board[i].opportunities.find((o) => o.id === id);
            if (opp) return { opp, stageIndex: i };
        }
        return null;
    }

    function handleDragStart(event: DragStartEvent) {
        const found = findOpp(Number(event.active.id));
        if (found) setActiveOpp(found.opp);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveOpp(null);
        const { active, over } = event;
        if (!over) return;

        const oppId = Number(active.id);
        const found = findOpp(oppId);
        if (!found) return;

        // over.id is either a stage id (dropped on empty column) or another opportunity's id (dropped on a card)
        let targetStageIndex = board.findIndex((s) => s.id === over.id);
        if (targetStageIndex === -1) {
            const overOpp = findOpp(Number(over.id));
            if (!overOpp) return;
            targetStageIndex = overOpp.stageIndex;
        }

        if (targetStageIndex === found.stageIndex) return; // dropped in same column, no-op

        const targetStage = board[targetStageIndex];
        const previousBoard = board;

        // Optimistic update: move card immediately
        setBoard((prev) => {
            const next = prev.map((s) => ({
                ...s,
                opportunities: [...s.opportunities],
            }));
            next[found.stageIndex].opportunities = next[
                found.stageIndex
            ].opportunities.filter((o) => o.id !== oppId);
            next[targetStageIndex].opportunities = [
                ...next[targetStageIndex].opportunities,
                { ...found.opp, stage_id: targetStage.id },
            ];
            return next;
        });

        moveOpportunity(
            { id: oppId, stage_id: targetStage.id },
            {
                onError: () => {
                    // rollback on rejection
                    setBoard(previousBoard);
                },
            },
        );
    }

    return (
        <>
            <Head title="Opportunities" />
            <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Opportunities Pipeline
                    </h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Opportunity
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Opportunity</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="mt-4 space-y-4"
                            >
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" {...register('title')} />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.title.message as string}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="contact_id">Contact</Label>
                                    <Select
                                        value={watch('contact_id')}
                                        onValueChange={(val) =>
                                            val && setValue('contact_id', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={c.id.toString()}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.contact_id && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {
                                                errors.contact_id
                                                    .message as string
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="stage_id">
                                        Pipeline Stage
                                    </Label>
                                    <Select
                                        value={watch('stage_id')}
                                        onValueChange={(val) =>
                                            val && setValue('stage_id', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select initial stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stages?.map((stage) => (
                                                <SelectItem
                                                    key={stage.id}
                                                    value={stage.id.toString()}
                                                >
                                                    {stage.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.stage_id && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.stage_id.message as string}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isCreating}>
                                        {isCreating && (
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <BoardSkeleton />
                ) : (
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex-1 overflow-x-auto pb-4">
                            <div className="flex h-full min-w-max gap-4">
                                {board.map((stage) => (
                                    <StageColumn
                                        key={stage.id}
                                        stage={stage}
                                        opportunities={stage.opportunities}
                                    />
                                ))}
                            </div>
                        </div>
                        <DragOverlay>
                            {activeOpp && (
                                <Card className="w-65 cursor-grabbing border-primary opacity-80">
                                    <CardContent className="p-4">
                                        <p className="font-medium">
                                            {activeOpp.title}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </>
    );
}

OpportunitiesIndex.layout = {
    breadcrumbs,
};
