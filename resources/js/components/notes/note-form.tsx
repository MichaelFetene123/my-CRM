import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon } from 'lucide-react';
import { useCreateNote } from '@/hooks/notes/use-create-note';

interface Props {
    entityType: 'lead' | 'opportunity' | 'contact';
    entityId: number;
    onSuccess?: () => void;
}

export function NoteForm({ entityType, entityId, onSuccess }: Props) {
    const { mutate, isPending } = useCreateNote();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            entity_type: entityType,
            entity_id: entityId,
            body: '',
        },
    });

    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                reset({
                    body: '',
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
                <Label htmlFor="body">Note</Label>
                <Textarea
                    id="body"
                    placeholder="Write a note..."
                    {...register('body')}
                    className="min-h-25"
                />
                {errors.body && (
                    <p className="text-sm text-destructive">
                        {errors.body.message as string}
                    </p>
                )}
            </div>
            <Button type="submit" disabled={isPending}>
                {isPending && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Note
            </Button>
        </form>
    );
}
