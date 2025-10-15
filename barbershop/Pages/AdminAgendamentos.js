import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, X, Calendar } from "lucide-react";
import ProtectedAdminRoute from "../Components/Auth/ProtectedAdminRoute";

function AdminAgendamentosPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const queryClient = useQueryClient();

  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ['admin-agendamentos'],
    queryFn: () => base44.entities.Agendamento.list('-data_hora'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const agendamento = agendamentos.find(a => a.id === id);
      
      if (status === 'concluido' && agendamento.status !== 'concluido') {
        const { data: userData } = await base44.entities.User.filter({ email: agendamento.cliente_email });
        const user = userData[0];
        
        if (user) {
          const novosCortes = (user.cortes_realizados || 0) + 1;
          const novosPontos = agendamento.cortesia ? 0 : (user.pontos_fidelidade || 0) + 1;
          
          await base44.entities.User.update(user.id, {
            cortes_realizados: novosCortes,
            pontos_fidelidade: novosPontos >= 8 ? novosPontos - 8 : novosPontos,
          });
        }
      }
      
      return base44.entities.Agendamento.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agendamentos'] });
    },
  });

  const agendamentosFiltrados = filtroStatus === "todos" 
    ? agendamentos 
    : agendamentos.filter(a => a.status === filtroStatus);

  const statusColors = {
    agendado: "bg-blue-100 text-blue-800 border-blue-200",
    concluido: "bg-green-100 text-green-800 border-green-200",
    cancelado: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Agendamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os agendamentos</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["todos", "agendado", "concluido", "cancelado"].map(status => (
            <Button
              key={status}
              variant={filtroStatus === status ? "default" : "outline"}
              onClick={() => setFiltroStatus(status)}
              className={filtroStatus === status ? "bg-black text-white" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lista de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              </div>
            ) : agendamentosFiltrados.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum agendamento encontrado</p>
            ) : (
              <div className="space-y-3">
                {agendamentosFiltrados.map((agendamento) => (
                  <div 
                    key={agendamento.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-lg">{agendamento.cliente_nome}</p>
                        <Badge className={`${statusColors[agendamento.status]} border`}>
                          {agendamento.status}
                        </Badge>
                        {agendamento.cortesia && (
                          <Badge className="bg-black text-white">Cortesia</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {agendamento.servico_nome} • {agendamento.barbeiro_nome}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(agendamento.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Obs: {agendamento.observacoes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {agendamento.status === 'agendado' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatusMutation.mutate({ 
                              id: agendamento.id, 
                              status: 'concluido' 
                            })}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => updateStatusMutation.mutate({ 
                              id: agendamento.id, 
                              status: 'cancelado' 
                            })}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminAgendamentosPageProtected() {
  return (
    <ProtectedAdminRoute>
      <AdminAgendamentosPage />
    </ProtectedAdminRoute>
  );
}