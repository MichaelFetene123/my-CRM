import { PageProps, Role, Permission, BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: admin.roles.index().url },
];

import { Head } from '@inertiajs/react';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { useCreateRole, CreateRoleData } from '@/hooks/roles/use-create-role';
import { useUpdateRole, UpdateRoleData } from '@/hooks/roles/use-update-role';
import { useDeleteRole } from '@/hooks/roles/use-delete-role';
import { useRoles } from '@/hooks/roles/use-roles';
import { usePermissions } from '@/hooks/roles/use-permissions';
import { useState, useMemo } from 'react';

function RoleCard({ role, onEdit }: { role: Role; onEdit: (role: Role) => void }) {
    const deleteMutation = useDeleteRole();

    const onDelete = () => {
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            deleteMutation.mutate(role.id);
        }
    };

    return (
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <p className="text-muted-foreground text-sm">{role.description || 'No description provided'}</p>
                <p className="text-muted-foreground text-xs mt-1">{role.permissions?.length || 0} permissions assigned</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
                {role.name !== 'Super Admin' && (
                    <>
                        <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
}

export default function RolesIndex({ roles: initialRoles, permissions: initialPermissions }: PageProps<{ roles: Role[], permissions: Permission[] }>) {
    const { data: roles = [] } = useRoles(initialRoles);
    const { data: permissions = [] } = usePermissions(initialPermissions);

    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole(editingRole?.id || 0);

    const isPending = view === 'create' ? createMutation.isPending : updateMutation.isPending;

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateRoleData & { permissions: number[] }>({
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
        }
    });

    const openCreate = () => {
        reset({ name: '', description: '', permissions: [] });
        setView('create');
    };

    const openEdit = (role: Role) => {
        setEditingRole(role);
        reset({
            name: role.name,
            description: role.description || '',
            permissions: role.permissions?.map(p => p.id) || [],
        });
        setView('edit');
    };

    const closeForm = () => {
        setView('list');
        setEditingRole(null);
    };

    const onSubmit = (data: CreateRoleData & { permissions: number[] }) => {
        if (view === 'create') {
            createMutation.mutate(data, {
                onSuccess: closeForm
            });
        } else if (view === 'edit' && editingRole) {
            updateMutation.mutate(data, {
                onSuccess: closeForm
            });
        }
    };

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, { id: number; name: string; action: string }[]> = {};
        permissions.forEach(p => {
            let groupNameRaw = 'General';
            let actionRaw = p.name;

            if (p.name.includes('.')) {
                const parts = p.name.split('.');
                groupNameRaw = parts[0];
                actionRaw = parts.slice(1).join(' ');
            } else if (p.name.includes('_')) {
                const parts = p.name.split('_');
                actionRaw = parts[0];
                groupNameRaw = parts.slice(1).join(' ');
            }
            
            const groupName = groupNameRaw.charAt(0).toUpperCase() + groupNameRaw.slice(1);
            const action = actionRaw.charAt(0).toUpperCase() + actionRaw.slice(1);
            
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push({ id: p.id, name: p.name, action });
        });
        return groups;
    }, [permissions]);

    return (
        <>
            <Head title="Manage Roles" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {view === 'list' && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
                                <p className="text-muted-foreground mt-1">
                                    Create custom roles and assign granular permissions for staff members.
                                </p>
                            </div>
                            <Button onClick={openCreate} className="self-start sm:self-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                New Role
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            {roles.map((role) => (
                                <RoleCard key={role.id} role={role} onEdit={openEdit} />
                            ))}
                        </div>
                    </>
                )}

                {(view === 'create' || view === 'edit') && (
                    <div className="max-w-5xl">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {view === 'create' ? 'Create New Role' : `Edit Role: ${editingRole?.name}`}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Configure the role information and specify the exact permissions it grants.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Role Name</Label>
                                    <Input id="name" placeholder="e.g. Doctor" {...register('name', { required: true })} />
                                    {errors.name && <span className="text-sm text-red-500">This field is required</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input id="description" placeholder="A brief description of this role" {...register('description')} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium">Permissions Matrix</h3>
                                    <p className="text-sm text-muted-foreground">Toggle only the access this role should have.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(groupedPermissions).map(([groupName, perms]) => (
                                        <Card key={groupName} className="bg-card">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base">{groupName}</CardTitle>
                                                <CardDescription>{perms.length} permissions</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Controller
                                                    name="permissions"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col gap-3">
                                                            {perms.map((p) => (
                                                                <label key={p.id} className="flex items-center gap-3 cursor-pointer">
                                                                    <Checkbox 
                                                                        checked={field.value?.includes(p.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const newValue = checked
                                                                                ? [...(field.value || []), p.id]
                                                                                : (field.value || []).filter((id: number) => id !== p.id);
                                                                            field.onChange(newValue);
                                                                        }}
                                                                    />
                                                                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                        {p.action}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="ghost" onClick={closeForm}>Cancel</Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Role
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs,
};
