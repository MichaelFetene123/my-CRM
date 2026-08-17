import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import { noteKeys } from '@/components/query-keys';
import type { Note } from '@/types';
import { toast } from 'sonner';

type UpdateNoteData = {
    id: number;
    body: string;
};

export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation<Note, ApiError, UpdateNoteData>({
        mutationFn: async (data) => {
            return await api.put(apiNotesRoute.update(data.id).url, { body: data.body });
        },
        onSuccess: () => {
            toast.success('Note updated');
            queryClient.invalidateQueries({ queryKey: noteKeys.all });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update note');
        },
    });
}
