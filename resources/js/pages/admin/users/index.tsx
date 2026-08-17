import { useState } from 'react';
import { PageProps, User, Role, BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: admin.users.index().url },
];
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Key, Trash } from 'lucide-react';
import { useUsers } from '@/hooks/users/use-users';

import { CreateUserDialog } from './components/create-user-dialog';
import { EditUserDialog } from './components/edit-user-dialog';
import { ResetPasswordDialog } from './components/reset-password-dialog';
import { DeleteUserDialog } from './components/delete-user-dialog';
import { DeleteAllUsersDialog } from './components/delete-all-users-dialog';

function UserRow({
    user,
    onEdit,
    onResetPassword,
    onDelete,
}: {
    user: User;
    onEdit: (user: User) => void;
    onResetPassword: (user: User) => void;
    onDelete: (user: User) => void;
}) {
    const roleName = user.roles?.[0]?.name || 'No Role';

    return (
        <TableRow>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <Badge variant="secondary">{roleName}</Badge>
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onResetPassword(user)}>
                            <Key className="mr-2 h-4 w-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 focus:text-red-600">
                            <Trash className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

import { usePage } from '@inertiajs/react';

export default function UsersIndex({ users: initialUsers }: PageProps<{ users: User[], roles: Role[] }>) {
    const { auth } = usePage<PageProps>().props;
    const { data: users = [] } = useUsers(initialUsers);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToReset, setUserToReset] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    return (
        <>
            <Head title="Manage Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Manage Users</h1>
                    <div className="flex gap-2">
                        {auth.user.roles?.some((r) => r.name === 'Super Admin') && (
                            <Button variant="destructive" onClick={() => setIsDeleteAllOpen(true)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete All Users
                            </Button>
                        )}
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <UserRow 
                                    key={user.id} 
                                    user={user} 
                                    onEdit={setUserToEdit}
                                    onResetPassword={setUserToReset}
                                    onDelete={setUserToDelete}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <CreateUserDialog 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen} 
            />
            
            <EditUserDialog 
                user={userToEdit} 
                open={!!userToEdit} 
                onOpenChange={(open) => !open && setUserToEdit(null)} 
            />
            
            <ResetPasswordDialog 
                user={userToReset} 
                open={!!userToReset} 
                onOpenChange={(open) => !open && setUserToReset(null)} 
            />
            
            <DeleteUserDialog 
                user={userToDelete} 
                open={!!userToDelete} 
                onOpenChange={(open) => !open && setUserToDelete(null)} 
            />

            <DeleteAllUsersDialog
                open={isDeleteAllOpen}
                onOpenChange={setIsDeleteAllOpen}
                userCount={users.length}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs,
};
