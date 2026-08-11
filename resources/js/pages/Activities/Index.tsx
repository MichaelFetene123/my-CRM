import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Phone, Calendar, Mail, ClipboardList, MoreHorizontal, Trash2, CheckCircle } from 'lucide-react';
import activitiesRoute from '@/routes/activities';
import type { Activity, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Activities', href: activitiesRoute.index().url }];

export default function ActivitiesIndex({ activities }: { activities: Activity[] }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        entity_type: '',
        entity_id: '',
        type: '',
        due_at: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(activitiesRoute.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    function toggleComplete(activity: Activity) {
        if (!activity.completed_at) {
            router.post(activitiesRoute.complete(activity.id).url, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Activities" />
            <div className="p-6 space-y-4 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Activities</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Activity
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Activity</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="type">Activity Type</Label>
                                    <Select value={data.type} onValueChange={(val) => setData('type', val ?? '')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="call">Call</SelectItem>
                                            <SelectItem value="meeting">Meeting</SelectItem>
                                            <SelectItem value="task">Task</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="entity_type">Related To</Label>
                                        <Select value={data.entity_type} onValueChange={(val) => setData('entity_type', val ?? '')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Entity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lead">Lead</SelectItem>
                                                <SelectItem value="contact">Contact</SelectItem>
                                                <SelectItem value="opportunity">Opportunity</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.entity_type && <p className="text-sm text-destructive mt-1">{errors.entity_type}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="entity_id">ID</Label>
                                        <Input
                                            id="entity_id"
                                            type="number"
                                            placeholder="e.g. 1"
                                            value={data.entity_id}
                                            onChange={(e) => setData('entity_id', e.target.value)}
                                        />
                                        {errors.entity_id && <p className="text-sm text-destructive mt-1">{errors.entity_id}</p>}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="due_at">Due Date</Label>
                                    <Input
                                        id="due_at"
                                        type="datetime-local"
                                        value={data.due_at}
                                        onChange={(e) => setData('due_at', e.target.value)}
                                    />
                                    {errors.due_at && <p className="text-sm text-destructive mt-1">{errors.due_at}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>Save</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[25%] pl-6">Type</TableHead>
                                    <TableHead className="w-[25%]">Related To</TableHead>
                                    <TableHead className="w-[25%]">Due Date</TableHead>
                                    <TableHead className="w-[15%]">Status</TableHead>
                                    <TableHead className="w-12 text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities?.map((activity) => (
                                    <TableRow key={activity.id} className={activity.completed_at ? 'opacity-50' : ''}>
                                        <TableCell className="font-medium capitalize pl-6">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    switch (activity.type) {
                                                        case 'call':
                                                            return (
                                                                <div className="p-2 rounded-md bg-green-500/10 text-green-500">
                                                                    <Phone className="w-4 h-4" />
                                                                </div>
                                                            );
                                                        case 'meeting':
                                                            return (
                                                                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                                                                    <Calendar className="w-4 h-4" />
                                                                </div>
                                                            );
                                                        case 'email':
                                                            return (
                                                                <div className="p-2 rounded-md bg-purple-500/10 text-purple-500">
                                                                    <Mail className="w-4 h-4" />
                                                                </div>
                                                            );
                                                        case 'task':
                                                            return (
                                                                <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                                                                    <ClipboardList className="w-4 h-4" />
                                                                </div>
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                })()}
                                                {activity.type}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize">{activity.entity_type}</span> #{activity.entity_id}
                                        </TableCell>
                                        <TableCell>{new Date(activity.due_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={activity.completed_at ? 'success' : 'warning'}>
                                                {activity.completed_at ? 'Completed' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {!activity.completed_at && (
                                                        <DropdownMenuItem onClick={() => toggleComplete(activity)}>
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem 
                                                        variant="destructive"
                                                        onClick={() => router.delete(activitiesRoute.destroy(activity.id).url, { preserveScroll: true })}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!activities || activities.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No activities scheduled.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ActivitiesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
