import React from 'react';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from './ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
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

  const handleMenuClick = () => {
    console.log('Menu button clicked!');
    toast({
      title: "Menu",
      description: "Botão do menu clicado!",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        
        <main className="flex-1 min-w-0 p-2 sm:p-4 md:p-6 bg-gradient-to-br from-wood-50 to-wood-100">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Button
                variant="outline"
                size="sm"
                onClick={handleMenuClick}
                className="border-wood-300 text-wood-700 hover:bg-wood-100"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu Teste
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-wood-600">
                  Olá, {user.name}
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
