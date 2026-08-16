import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2Icon, Trash2Icon, PlusIcon, PencilIcon, XIcon } from 'lucide-react';
import { usePipelineStages } from '@/hooks/pipeline-stages/use-pipeline-stages';
import { useCreateStage } from '@/hooks/pipeline-stages/use-create-stage';
import { useUpdateStage } from '@/hooks/pipeline-stages/use-update-stage';
import { useDeleteStage } from '@/hooks/pipeline-stages/use-delete-stage';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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

export function ManageStagesDialog() {
    const [open, setOpen] = useState(false);
    const [editingStageId, setEditingStageId] = useState<number | null>(null);

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
                    reset({ name: '', order: '', is_won: false, is_lost: false });
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
    };

    const handleCancelEdit = () => {
        setEditingStageId(null);
        reset({ name: '', order: '', is_won: false, is_lost: false });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this stage?')) {
            deleteStage(id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Manage Stages
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage Pipeline Stages</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* List */}
                    <div className="rounded-md border">
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">
                                            <Loader2Icon className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : stages?.length === 0 ? (
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(stage.id)}
                                                        disabled={isDeleting}
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Create/Edit Form */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">
                                {editingStageId ? 'Edit Stage' : 'Add New Stage'}
                            </h4>
                            {editingStageId && (
                                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 px-2 text-xs">
                                    <XIcon className="h-3 w-3 mr-1" /> Cancel Edit
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3 rounded-md bg-muted/50 p-3">
                            <div className="grid grid-cols-2 gap-3 flex-1">
                                <div className="space-y-1">
                                    <Label htmlFor="name" className="text-xs">Name</Label>
                                    <Input id="name" size={1} className="h-8 text-sm" {...register('name', { required: true })} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="order" className="text-xs">Order</Label>
                                    <Input id="order" type="number" size={1} className="h-8 text-sm" {...register('order', { required: true })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 pb-1 px-2 border-l border-r border-border/50">
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="is_won" 
                                        checked={watch('is_won')} 
                                        onCheckedChange={(c) => setValue('is_won', c as boolean)} 
                                    />
                                    <Label htmlFor="is_won" className="text-xs">Won</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="is_lost" 
                                        checked={watch('is_lost')} 
                                        onCheckedChange={(c) => setValue('is_lost', c as boolean)} 
                                    />
                                    <Label htmlFor="is_lost" className="text-xs">Lost</Label>
                                </div>
                            </div>
                            <Button type="submit" size="sm" disabled={isCreating || isUpdating} className="h-8">
                                {isCreating || isUpdating ? (
                                    <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />
                                ) : editingStageId ? (
                                    <PencilIcon className="mr-2 h-3 w-3" />
                                ) : (
                                    <PlusIcon className="mr-2 h-3 w-3" />
                                )}
                                {editingStageId ? 'Update' : 'Add'}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
