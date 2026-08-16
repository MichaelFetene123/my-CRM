import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import {
    contactKeys,
    leadKeys,
    opportunityKeys,
} from '@/components/query-keys';
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
            return await api.post(apiNotesRoute.store().url, data);
        },
        onSuccess: (data, variables) => {
            toast.success('Note created');
            if (variables.entity_type === 'contact') {
                queryClient.invalidateQueries({ queryKey: contactKeys.all });
            } else if (variables.entity_type === 'opportunity') {
                queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
            } else if (variables.entity_type === 'lead') {
                queryClient.invalidateQueries({ queryKey: leadKeys.all });
            }
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred');
        },
    });
}
