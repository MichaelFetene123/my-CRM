import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import {
    noteKeys,
    contactKeys,
    leadKeys,
    opportunityKeys,
} from '@/components/query-keys';
import type { Note } from '@/types';
import { toast } from 'sonner';

type UpdateNoteData = {
    id: number;
    entity_type?: 'lead' | 'opportunity' | 'contact';
    body: string;
};

export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation<Note, ApiError, UpdateNoteData>({
        mutationFn: async (data) => {
            return await api.put(apiNotesRoute.update(data.id).url, { body: data.body });
        },
        onSuccess: (data, variables) => {
            toast.success('Note updated');
            if (variables.entity_type === 'contact') {
                queryClient.invalidateQueries({ queryKey: contactKeys.all });
            } else if (variables.entity_type === 'opportunity') {
                queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            } else if (variables.entity_type === 'lead') {
                queryClient.invalidateQueries({ queryKey: leadKeys.all });
            }
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update note');
        },
    });
}
