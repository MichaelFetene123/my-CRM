import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteAllUsers } from '@/hooks/users/use-delete-all-users';
import { Loader2 } from 'lucide-react';

interface DeleteAllUsersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userCount: number;
}

export function DeleteAllUsersDialog({ open, onOpenChange, userCount }: DeleteAllUsersDialogProps) {
    const { mutate: deleteAll, isPending } = useDeleteAllUsers();

    const handleConfirm = () => {
        deleteAll(undefined, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete {userCount} users. This action cannot be undone and will permanently remove all non-Super Admin users from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={(e) => {
                            e.preventDefault();
                            handleConfirm();
                        }}
                        className="bg-red-600 focus:ring-red-600 hover:bg-red-700"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete All Users
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
