import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User as UserIcon, Scissors, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

import AgendamentoForm from "../components/agendamentos/AgendamentoForm";
import MeusAgendamentos from "../components/agendamentos/MeusAgendamentos";

export default function AgendamentosPage() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    async function loadUser() {
      const userData = await base44.auth.me();
      setUser(userData);
    }
    loadUser();
  }, []);

  const { data: agendamentos = [] } = useQuery({
    queryKey: ['agendamentos', user?.email],
    queryFn: () => base44.entities.Agendamento.filter({ cliente_email: user?.email }, '-data_hora'),
    enabled: !!user,
  });

  const { data: barbeiros = [] } = useQuery({
    queryKey: ['barbeiros'],
    queryFn: () => base44.entities.Barbeiro.filter({ ativo: true }),
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ['servicos'],
    queryFn: () => base44.entities.Servico.filter({ ativo: true }),
  });

  const createAgendamentoMutation = useMutation({
    mutationFn: async (data) => {
      const pontosFidelidade = user.pontos_fidelidade || 0;
      const usarCortesia = pontosFidelidade >= 8 && data.usar_cortesia;

      const agendamento = await base44.entities.Agendamento.create({
        ...data,
        cliente_email: user.email,
        cliente_nome: user.full_name,
        cortesia: usarCortesia,
      });

      if (usarCortesia) {
        await base44.auth.updateMe({
          pontos_fidelidade: 0,
        });
      }

      return agendamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setShowForm(false);
      window.location.reload();
    },
  });

  const handleCreateAgendamento = (data) => {
    createAgendamentoMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Agendamentos</h1>
            <p className="text-gray-600 mt-2">Agende seu horário com nossos profissionais</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-black hover:bg-gray-800 text-white w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <AgendamentoForm
              barbeiros={barbeiros}
              servicos={servicos}
              user={user}
              onSubmit={handleCreateAgendamento}
              onCancel={() => setShowForm(false)}
              isLoading={createAgendamentoMutation.isPending}
            />
          )}
        </AnimatePresence>

        <MeusAgendamentos agendamentos={agendamentos} />
      </div>
    </div>
  );
}