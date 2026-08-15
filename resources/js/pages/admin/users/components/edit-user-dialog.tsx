import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateUser, UpdateUserData } from '@/hooks/users/use-update-user';
import { useRolesApi } from '@/hooks/roles/use-roles-api';
import { User } from '@/types';

export function EditUserDialog({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UpdateUserData>();
    const { mutateAsync: updateUser, isPending } = useUpdateUser(user?.id || 0);
    const { data: roles } = useRolesApi();

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                role_id: user.roles?.[0]?.id?.toString() || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UpdateUserData) => {
        if (!user) return;
        try {
            await updateUser(data);
            onOpenChange(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update profile details for {user?.name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input id="edit-name" {...register('name', { required: true })} />
                        {errors.name && <span className="text-sm text-red-500">Name is required</span>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input id="edit-email" type="email" {...register('email', { required: true })} />
                        {errors.email && <span className="text-sm text-red-500">Email is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-role_id">Role</Label>
                        <Select onValueChange={(val) => val && setValue('role_id', val)} value={watch('role_id')?.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role">
                                    {roles?.find((r) => r.id.toString() === watch('role_id')?.toString())?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {roles?.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.role_id && <span className="text-sm text-red-500">Role is required</span>}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Update Profile'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
