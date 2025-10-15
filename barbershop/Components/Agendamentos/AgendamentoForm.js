import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Gift } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AgendamentoForm({ barbeiros, servicos, user, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    barbeiro_id: "",
    servico_id: "",
    data_hora: null,
    observacoes: "",
    usar_cortesia: false,
  });

  const [selectedTime, setSelectedTime] = useState("");

  const horarios = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
  ];

  const servicoSelecionado = servicos.find(s => s.id === formData.servico_id);
  const barbeiroSelecionado = barbeiros.find(b => b.id === formData.barbeiro_id);

  const podeCortesia = (user?.pontos_fidelidade || 0) >= 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.barbeiro_id || !formData.servico_id || !formData.data_hora || !selectedTime) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const [hours, minutes] = selectedTime.split(":");
    const dataHora = new Date(formData.data_hora);
    dataHora.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const barbeiro = barbeiros.find(b => b.id === formData.barbeiro_id);
    const servico = servicos.find(s => s.id === formData.servico_id);

    onSubmit({
      ...formData,
      data_hora: dataHora.toISOString(),
      barbeiro_nome: barbeiro?.nome,
      servico_nome: servico?.nome,
      servico_preco: servico?.preco,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="mb-8 border-2 border-black">
        <CardHeader className="bg-black text-white">
          <CardTitle>Novo Agendamento</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Barbeiro *</Label>
                <Select
                  value={formData.barbeiro_id}
                  onValueChange={(value) => setFormData({ ...formData, barbeiro_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {barbeiros.map((barbeiro) => (
                      <SelectItem key={barbeiro.id} value={barbeiro.id}>
                        {barbeiro.nome} - {barbeiro.especialidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Serviço *</Label>
                <Select
                  value={formData.servico_id}
                  onValueChange={(value) => setFormData({ ...formData, servico_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco?.toFixed(2)} ({servico.duracao}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.data_hora ? format(formData.data_hora, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.data_hora}
                      onSelect={(date) => setFormData({ ...formData, data_hora: date })}
                      disabled={(date) => date < new Date()}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Horário *</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios.map((horario) => (
                      <SelectItem key={horario} value={horario}>
                        {horario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Alguma preferência ou observação?"
                rows={3}
              />
            </div>

            {podeCortesia && (
              <div className="flex items-center space-x-2 p-4 bg-black text-white rounded-lg">
                <Checkbox
                  id="cortesia"
                  checked={formData.usar_cortesia}
                  onCheckedChange={(checked) => setFormData({ ...formData, usar_cortesia: checked })}
                />
                <label htmlFor="cortesia" className="flex items-center gap-2 cursor-pointer">
                  <Gift className="w-5 h-5" />
                  <span>Usar meu corte grátis (você tem 8 pontos!)</span>
                </label>
              </div>
            )}

            {servicoSelecionado && barbeiroSelecionado && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2">Resumo</h4>
                <p className="text-sm text-gray-600">
                  <strong>Barbeiro:</strong> {barbeiroSelecionado.nome}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Serviço:</strong> {servicoSelecionado.nome}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duração:</strong> {servicoSelecionado.duracao} minutos
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Valor:</strong> {formData.usar_cortesia ? (
                    <span className="text-green-600 font-bold">GRÁTIS (Cortesia)</span>
                  ) : (
                    `R$ ${servicoSelecionado.preco?.toFixed(2)}`
                  )}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t p-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
              {isLoading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}