import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, Scissors, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const statCards = [
    {
      title: "Agendamentos Hoje",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      description: "Atendimentos programados para hoje",
    },
    {
      title: "Total de Agendamentos",
      value: stats?.totalAppointments || 0,
      icon: Clock,
      description: "Todos os agendamentos realizados",
    },
    {
      title: "Barbeiros Ativos",
      value: stats?.totalBarbers || 0,
      icon: Users,
      description: "Profissionais cadastrados",
    },
    {
      title: "Serviços Disponíveis",
      value: stats?.totalServices || 0,
      icon: Scissors,
      description: "Serviços oferecidos",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-border bg-card">
              <CardHeader>
                <div className="h-4 w-24 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Agendamentos Pendentes</CardTitle>
            <CardDescription>Aguardando confirmação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {stats?.pendingAppointments || 0}
                </div>
                <p className="text-sm text-muted-foreground">Requerem atenção</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Agendamentos Confirmados</CardTitle>
            <CardDescription>Prontos para atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {stats?.confirmedAppointments || 0}
                </div>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
