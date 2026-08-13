import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateActivity } from '@/hooks/activities/use-create-activity';

interface Props {
    entityType: 'lead' | 'opportunity' | 'contact';
    entityId: number;
    onSuccess?: () => void;
}

export function ActivityForm({ entityType, entityId, onSuccess }: Props) {
    const { mutate, isPending } = useCreateActivity();

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
            entity_type: entityType,
            entity_id: entityId,
            type: 'call',
            due_at: '',
        },
    });

    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                reset({
                    type: 'call',
                    due_at: '',
                    entity_type: entityType,
                    entity_id: entityId,
                });
                onSuccess?.();
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="type">Type</Label>
                <Select
                    value={watch('type')}
                    onValueChange={(v) => v && setValue('type', v)}
                >
                    <SelectTrigger id="type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="due_at">Due</Label>
                <Input
                    id="due_at"
                    type="datetime-local"
                    {...register('due_at')}
                />
                {errors.due_at && (
                    <p className="text-sm text-destructive">
                        {errors.due_at.message as string}
                    </p>
                )}
            </div>
            <Button type="submit" disabled={isPending}>
                {isPending && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Activity
            </Button>
        </form>
    );
}
