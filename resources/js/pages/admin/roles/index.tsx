import { PageProps, Role, Permission } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { useCreateRole, CreateRoleData } from '@/hooks/roles/use-create-role';
import { useAssignPermission, AssignPermissionData } from '@/hooks/roles/use-assign-permission';
import { useRoles } from '@/hooks/roles/use-roles';
import { usePermissions } from '@/hooks/roles/use-permissions';

function RoleRow({ role, permissions }: { role: Role; permissions: Permission[] }) {
    const { control, handleSubmit } = useForm<AssignPermissionData>();
    const assignMutation = useAssignPermission(role.id);

    return (
        <TableRow>
            <TableCell className="font-medium">
                <div>{role.name}</div>
                <div className="text-sm text-muted-foreground">{role.description}</div>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2">
                    {role.permissions?.map(p => (
                        <Badge key={p.id} variant="secondary">{p.name}</Badge>
                    ))}
                    {(!role.permissions || role.permissions.length === 0) && (
                        <span className="text-muted-foreground text-sm">None</span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                {role.name !== 'Super Admin' && (
                    <form onChange={handleSubmit((data) => assignMutation.mutate(data))}>
                        <Controller
                            name="permission_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    disabled={assignMutation.isPending}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Add permission..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {permissions
                                            .filter(p => !role.permissions?.some(rp => rp.id === p.id))
                                            .map((permission) => (
                                            <SelectItem key={permission.id} value={permission.id.toString()}>
                                                {permission.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </form>
                )}
            </TableCell>
        </TableRow>
    );
}

export default function RolesIndex({ roles: initialRoles, permissions: initialPermissions }: PageProps<{ roles: Role[], permissions: Permission[] }>) {
    const { data: roles = [] } = useRoles(initialRoles);
    const { data: permissions = [] } = usePermissions(initialPermissions);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateRoleData>({
        defaultValues: {
            name: '',
            description: '',
        }
    });

    const createMutation = useCreateRole();

    const onSubmit = (data: CreateRoleData) => {
        createMutation.mutate(data, {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout>
            <Head title="Manage Roles" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h1 className="text-xl font-semibold mb-4">Create New Role</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-end">
                        <div className="grid gap-2 flex-1 max-w-sm">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Manager"
                                {...register('name', { required: true })}
                            />
                            {errors.name && <span className="text-sm text-red-500">This field is required</span>}
                        </div>
                        <div className="grid gap-2 flex-1 max-w-sm">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                placeholder="What does this role do?"
                                {...register('description')}
                            />
                        </div>
                        <Button type="submit" disabled={createMutation.isPending}>
                            Create Role
                        </Button>
                    </form>
                </div>

                <div>
                    <h1 className="text-xl font-semibold mb-4">Manage Roles & Permissions</h1>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Permissions</TableHead>
                                    <TableHead>Assign Permission</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.map((role) => (
                                    <RoleRow key={role.id} role={role} permissions={permissions} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
