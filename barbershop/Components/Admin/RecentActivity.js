import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RecentActivity({ agendamentos }) {
  const statusColors = {
    agendado: "bg-blue-100 text-blue-800",
    concluido: "bg-green-100 text-green-800",
    cancelado: "bg-red-100 text-red-800",
  };

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agendamentos.map((agendamento) => (
            <div 
              key={agendamento.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold">{agendamento.cliente_nome}</p>
                <p className="text-sm text-gray-600">
                  {agendamento.servico_nome} • {agendamento.barbeiro_nome}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(agendamento.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Badge className={statusColors[agendamento.status]}>
                {agendamento.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}