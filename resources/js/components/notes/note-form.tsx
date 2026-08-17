import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon } from 'lucide-react';
import { useCreateNote } from '@/hooks/notes/use-create-note';
import axios from 'axios';

interface Props {
    entityType: 'lead' | 'opportunity' | 'contact';
    entityId: number;
    onSuccess?: () => void;
}

export function NoteForm({ entityType, entityId, onSuccess }: Props) {
    const { mutate, isPending } = useCreateNote();
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            body: '',
            mentioned_user_ids: [] as number[],
        },
    });

    const body = watch('body');

    useEffect(() => {
        // Detect @mentions in body
        const match = body.match(/@([a-zA-Z0-9_ ]*)$/);
        if (match) {
            setMentionQuery(match[1]);
        } else {
            setMentionQuery(null);
            setUsers([]);
        }
    }, [body]);

    useEffect(() => {
        if (mentionQuery !== null) {
            const fetchUsers = async () => {
                const { data } = await axios.get('/api/users', { params: { q: mentionQuery } });
                setUsers(data);
            };
            fetchUsers();
        }
    }, [mentionQuery]);

    const selectUser = (user: any) => {
        const newBody = body.replace(/@([a-zA-Z0-9_ ]*)$/, `@${user.name} `);
        setValue('body', newBody);
        
        const newIds = [...mentionedUserIds, user.id];
        setMentionedUserIds(newIds);
        setValue('mentioned_user_ids', newIds);
        
        setMentionQuery(null);
        setUsers([]);
        textareaRef.current?.focus();
    };

    const onSubmit = (formData: any) => {
        mutate(formData, {
            onSuccess: () => {
                reset({
                    body: '',
                    entity_type: entityType,
                    entity_id: entityId,
                    mentioned_user_ids: [],
                });
                setMentionedUserIds([]);
                onSuccess?.();
            },
            onError: (error: any) => {
                if (error.errors) {
                    Object.entries(error.errors).forEach(([key, messages]: any) => {
                        setError(key as any, {
                            type: 'server',
                            message: messages[0],
                        });
                    });
                }
            },
        });
    };

    const { ref: formRef, ...restRegister } = register('body');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
                <Label htmlFor="body">Note</Label>
                <Textarea
                    id="body"
                    placeholder="Write a note... Type @ to mention someone"
                    {...restRegister}
                    ref={(e) => {
                        formRef(e);
                        // @ts-ignore
                        textareaRef.current = e;
                    }}
                    className="min-h-25 mt-1"
                />
                
                {mentionQuery !== null && users.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md">
                        <ul className="py-1">
                            {users.map(user => (
                                <li 
                                    key={user.id} 
                                    className="px-4 py-2 cursor-pointer hover:bg-accent text-sm"
                                    onClick={() => selectUser(user)}
                                >
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {errors.body && (
                    <p className="text-sm text-destructive mt-1">
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
