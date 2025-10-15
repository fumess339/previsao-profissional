import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Scissors } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MeusAgendamentos({ agendamentos }) {
  const agendamentosFuturos = agendamentos.filter(a => 
    new Date(a.data_hora) > new Date() && a.status === 'agendado'
  );

  const agendamentosPassados = agendamentos.filter(a => 
    new Date(a.data_hora) <= new Date() || a.status !== 'agendado'
  );

  const statusColors = {
    agendado: "bg-blue-100 text-blue-800 border-blue-200",
    concluido: "bg-green-100 text-green-800 border-green-200",
    cancelado: "bg-red-100 text-red-800 border-red-200",
  };

  const AgendamentoCard = ({ agendamento }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{agendamento.servico_nome}</h4>
          <p className="text-sm text-gray-600">{agendamento.barbeiro_nome}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={`${statusColors[agendamento.status]} border`}>
            {agendamento.status}
          </Badge>
          {agendamento.cortesia && (
            <Badge className="bg-black text-white">Cortesia</Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(agendamento.data_hora), "dd/MM/yyyy", { locale: ptBR })}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {format(new Date(agendamento.data_hora), "HH:mm")}
        </div>
      </div>
      {agendamento.observacoes && (
        <p className="text-sm text-gray-500 mt-2 italic">
          Obs: {agendamento.observacoes}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {agendamentosFuturos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendamentosFuturos.map(agendamento => (
              <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
            ))}
          </CardContent>
        </Card>
      )}

      {agendamentosPassados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendamentosPassados.slice(0, 5).map(agendamento => (
              <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
            ))}
          </CardContent>
        </Card>
      )}

      {agendamentos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Scissors className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Você ainda não tem agendamentos</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}