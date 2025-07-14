import React from 'react'
import { AppSidebar } from '@/components/Dashboard/app-sidebar';
 import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function index() {
  return (
   <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <main>Hola</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
