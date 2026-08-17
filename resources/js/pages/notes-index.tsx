import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useNotes } from '@/hooks/notes/use-notes';
import { useDeleteNote } from '@/hooks/notes/use-delete-note';
import { useUpdateNote } from '@/hooks/notes/use-update-note';
import { TableSkeleton } from '@/components/skeleton/table-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Loader2Icon, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Note, BreadcrumbItem } from '@/types';
import contacts from '@/routes/contacts';
import leads from '@/routes/leads';
import opportunities from '@/routes/opportunities';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Notes', href: '/notes' },
];

export default function NotesIndex() {
    const [page, setPage] = useState(1);
    const { data: noteList, isLoading } = useNotes(page);
    const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();
    const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

    const [editNote, setEditNote] = useState<Note | null>(null);
    const [editBody, setEditBody] = useState('');
    const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editNote) {
            updateNote(
                { id: editNote.id, body: editBody },
                {
                    onSuccess: () => setEditNote(null),
                }
            );
        }
    };

    const getEntityInfo = (note: Note) => {
        const type = note.entity_type.split('\\').pop();
        const name = note.entity?.name || note.entity?.title || `ID: ${note.entity_id}`;
        
        let url = '#';
        if (type === 'Contact') url = contacts.show(note.entity_id).url;
        if (type === 'Lead') url = leads.show?.(note.entity_id)?.url || '#'; // Assuming lead show exists or fallback
        if (type === 'Opportunity') url = opportunities.show(note.entity_id).url;

        return { type, name, url };
    };

    return (
        <>
            <Head title="Notes" />
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Notes</h1>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6 w-50">Date</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Entity</TableHead>
                                            <TableHead className="w-1/2">Body</TableHead>
                                            <TableHead className="pr-6 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {noteList?.data?.map((note: Note) => {
                                            const entityInfo = getEntityInfo(note);
                                            return (
                                                <TableRow key={note.id} className="h-12 transition-colors hover:bg-muted/50">
                                                    <TableCell className="pl-6 whitespace-nowrap">
                                                        {format(new Date(note.created_at), 'MMM d, yyyy HH:mm')}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {note.creator?.name || 'System'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant="outline" className="w-fit">{entityInfo.type}</Badge>
                                                            <Link href={entityInfo.url} className="text-sm font-medium hover:underline text-primary">
                                                                {entityInfo.name}
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="line-clamp-2 text-sm">{note.body}</p>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setEditNote(note);
                                                                    setEditBody(note.body);
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() => setDeleteNoteId(note.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {(!noteList?.data || noteList.data.length === 0) && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="h-24 text-center text-muted-foreground"
                                                >
                                                    No notes found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Pagination Controls */}
                                {noteList && noteList.last_page > 1 && (
                                    <div className="flex items-center justify-end space-x-2 py-4 pr-6">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {page} of {noteList.last_page}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(noteList.last_page, p + 1))}
                                            disabled={page === noteList.last_page}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                <Dialog open={!!editNote} onOpenChange={(open) => !open && setEditNote(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Note</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="body">Note</Label>
                                <Textarea
                                    id="body"
                                    value={editBody}
                                    onChange={(e) => setEditBody(e.target.value)}
                                    required
                                    rows={4}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setEditNote(null)}>Cancel</Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Modal */}
                <Dialog open={!!deleteNoteId} onOpenChange={(open) => !open && setDeleteNoteId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Note</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete this note? This action cannot be undone.
                        </p>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setDeleteNoteId(null)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={() => {
                                    if (deleteNoteId) {
                                        deleteNote({ id: deleteNoteId }, {
                                            onSuccess: () => setDeleteNoteId(null)
                                        });
                                    }
                                }}
                            >
                                {isDeleting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

NotesIndex.layout = {
    breadcrumbs,
};
