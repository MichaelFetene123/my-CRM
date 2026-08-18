import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Activity, Kanban, Users, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Meteors } from '@/components/ui/meteors';
import { LightRays } from '@/components/ui/light-rays';
import { RetroGrid } from '@/components/ui/retro-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types'; // Assuming there is a types file for the user

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    return (
        <>
            <Head title="Welcome to Personal CRM" />
            <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-background">
                {/* Background effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <LightRays className="opacity-50 dark:opacity-30" />
                    <Meteors number={30} />
                </div>
                
                {/* Header */}
                <header className="absolute top-0 z-50 flex w-full items-center justify-between p-6 lg:px-8">
                    <div className="flex items-center gap-2 text-foreground">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Business CRM</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={dashboard()} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors">
                                    Log in
                                </Link>
                                <Link href={register()} className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Hero Section */}
                <main className="z-10 flex flex-1 flex-col items-center justify-center px-4 text-center mt-20">
                    <div className="space-y-6 max-w-4xl">
                        <h1 className="bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                            Business CRM <br /> for Pipeline Clarity
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            Track contacts, log activities, and manage your pipeline effortlessly. Everything you need to maintain relationships and close deals.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button size="lg" className="group w-full sm:w-auto">
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={register()}>
                                        <Button size="lg" className="group w-full sm:w-auto">
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href={login()}>
                                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                            Log In
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Feature Highlights Grid */}
                <section className="z-10 w-full max-w-6xl px-6 pb-24 mt-16">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
                            <RetroGrid className="opacity-60" />
                            <div className="relative z-10 pointer-events-auto">
                                <CardHeader>
                                    <Kanban className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Pipeline & Kanban</CardTitle>
                                    <CardDescription>
                                        Visualize your workflow and drag-and-drop deals across stages.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Customizable stages</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Deal tracking</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Quick actions</li>
                                    </ul>
                                </CardContent>
                            </div>
                        </Card>
                        
                        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
                            <RetroGrid className="opacity-60" />
                            <div className="relative z-10 pointer-events-auto">
                                <CardHeader>
                                    <Users className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Contact Timelines</CardTitle>
                                    <CardDescription>
                                        Keep a rich history of every interaction and activity log.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Meeting notes</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Email tracking</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Follow-up reminders</li>
                                    </ul>
                                </CardContent>
                            </div>
                        </Card>
                        
                        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
                            <RetroGrid className="opacity-60" />
                            <div className="relative z-10 pointer-events-auto">
                                <CardHeader>
                                    <Activity className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Real-time Analytics</CardTitle>
                                    <CardDescription>
                                        Deferred data loading for lightning-fast performance and insights.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Conversion rates</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Activity metrics</li>
                                        <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Exportable reports</li>
                                    </ul>
                                </CardContent>
                            </div>
                        </Card>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="z-10 flex w-full items-center justify-center border-t border-muted bg-background/80 py-6 backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Personal CRM. All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
}
