
import Link from 'next/link'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from '@tabler/icons-react';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Botón de acceso rápido */}

        <Link href="/" className="w-full flex items-center">
          <SidebarMenuButton
            tooltip="Volver a Inicio"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 min-w-8"
          >
            <span>Volver a Inicio</span>
          </SidebarMenuButton>
        </Link>
        {/* Navegación principal */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} passHref>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
