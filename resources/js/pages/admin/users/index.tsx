import { PageProps, User, Role } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';

import { useAssignRole, AssignRoleData } from '@/hooks/users/use-assign-role';
import { useUsers } from '@/hooks/users/use-users';
import { useRoles } from '@/hooks/roles/use-roles';

function UserRow({ user, roles }: { user: User; roles: Role[] }) {
    const { control, handleSubmit } = useForm<AssignRoleData>({
        defaultValues: {
            role_id: user.roles?.[0]?.id.toString() || '',
        },
    });

    const mutation = useAssignRole(user.id);

    return (
        <TableRow>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <form
                    onChange={handleSubmit((data) => mutation.mutate(data))}
                >
                    <Controller
                        name="role_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                disabled={mutation.isPending}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Assign Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id.toString()}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </form>
            </TableCell>
        </TableRow>
    );
}

export default function UsersIndex({ users: initialUsers, roles: initialRoles }: PageProps<{ users: User[], roles: Role[] }>) {
    const { data: users = [] } = useUsers(initialUsers);
    const { data: roles = [] } = useRoles(initialRoles, 'admin/users/index');

    return (
        <AppLayout>
            <Head title="Manage Users" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Manage Users</h1>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <UserRow key={user.id} user={user} roles={roles} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
