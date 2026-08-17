import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import { useCreateLead } from '@/hooks/leads/use-create-lead';
import { useUpdateLead } from '@/hooks/leads/use-update-lead';
import type { Lead } from '@/types';
import { useEffect } from 'react';

interface LeadFormProps {
    lead?: Lead;
    onSuccess: () => void;
    onCancel: () => void;
}

export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
    const { mutate: createLead, isPending: isCreating } = useCreateLead();
    const { mutate: updateLead, isPending: isUpdating } = useUpdateLead(lead?.id || 0);

    const isPending = isCreating || isUpdating;

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: lead?.name || '',
            email: lead?.email || '',
            source: lead?.source || '',
        },
    });

    useEffect(() => {
        if (lead) {
            reset({
                name: lead.name || '',
                email: lead.email || '',
                source: lead.source || '',
            });
        }
    }, [lead, reset]);

    const onSubmit = (formData: any) => {
        if (lead) {
            updateLead(
                { id: lead.id, ...formData },
                {
                    onSuccess: () => {
                        onSuccess();
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
                }
            );
        } else {
            createLead(formData, {
                onSuccess: () => {
                    reset();
                    onSuccess();
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
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                    <p className="mt-1 text-sm text-destructive">
                        {errors.name.message as string}
                    </p>
                )}
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                    <p className="mt-1 text-sm text-destructive">
                        {errors.email.message as string}
                    </p>
                )}
            </div>
            <div>
                <Label htmlFor="source">Source</Label>
                <Input id="source" {...register('source')} />
                {errors.source && (
                    <p className="mt-1 text-sm text-destructive">
                        {errors.source.message as string}
                    </p>
                )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    {lead ? 'Save Changes' : 'Save Lead'}
                </Button>
            </div>
        </form>
    );
}
