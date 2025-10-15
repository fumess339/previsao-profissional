import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Users, TrendingUp, Scissors, ShoppingBag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

import StatsCard from "../components/admin/StatsCard";
import BarbeiroPerformance from "../components/admin/BarbeiroPerformance";
import RecentActivity from "../components/admin/RecentActivity";
import ProtectedAdminRoute from "../Components/Auth/ProtectedAdminRoute";

function AdminDashboardPage() {
  const { data: agendamentos = [] } = useQuery({
    queryKey: ['todos-agendamentos'],
    queryFn: () => base44.entities.Agendamento.list('-created_date'),
  });

  const { data: vendas = [] } = useQuery({
    queryKey: ['vendas'],
    queryFn: () => base44.entities.Venda.list('-created_date'),
  });

  const { data: barbeiros = [] } = useQuery({
    queryKey: ['barbeiros-admin'],
    queryFn: () => base44.entities.Barbeiro.list(),
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ['servicos-stats'],
    queryFn: () => base44.entities.Servico.list(),
  });

  const agendamentosHoje = agendamentos.filter(a => {
    const hoje = new Date().toDateString();
    const dataAgendamento = new Date(a.data_hora).toDateString();
    return hoje === dataAgendamento && a.status === 'agendado';
  });

  const totalReceita = [
    ...agendamentos.filter(a => a.status === 'concluido' && !a.cortesia).map(a => a.servico_preco || 0),
    ...vendas.map(v => v.total || 0)
  ].reduce((sum, val) => sum + val, 0);

  const agendamentosPorBarbeiro = barbeiros.map(barbeiro => ({
    nome: barbeiro.nome.split(' ')[0],
    total: agendamentos.filter(a => a.barbeiro_id === barbeiro.id).length,
  }));

  const receitaMensal = Array.from({ length: 6 }, (_, i) => {
    const mes = new Date();
    mes.setMonth(mes.getMonth() - (5 - i));
    const mesStr = mes.toLocaleString('pt-BR', { month: 'short' });
    
    const receitaMes = agendamentos
      .filter(a => {
        const dataAgendamento = new Date(a.data_hora);
        return dataAgendamento.getMonth() === mes.getMonth() && 
               dataAgendamento.getFullYear() === mes.getFullYear() &&
               a.status === 'concluido';
      })
      .reduce((sum, a) => sum + (a.servico_preco || 0), 0);
    
    return { mes: mesStr, receita: receitaMes };
  });

  const servicosMaisVendidos = servicos.map(servico => ({
    nome: servico.nome,
    quantidade: agendamentos.filter(a => a.servico_id === servico.id && a.status === 'concluido').length,
  })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Visão completa e análises do seu negócio</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Receita Total"
            value={`R$ ${totalReceita.toFixed(2)}`}
            icon={DollarSign}
            bgColor="bg-green-500"
          />
          <StatsCard
            title="Agendamentos Hoje"
            value={agendamentosHoje.length}
            icon={Calendar}
            bgColor="bg-blue-500"
          />
          <StatsCard
            title="Total de Agendamentos"
            value={agendamentos.length}
            icon={TrendingUp}
            bgColor="bg-purple-500"
          />
          <StatsCard
            title="Barbeiros Ativos"
            value={barbeiros.filter(b => b.ativo).length}
            icon={Users}
            bgColor="bg-orange-500"
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Receita Mensal */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Receita dos Últimos 6 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                    formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="receita" 
                    stroke="#000000" 
                    strokeWidth={3}
                    dot={{ fill: '#000000', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Agendamentos por Barbeiro */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Agendamentos por Barbeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agendamentosPorBarbeiro}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="nome" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="total" fill="#000000" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance e Serviços */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Individual dos Barbeiros */}
          <BarbeiroPerformance barbeiros={barbeiros} agendamentos={agendamentos} />

          {/* Serviços Mais Vendidos */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Serviços Mais Procurados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicosMaisVendidos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, quantidade }) => `${nome}: ${quantidade}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {servicosMaisVendidos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Análise Detalhada por Barbeiro */}
        <Card className="border-2 border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Análise Detalhada de Cada Barbeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {barbeiros.map((barbeiro) => {
                const agendamentosBarbeiro = agendamentos.filter(a => a.barbeiro_id === barbeiro.id);
                const concluidos = agendamentosBarbeiro.filter(a => a.status === 'concluido').length;
                const cancelados = agendamentosBarbeiro.filter(a => a.status === 'cancelado').length;
                const receita = agendamentosBarbeiro
                  .filter(a => a.status === 'concluido')
                  .reduce((sum, a) => sum + (a.servico_preco || 0), 0);
                const taxaConclusao = agendamentosBarbeiro.length > 0 
                  ? (concluidos / agendamentosBarbeiro.length * 100).toFixed(1) 
                  : 0;

                return (
                  <div key={barbeiro.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                        {barbeiro.foto_url ? (
                          <img src={barbeiro.foto_url} alt={barbeiro.nome} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-xl">
                            {barbeiro.nome[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{barbeiro.nome}</h3>
                        <p className="text-gray-600">{barbeiro.especialidade}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Agendamentos</p>
                        <p className="text-2xl font-bold">{agendamentosBarbeiro.length}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Concluídos</p>
                        <p className="text-2xl font-bold text-green-700">{concluidos}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Cancelados</p>
                        <p className="text-2xl font-bold text-red-700">{cancelados}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Receita Total</p>
                        <p className="text-2xl font-bold text-blue-700">R$ {receita.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Taxa de Conclusão</span>
                        <span className="text-sm font-bold">{taxaConclusao}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-black h-3 rounded-full transition-all duration-500"
                          style={{ width: `${taxaConclusao}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <RecentActivity agendamentos={agendamentos.slice(0, 10)} />
      </div>
    </div>
  );
}

export default function AdminDashboardPageProtected() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboardPage />
    </ProtectedAdminRoute>
  );
}