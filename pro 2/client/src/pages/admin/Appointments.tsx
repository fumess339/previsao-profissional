import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CheckCircle2, Clock, Phone, User, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminAppointments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery();
  const { data: barbers } = trpc.barbers.listAll.useQuery();
  const { data: services } = trpc.services.listAll.useQuery();

  const updateAppointment = trpc.appointments.update.useMutation({
    onSuccess: () => {
      toast.success("Agendamento atualizado com sucesso!");
      utils.appointments.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar agendamento");
    },
  });

  const deleteAppointment = trpc.appointments.delete.useMutation({
    onSuccess: () => {
      toast.success("Agendamento removido com sucesso!");
      utils.appointments.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover agendamento");
    },
  });

  const handleStatusChange = (id: number, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    updateAppointment.mutate({ id, status });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este agendamento?")) {
      deleteAppointment.mutate({ id });
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (statusFilter === "all") return appointments;
    return appointments.filter((apt) => apt.status === statusFilter);
  }, [appointments, statusFilter]);

  const getBarberName = (barberId: number) => {
    return barbers?.find((b) => b.id === barberId)?.name || "Desconhecido";
  };

  const getServiceName = (serviceId: number) => {
    return services?.find((s) => s.id === serviceId)?.name || "Desconhecido";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "secondary", label: "Pendente" },
      confirmed: { variant: "default", label: "Confirmado" },
      completed: { variant: "outline", label: "Concluído" },
      cancelled: { variant: "destructive", label: "Cancelado" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie todos os agendamentos da barbearia</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="completed">Concluídos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-border bg-card">
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments && filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-card-foreground">
                        {appointment.clientName}
                      </CardTitle>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <CardDescription>
                      {format(new Date(appointment.appointmentDate), "PPP 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, "confirmed")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirmar
                      </Button>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, "completed")}
                      >
                        Concluir
                      </Button>
                    )}
                    {(appointment.status === "pending" || appointment.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(appointment.id, "cancelled")}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Barbeiro</p>
                      <p className="text-muted-foreground">{getBarberName(appointment.barberId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Serviço</p>
                      <p className="text-muted-foreground">{getServiceName(appointment.serviceId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Telefone</p>
                      <p className="text-muted-foreground">{appointment.clientPhone}</p>
                    </div>
                  </div>
                  {appointment.clientEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-muted-foreground">{appointment.clientEmail}</p>
                      </div>
                    </div>
                  )}
                </div>
                {appointment.notes && (
                  <div className="mt-4 rounded-lg border border-border bg-muted/50 p-3">
                    <p className="text-sm font-medium text-foreground">Observações:</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card p-12 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Nenhum Agendamento Encontrado
          </h3>
          <p className="text-muted-foreground">
            {statusFilter === "all"
              ? "Não há agendamentos cadastrados ainda."
              : `Não há agendamentos com status "${statusFilter}".`}
          </p>
        </Card>
      )}
    </div>
  );
}
