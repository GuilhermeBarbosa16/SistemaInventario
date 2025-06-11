
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema",
    });
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-wood-50 to-wood-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mb-4 flex justify-between items-center">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-wood-600">
                  Olá, {user.email}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-wood-300 text-wood-700 hover:bg-wood-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
