import { PageProps, Role, Permission, BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: admin.roles.index().url },
];
import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
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
import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUpdateRole, UpdateRoleData } from '@/hooks/roles/use-update-role';
import { useDeleteRole } from '@/hooks/roles/use-delete-role';

function RoleRow({ role, permissions }: { role: Role; permissions: Permission[] }) {
    const { control, handleSubmit } = useForm<AssignPermissionData>();
    const assignMutation = useAssignPermission(role.id);
    const updateMutation = useUpdateRole(role.id);
    const deleteMutation = useDeleteRole(role.id);

    const [editOpen, setEditOpen] = useState(false);

    const { register: editRegister, handleSubmit: handleEditSubmit, reset: editReset, control: editControl, formState: { errors: editErrors } } = useForm<UpdateRoleData>({
        defaultValues: {
            name: role.name,
            description: role.description || '',
            permissions: role.permissions?.map(p => p.id) || [],
        }
    });

    const onEditSubmit = (data: UpdateRoleData) => {
        updateMutation.mutate(data, {
            onSuccess: () => setEditOpen(false)
        });
    };

    const onDelete = () => {
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            deleteMutation.mutate();
        }
    };

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
                                    <SelectTrigger className="w-50">
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
            <TableCell>
                {role.name !== 'Super Admin' && (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                    editReset({
                                        name: role.name,
                                        description: role.description || '',
                                        permissions: role.permissions?.map(p => p.id) || [],
                                    });
                                    setEditOpen(true);
                                }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Role
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Role
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Role</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4 pt-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-name-${role.id}`}>Role Name</Label>
                                        <Input
                                            id={`edit-name-${role.id}`}
                                            {...editRegister('name', { required: true })}
                                        />
                                        {editErrors.name && <span className="text-sm text-red-500">This field is required</span>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-desc-${role.id}`}>Description</Label>
                                        <Input
                                            id={`edit-desc-${role.id}`}
                                            {...editRegister('description')}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Permissions</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <Controller
                                                name="permissions"
                                                control={editControl}
                                                render={({ field }) => (
                                                    <>
                                                        {permissions.map((p) => (
                                                            <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                                    checked={field.value?.includes(p.id)}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.checked
                                                                            ? [...(field.value || []), p.id]
                                                                            : (field.value || []).filter(id => id !== p.id);
                                                                        field.onChange(newValue);
                                                                    }}
                                                                />
                                                                <span className="text-sm">{p.name}</span>
                                                            </label>
                                                        ))}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={updateMutation.isPending}>
                                            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </>
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
        <>
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
                            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                                    <TableHead className="w-[80px]"></TableHead>
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
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs,
};
