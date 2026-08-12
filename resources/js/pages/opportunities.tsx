import { Head, Link, useForm, router, Deferred } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { StageColumn } from '@/components/pipeline-board/stage-column';
import opportunitiesRoute from '@/routes/opportunities';
import type { Opportunity, PipelineStage, Contact, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Opportunities', href: opportunitiesRoute.index().url }];

interface Props {
    stages: (PipelineStage & { opportunities: Opportunity[] })[];
    contacts: { id: number; name: string }[];
}

export default function OpportunitiesIndex({ stages, contacts }: Props) {
    // -----------------------------------------------------
    // Create Opportunity Form State
    // -----------------------------------------------------
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        contact_id: '',
        stage_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(opportunitiesRoute.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

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

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    function findOpp(id: number): { opp: Opportunity; stageIndex: number } | null {
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
            const next = prev.map((s) => ({ ...s, opportunities: [...s.opportunities] }));
            next[found.stageIndex].opportunities = next[found.stageIndex].opportunities.filter((o) => o.id !== oppId);
            next[targetStageIndex].opportunities = [...next[targetStageIndex].opportunities, { ...found.opp, stage_id: targetStage.id }];
            return next;
        });

        router.post(
            opportunitiesRoute.move(oppId).url,
            { stage_id: targetStage.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // server confirmed — refetch to sync stage_entered_at, system note, etc.
                    router.reload({ only: ['stages'] });
                },
                onError: () => {
                    // rollback on rejection (e.g. terminal opportunity guard)
                    setBoard(previousBoard);
                },
            }
        );
    }

    return (
        <>
            <Head title="Opportunities" />
            <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Opportunities Pipeline</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Opportunity
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Opportunity</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="contact_id">Contact</Label>
                                    <Select value={data.contact_id} onValueChange={(val) => setData('contact_id', val ?? '')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.contact_id && <p className="text-sm text-destructive mt-1">{errors.contact_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="stage_id">Pipeline Stage</Label>
                                    <Select value={data.stage_id} onValueChange={(val) => setData('stage_id', val ?? '')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select initial stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stages?.map((stage) => (
                                                <SelectItem key={stage.id} value={stage.id.toString()}>{stage.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.stage_id && <p className="text-sm text-destructive mt-1">{errors.stage_id}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>Save</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Deferred data="stages" fallback={<BoardSkeleton />}>
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="flex-1 overflow-x-auto pb-4">
                            <div className="flex gap-4 min-w-max h-full">
                                {board.map((stage) => (
                                    <StageColumn key={stage.id} stage={stage} opportunities={stage.opportunities} />
                                ))}
                            </div>
                        </div>
                        <DragOverlay>
                            {activeOpp && (
                                <Card className="w-65 opacity-80 cursor-grabbing border-primary">
                                    <CardContent className="p-4">
                                        <p className="font-medium">{activeOpp.title}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </DragOverlay>
                    </DndContext>
                </Deferred>
            </div>
        </>
    );
}

OpportunitiesIndex.layout = {
    breadcrumbs,
};
