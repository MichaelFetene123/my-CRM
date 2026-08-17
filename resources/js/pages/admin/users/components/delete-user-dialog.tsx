import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDeleteUser } from '@/hooks/users/use-delete-user';
import { User } from '@/types';

export function DeleteUserDialog({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { mutateAsync: deleteUser, isPending } = useDeleteUser();

    const handleDelete = async () => {
        if (!user) return;
        try {
            await deleteUser(user.id);
            onOpenChange(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete {user?.name}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
