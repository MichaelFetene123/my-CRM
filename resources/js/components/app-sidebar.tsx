import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Target, GitBranch, ListChecks, Shield, UserCog, StickyNote } from 'lucide-react';
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
import { usePermissions } from '@/hooks/use-permissions';

export function AppSidebar() {
    const unreadCount = useUnreadCount();
    const { auth } = usePage<PageProps>().props;

    const { hasPermission } = usePermissions();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
            icon: LayoutGrid,
        }
    ];

    if (hasPermission('contacts.view')) {
        mainNavItems.push({
            title: 'Contacts',
            href: contacts.index().url,
            icon: Users,
        });
    }

    if (hasPermission('leads.view')) {
        mainNavItems.push({
            title: 'Leads',
            href: leads.index().url,
            icon: Target,
        });
    }

    if (hasPermission('opportunities.view')) {
        mainNavItems.push({
            title: 'Opportunities',
            href: opportunities.index().url,
            icon: GitBranch,
        });
    }

    if (hasPermission('activities.view')) {
        mainNavItems.push({
            title: 'Activities',
            href: activities.index().url,
            icon: ListChecks,
            badge: unreadCount > 0 ? unreadCount : undefined,
        });
    }

    if (hasPermission('notes.view')) {
        mainNavItems.push({
            title: 'Notes',
            href: '/notes',
            icon: StickyNote,
        });
    }

    if (hasPermission('users.view')) {
        mainNavItems.push({
            title: 'Users',
            href: admin.users.index().url,
            icon: UserCog,
        });
    }

    if (hasPermission('roles.view')) {
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
                            render={<Link href="/" prefetch />}
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
