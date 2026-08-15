import { PageProps, User, Role, BreadcrumbItem } from '@/types';
import admin from '@/routes/admin';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: admin.users.index().url },
];
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/hooks/users/use-users';

function UserRow({ user }: { user: User }) {
    const roleName = user.roles?.[0]?.name || 'No Role';

    return (
        <TableRow>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <Badge variant="secondary">{roleName}</Badge>
            </TableCell>
        </TableRow>
    );
}

export default function UsersIndex({ users: initialUsers }: PageProps<{ users: User[], roles: Role[] }>) {
    const { data: users = [] } = useUsers(initialUsers);

    return (
        <>
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
                                <UserRow key={user.id} user={user} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs,
};
