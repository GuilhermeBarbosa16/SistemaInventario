import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Minus,
  History,
  FolderOpen,
  Home,
  Hammer
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Estoque",
    url: "/inventario",
    icon: Package,
  },
  {
    title: "Nova Retirada",
    url: "/retirada",
    icon: Minus,
  },
  {
    title: "Histórico",
    url: "/historico",
    icon: History,
  },
  {
    title: "Projetos",
    url: "/projetos",
    icon: FolderOpen,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-wood-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-wood-600 rounded-lg">
            <Hammer className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-wood-800">MarcenariaPro</h1>
            <p className="text-sm text-wood-600">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-wood-700 font-semibold">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="hover:bg-wood-100 data-[active=true]:bg-wood-200 data-[active=true]:text-wood-800"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
