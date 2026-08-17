import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';
import apiNotesRoute from '@/routes/apiNotes';
import { noteKeys } from '@/components/query-keys';
import type { Note, PaginatedData } from '@/types';

export function useNotes(page: number = 1) {
    return useQuery<PaginatedData<Note>, ApiError>({
        queryKey: noteKeys.list({ page }),
        queryFn: async () => {
            return await api.get(apiNotesRoute.index({ query: { page } }).url);
        },
    });
}
