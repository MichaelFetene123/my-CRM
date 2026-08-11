import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, Target, GitBranch, ListChecks } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import contacts from '@/routes/contacts';
import leads from '@/routes/leads';
import opportunities from '@/routes/opportunities';
import activities from '@/routes/activities';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Contacts',
        href: contacts.index().url,
        icon: Users,
    },
    {
        title: 'Leads',
        href: leads.index().url,
        icon: Target,
    },
    {
        title: 'Opportunities',
        href: opportunities.index().url,
        icon: GitBranch,
    },
    {
        title: 'Activities',
        href: activities.index().url,
        icon: ListChecks,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" render={<Link href={dashboard().url} prefetch />}>
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
