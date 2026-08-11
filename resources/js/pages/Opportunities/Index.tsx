import { Head, Link, useForm } from '@inertiajs/react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import opportunitiesRoute from '@/routes/opportunities';
import type { Opportunity, PipelineStage, Contact, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Opportunities', href: opportunitiesRoute.index().url }];

interface Props {
    stages: (PipelineStage & { opportunities: Opportunity[] })[];
    contacts: Contact[];
}

export default function OpportunitiesIndex({ stages, contacts }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        contact_id: '',
        stage_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(opportunitiesRoute.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    const statusVariant: Record<string, any> = {
        open: 'info',
        won: 'success',
        lost: 'destructive',
    };

    return (
        <>
            <Head title="Opportunities" />
            <div className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Opportunities Pipeline</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger render={<Button />}>
                            New Opportunity
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Opportunity</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4 mt-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="contact_id">Contact</Label>
                                    <Select value={data.contact_id} onValueChange={(val) => setData('contact_id', val ?? '')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.contact_id && <p className="text-sm text-destructive mt-1">{errors.contact_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="stage_id">Pipeline Stage</Label>
                                    <Select value={data.stage_id} onValueChange={(val) => setData('stage_id', val ?? '')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select initial stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stages.map((stage) => (
                                                <SelectItem key={stage.id} value={stage.id.toString()}>{stage.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.stage_id && <p className="text-sm text-destructive mt-1">{errors.stage_id}</p>}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>Save</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max h-full">
                        {stages.map((stage) => (
                            <div key={stage.id} className="w-80 flex flex-col gap-3 rounded-lg bg-muted/50 p-3">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="font-medium text-sm text-muted-foreground">{stage.name}</h3>
                                    <Badge variant="secondary" className="rounded-full">{stage.opportunities.length}</Badge>
                                </div>
                                
                                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                    {stage.opportunities.map((opp) => (
                                        <Card key={opp.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                                            <CardContent className="p-4 space-y-2">
                                                <Link href={opportunitiesRoute.show(opp.id).url} className="font-medium block hover:underline">
                                                    {opp.title}
                                                </Link>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>{opp.contact?.name || 'No Contact'}</span>
                                                    <Badge variant={statusVariant[opp.status] || 'default'} className="text-[10px] px-1.5 py-0">
                                                        {opp.status}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {stage.opportunities.length === 0 && (
                                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center text-sm text-muted-foreground">
                                            Empty
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

OpportunitiesIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);
