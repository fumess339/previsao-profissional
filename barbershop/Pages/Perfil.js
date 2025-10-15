import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Scissors, Gift } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PerfilPage() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: agendamentos = [] } = useQuery({
    queryKey: ['meus-agendamentos', user?.email],
    queryFn: () => base44.entities.Agendamento.filter({ 
      cliente_email: user?.email,
      status: 'concluido'
    }, '-data_hora'),
    enabled: !!user,
  });

  const pontosFidelidade = user?.pontos_fidelidade || 0;
  const cortesRealizados = user?.cortes_realizados || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">Meu Perfil</h1>

        <div className="grid gap-6 mb-8">
          <Card className="border-2 border-black">
            <CardHeader className="bg-black text-white">
              <CardTitle className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">
                    {user?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="text-2xl">{user?.full_name}</div>
                  <div className="text-sm text-gray-300">{user?.email}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Scissors className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-gray-600">Cortes Realizados</p>
                    <p className="text-2xl font-bold">{cortesRealizados}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-gray-600">Pontos Fidelidade</p>
                    <p className="text-2xl font-bold">{pontosFidelidade}/8</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-black text-white rounded-lg">
                  <Gift className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-gray-300">Próximo Grátis</p>
                    <p className="text-2xl font-bold">{8 - pontosFidelidade}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Histórico de Cortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentos.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum corte realizado ainda</p>
              ) : (
                <div className="space-y-3">
                  {agendamentos.slice(0, 10).map((agendamento) => (
                    <div 
                      key={agendamento.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{agendamento.servico_nome}</p>
                        <p className="text-sm text-gray-600">
                          {agendamento.barbeiro_nome}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(agendamento.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        {agendamento.cortesia ? (
                          <Badge className="bg-black text-white">Cortesia</Badge>
                        ) : (
                          <p className="font-bold">R$ {agendamento.servico_preco?.toFixed(2)}</p>
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
    </div>
  );
}