import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Target, GitBranch, ListChecks, Shield, UserCog } from 'lucide-react';
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
import { useUnreadCount } from '@/components/activities/reminder-badge';
import { dashboard } from '@/routes';
import contacts from '@/routes/contacts';
import leads from '@/routes/leads';
import opportunities from '@/routes/opportunities';
import activities from '@/routes/activities';
import admin from '@/routes/admin';
import type { NavItem, PageProps } from '@/types';

export function AppSidebar() {
    const unreadCount = useUnreadCount();
    const { auth } = usePage<PageProps>().props;

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
            badge: unreadCount > 0 ? unreadCount : undefined,
        },
    ];

    if (auth.permissions?.manage_users) {
        mainNavItems.push({
            title: 'Users',
            href: admin.users.index().url,
            icon: UserCog,
        });
    }

    if (auth.permissions?.manage_roles) {
        mainNavItems.push({
            title: 'Roles',
            href: admin.roles.index().url,
            icon: Shield,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={<Link href={dashboard().url} prefetch />}
                        >
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
