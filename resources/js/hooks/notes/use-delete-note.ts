import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import { noteKeys } from '@/components/query-keys';
import { toast } from 'sonner';

type DeleteNoteData = {
    id: number;
};

export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, DeleteNoteData>({
        mutationFn: async ({ id }) => {
            return await api.delete(apiNotesRoute.destroy(id).url);
        },
        onSuccess: () => {
            toast.success('Note deleted');
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete note');
        },
    });
}
