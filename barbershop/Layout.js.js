import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scissors, Calendar, ShoppingBag, User, LayoutDashboard, Users, Package, Home, LogOut, ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const isAdmin = user?.role === "admin";
  const isIndexPage = currentPageName === "Index";

  // Se for a página index, não mostrar sidebar
  if (isIndexPage) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const clientNavItems = [
    {
      title: "Início",
      url: createPageUrl("Home"),
      icon: Home,
    },
    {
      title: "Agendamentos",
      url: createPageUrl("Agendamentos"),
      icon: Calendar,
    },
    {
      title: "Loja",
      url: createPageUrl("Loja"),
      icon: ShoppingBag,
    },
    {
      title: "Meu Perfil",
      url: createPageUrl("Perfil"),
      icon: User,
    },
  ];

  const adminNavItems = [
    {
      title: "Dashboard",
      url: createPageUrl("AdminDashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "Barbeiros",
      url: createPageUrl("AdminBarbeiros"),
      icon: Users,
    },
    {
      title: "Serviços",
      url: createPageUrl("AdminServicos"),
      icon: Scissors,
    },
    {
      title: "Produtos",
      url: createPageUrl("AdminProdutos"),
      icon: Package,
    },
    {
      title: "Agendamentos",
      url: createPageUrl("AdminAgendamentos"),
      icon: Calendar,
    },
  ];

  const navigationItems = isAdmin ? adminNavItems : clientNavItems;

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --sidebar-background: #000000;
          --sidebar-foreground: #ffffff;
          --sidebar-primary: #ffffff;
          --sidebar-primary-foreground: #000000;
          --sidebar-accent: #1a1a1a;
          --sidebar-accent-foreground: #ffffff;
          --sidebar-border: #2a2a2a;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-white">
        <Sidebar className="border-r border-gray-200 bg-black">
          <SidebarHeader className="border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">BarberPro</h2>
                  <p className="text-xs text-gray-400">
                    {isAdmin ? "Área Administrativa" : "Área do Cliente"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(createPageUrl("Index"))}
              className="mt-4 text-gray-400 hover:text-white hover:bg-gray-900 w-full justify-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                {isAdmin ? "Administração" : "Menu"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-gray-900 text-white transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === item.url ? 'bg-white text-black hover:bg-white' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {!isAdmin && user && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                  Fidelidade
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-3 bg-gray-900 rounded-lg mx-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Próximo Grátis</span>
                      <span className="text-sm font-bold text-white">
                        {user.pontos_fidelidade || 0}/8
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((user.pontos_fidelidade || 0) / 8) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Faltam {8 - (user.pontos_fidelidade || 0)} cortes para ganhar 1 grátis!
                    </p>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-800 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {user?.full_name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {isAdmin ? "Administrador" : "Cliente"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-900 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold">BarberPro</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}