import * as React from 'react';
import {
  IconCreditCard,
  IconDashboard,
  IconPackage,
  IconSettings,
  IconShoppingBag,
} from '@tabler/icons-react';

import Image from 'next/image';
import { signOut } from 'next-auth/react';

import { NavMain } from '@/components/Dashboard/nav-main';
import { NavSecondary } from '@/components/Dashboard/nav-secondary';
import { NavUser } from '@/components/Dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Button } from '../ui/button';

type User = {
  name: string;
  email: string;
  image?: string;
  role?: string;
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
 const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null 

  const navMain = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Inventario',
      url: '/admin/inventory',
      icon: IconPackage,
    },
    {
      title: 'Pedidos',
      url: '/admin/orders',
      icon: IconShoppingBag,
    },
    {
      title: 'Transacciones',
      url: '/admin/transactions',
      icon: IconCreditCard,
    },
    // Solo para ADMIN
    ...(user.role === 'ADMIN'
      ? [
          {
            title: 'Usuarios',
            url: '/admin/users',
            icon: IconCreditCard,
          },
        
        ]
      : []),
  ];

  const navSecondary = [
    {
      title: 'Configuración',
      url: '#',
      icon: IconSettings,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-base font-semibold">SAM</span>
              </a>
            </SidebarMenuButton>
            <NavUser user={{ name: user.name, email: user.email, image: user.image ?? '/default-avatar.png' }} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
