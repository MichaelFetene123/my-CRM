import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { Loader2Icon, Trash2Icon, PlusIcon, PencilIcon, XIcon, ArrowLeftIcon } from 'lucide-react';
import { usePipelineStages } from '@/hooks/pipeline-stages/use-pipeline-stages';
import { useCreateStage } from '@/hooks/pipeline-stages/use-create-stage';
import { useUpdateStage } from '@/hooks/pipeline-stages/use-update-stage';
import { useDeleteStage } from '@/hooks/pipeline-stages/use-delete-stage';
import { TableSkeleton } from '@/components/skeleton/table-skeleton';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import opportunitiesRoute from '@/routes/opportunities';

export default function OpportunitiesStages() {
    const [editingStageId, setEditingStageId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data: stages, isLoading } = usePipelineStages();
    const { mutate: createStage, isPending: isCreating } = useCreateStage();
    const { mutate: updateStage, isPending: isUpdating } = useUpdateStage(editingStageId || 0);
    const { mutate: deleteStage, isPending: isDeleting } = useDeleteStage();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: '',
            order: '',
            is_won: false,
            is_lost: false,
        },
    });

    const onSubmit = (formData: any) => {
        const payload = {
            ...formData,
            order: parseInt(formData.order) || 0,
        };

        if (editingStageId) {
            updateStage(payload, {
                onSuccess: () => {
                    handleCancelEdit();
                }
            });
        } else {
            createStage(payload, {
                onSuccess: () => {
                    handleCancelEdit();
                },
            });
        }
    };

    const handleEdit = (stage: any) => {
        setEditingStageId(stage.id);
        reset({
            name: stage.name,
            order: stage.order,
            is_won: stage.is_won,
            is_lost: stage.is_lost,
        });
        setDialogOpen(true);
    };

    const handleOpenCreate = () => {
        setEditingStageId(null);
        reset({ name: '', order: '', is_won: false, is_lost: false });
        setDialogOpen(true);
    };

    const handleCancelEdit = () => {
        setEditingStageId(null);
        reset({ name: '', order: '', is_won: false, is_lost: false });
        setDialogOpen(false);
    };

    const handleDelete = (id: number) => {
        deleteStage(id);
    };

    return (
        <>
            <Head title="Manage Stages" />
            <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="flex items-center gap-4">
                    <Link href={opportunitiesRoute.index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeftIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">
                        Manage Pipeline Stages
                    </h1>
                    <div className="ml-auto">
                        <Button onClick={handleOpenCreate}>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Stage
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 mt-4">
                    {/* List */}
                    {isLoading ? (
                        <TableSkeleton />
                    ) : (
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Properties</TableHead>
                                        <TableHead>Opps</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stages?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                            No stages found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stages?.map((stage: any) => (
                                        <TableRow key={stage.id}>
                                            <TableCell>{stage.order}</TableCell>
                                            <TableCell className="font-medium">{stage.name}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {stage.is_won && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Won</Badge>}
                                                    {stage.is_lost && <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Lost</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>{stage.opportunities_count || 0}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(stage)}
                                                        disabled={isDeleting || isUpdating || isCreating}
                                                        className="h-8 w-8"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger
                                                            render={
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                                                                    disabled={isDeleting}
                                                                />
                                                            }
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Delete Stage</DialogTitle>
                                                                <DialogDescription>
                                                                    Are you sure you want to delete this stage? This action cannot be undone.
                                                                </DialogDescription>
                                                            </DialogHeader>
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
                                                                            onClick={() => handleDelete(stage.id)}
                                                                        />
                                                                    }
                                                                >
                                                                    Delete Stage
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Create/Edit Dialog */}
                    <Dialog open={dialogOpen} onOpenChange={(open) => {
                        if (!open) handleCancelEdit();
                    }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingStageId ? 'Edit Stage' : 'Add New Stage'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...register('name', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input id="order" type="number" {...register('order', { required: true })} />
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Checkbox 
                                            id="is_won" 
                                            checked={watch('is_won')} 
                                            onCheckedChange={(c) => setValue('is_won', c as boolean)} 
                                        />
                                        <Label htmlFor="is_won">Won Stage</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox 
                                            id="is_lost" 
                                            checked={watch('is_lost')} 
                                            onCheckedChange={(c) => setValue('is_lost', c as boolean)} 
                                        />
                                        <Label htmlFor="is_lost">Lost Stage</Label>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isCreating || isUpdating}>
                                        {isCreating || isUpdating ? (
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        ) : editingStageId ? (
                                            <PencilIcon className="mr-2 h-4 w-4" />
                                        ) : (
                                            <PlusIcon className="mr-2 h-4 w-4" />
                                        )}
                                        {editingStageId ? 'Update' : 'Add'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
