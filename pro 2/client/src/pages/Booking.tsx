import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Booking() {
  const [, setLocation] = useLocation();
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: barbers } = trpc.barbers.list.useQuery();
  const { data: services } = trpc.services.list.useQuery();
  
  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success("Agendamento realizado com sucesso!");
      setTimeout(() => {
        setLocation("/");
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar agendamento");
    },
  });

  // Gerar horários disponíveis (das 9h às 18h, a cada 30 minutos)
  const availableTimes = useMemo(() => {
    const times: string[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        times.push(timeString);
      }
    }
    return times;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!clientName || !clientPhone) {
      toast.error("Por favor, preencha seus dados de contato");
      return;
    }

    const [year, month, day] = selectedDate.split("-").map(Number);
    const [hour, minute] = selectedTime.split(":").map(Number);
    const appointmentDate = new Date(year, month - 1, day, hour, minute);

    createAppointment.mutate({
      barberId: parseInt(selectedBarber),
      serviceId: parseInt(selectedService),
      appointmentDate,
      clientName,
      clientPhone,
      clientEmail: clientEmail || undefined,
      notes: notes || undefined,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Agendamento Confirmado!</CardTitle>
            <CardDescription>
              Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Redirecionando para a página inicial...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Agendamento Online</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              Agende Seu Horário
            </h1>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário abaixo para garantir seu atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container">
          <Card className="mx-auto max-w-2xl border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Dados do Agendamento</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para realizar seu agendamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Barbeiro */}
                <div className="space-y-2">
                  <Label htmlFor="barber">Barbeiro *</Label>
                  <Select value={selectedBarber} onValueChange={setSelectedBarber}>
                    <SelectTrigger id="barber">
                      <SelectValue placeholder="Selecione um barbeiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers?.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id.toString()}>
                          {barber.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Serviço */}
                <div className="space-y-2">
                  <Label htmlFor="service">Serviço *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name} - R$ {(service.priceInCents / 100).toFixed(2)} ({service.durationMinutes} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Seus Dados</h3>
                  
                  {/* Nome */}
                  <div className="mb-4 space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="mb-4 space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4 space-y-2">
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Alguma observação sobre o atendimento?"
                      rows={3}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={createAppointment.isPending}
                >
                  {createAppointment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
