import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, Calendar, Scissors, Settings, Users } from "lucide-react";
import { useLocation } from "wouter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      isActive: location === "/admin",
    },
    {
      title: "Agendamentos",
      href: "/admin/agendamentos",
      icon: Calendar,
      isActive: location === "/admin/agendamentos",
    },
    {
      title: "Barbeiros",
      href: "/admin/barbeiros",
      icon: Users,
      isActive: location === "/admin/barbeiros",
    },
    {
      title: "Serviços",
      href: "/admin/servicos",
      icon: Scissors,
      isActive: location === "/admin/servicos",
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      title="Barbearia Pro"
      subtitle="Painel Administrativo"
    >
      {children}
    </DashboardLayout>
  );
}
