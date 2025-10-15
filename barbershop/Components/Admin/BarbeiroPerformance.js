import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function BarbeiroPerformance({ barbeiros, agendamentos }) {
  const barbeiroStats = barbeiros.map(barbeiro => {
    const agendamentosBarbeiro = agendamentos.filter(a => a.barbeiro_id === barbeiro.id);
    const concluidos = agendamentosBarbeiro.filter(a => a.status === 'concluido').length;
    
    return {
      nome: barbeiro.nome,
      total: agendamentosBarbeiro.length,
      concluidos,
      taxa: agendamentosBarbeiro.length > 0 ? (concluidos / agendamentosBarbeiro.length * 100).toFixed(1) : 0
    };
  }).sort((a, b) => b.concluidos - a.concluidos);

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance dos Barbeiros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {barbeiroStats.map((stat, index) => (
            <div key={stat.nome}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{stat.nome}</p>
                    <p className="text-xs text-gray-500">
                      {stat.concluidos} concluídos de {stat.total} agendamentos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{stat.taxa}%</p>
                  <p className="text-xs text-gray-500">taxa conclusão</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stat.taxa}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}