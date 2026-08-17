import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateUser, CreateUserData } from '@/hooks/users/use-create-user';
import { useRolesApi } from '@/hooks/roles/use-roles-api';
import { Copy, Check, Loader2 } from 'lucide-react';

export function CreateUserDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateUserData>();
    const { mutateAsync: createUser, isPending } = useCreateUser();
    const { data: roles } = useRolesApi();
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const onSubmit = async (data: CreateUserData) => {
        try {
            const result = await createUser(data);
            if (result.password) {
                setTempPassword(result.password);
            } else {
                handleClose();
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleClose = () => {
        setTempPassword(null);
        reset();
        onOpenChange(false);
    };

    const copyToClipboard = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(val); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{tempPassword ? 'User Created' : 'Add User'}</DialogTitle>
                    <DialogDescription>
                        {tempPassword 
                            ? 'Please save this temporary password. It will not be shown again.' 
                            : 'Enter the details of the new user.'}
                    </DialogDescription>
                </DialogHeader>

                {tempPassword ? (
                    <div className="flex items-center gap-2 mt-4">
                        <Input value={tempPassword} readOnly />
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name', { required: true })} />
                            {errors.name && <span className="text-sm text-red-500">Name is required</span>}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email', { required: true })} />
                            {errors.email && <span className="text-sm text-red-500">Email is required</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role_id">Role</Label>
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
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add User
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {tempPassword && (
                    <DialogFooter>
                        <Button onClick={handleClose}>Done</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
