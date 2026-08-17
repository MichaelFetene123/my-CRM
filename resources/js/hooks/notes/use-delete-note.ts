import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import {
    noteKeys,
    contactKeys,
    leadKeys,
    opportunityKeys,
} from '@/components/query-keys';
import { toast } from 'sonner';

type DeleteNoteData = {
    id: number;
    entity_type?: 'lead' | 'opportunity' | 'contact';
};

export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, DeleteNoteData>({
        mutationFn: async ({ id }) => {
            return await api.delete(apiNotesRoute.destroy(id).url);
        },
        onSuccess: (_, variables) => {
            toast.success('Note deleted');
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
            toast.error(error.message || 'Failed to delete note');
        },
    });
}
