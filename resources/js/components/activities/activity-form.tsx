import { useForm } from '@inertiajs/react';
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
import activities from '@/routes/activities';

interface Props {
    entityType: 'lead' | 'opportunity' | 'contact';
    entityId: number;
    onSuccess?: () => void;
}

export function ActivityForm({ entityType, entityId, onSuccess }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        entity_type: entityType,
        entity_id: entityId,
        type: 'call' as 'call' | 'meeting' | 'task' | 'email',
        due_at: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(activities.store().url, {
            onSuccess: () => {
                reset('type', 'due_at');
                onSuccess?.();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <Label htmlFor="type">Type</Label>
                <Select value={data.type} onValueChange={(v) => setData('type', v as typeof data.type)}>
                    <SelectTrigger id="type"><SelectValue /></SelectTrigger>
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
                    value={data.due_at}
                    onChange={(e) => setData('due_at', e.target.value)}
                />
                {errors.due_at && <p className="text-sm text-destructive">{errors.due_at}</p>}
            </div>
            <Button type="submit" disabled={processing}>Add Activity</Button>
        </form>
    );
}