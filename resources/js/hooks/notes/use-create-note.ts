import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import notesRoute from '@/routes/notes';
import { contactKeys, leadKeys, opportunityKeys } from '@/components/query-keys';
import type { Note } from '@/types';
import { toast } from 'sonner';

type CreateNoteData = {
    entity_type: 'lead' | 'opportunity' | 'contact';
    entity_id: number;
    body: string;
};

export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation<Note, ApiError, CreateNoteData>({
        mutationFn: async (data) => {
            return await api.post(notesRoute.store().url, data);
        },
        onSuccess: () => {
            toast.success('Note created');
            queryClient.invalidateQueries({ queryKey: contactKeys.list() });
            queryClient.invalidateQueries({ queryKey: opportunityKeys.list() });
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        }
    });
}
