import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Plus, Scissors, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Service } from "../../../../drizzle/schema";

export default function AdminServices() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: "",
    priceInCents: "",
    category: "",
  });

  const utils = trpc.useUtils();
  const { data: services, isLoading } = trpc.services.listAll.useQuery();

  const createService = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Serviço cadastrado com sucesso!");
      utils.services.listAll.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cadastrar serviço");
    },
  });

  const updateService = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Serviço atualizado com sucesso!");
      utils.services.listAll.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar serviço");
    },
  });

  const deleteService = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Serviço removido com sucesso!");
      utils.services.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover serviço");
    },
  });

  const openDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || "",
        durationMinutes: service.durationMinutes.toString(),
        priceInCents: (service.priceInCents / 100).toFixed(2),
        category: service.category || "",
      });
    } else {
      setEditingService(null);
      setFormData({ name: "", description: "", durationMinutes: "", priceInCents: "", category: "" });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
    setFormData({ name: "", description: "", durationMinutes: "", priceInCents: "", category: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.durationMinutes || !formData.priceInCents) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const data = {
      name: formData.name,
      description: formData.description || undefined,
      durationMinutes: parseInt(formData.durationMinutes),
      priceInCents: Math.round(parseFloat(formData.priceInCents) * 100),
      category: formData.category || undefined,
    };

    if (editingService) {
      updateService.mutate({ id: editingService.id, ...data });
    } else {
      createService.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      deleteService.mutate({ id });
    }
  };

  // Agrupar serviços por categoria
  const servicesByCategory = services?.reduce((acc, service) => {
    const category = service.category || "Outros";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos pela barbearia</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      ) : services && services.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(servicesByCategory || {}).map(([category, categoryServices]) => (
            <div key={category}>
              <h2 className="mb-4 text-xl font-semibold text-foreground">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices?.map((service) => (
                  <Card key={service.id} className="border-border bg-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Scissors className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-card-foreground">{service.name}</CardTitle>
                            <Badge variant={service.isActive ? "default" : "secondary"} className="mt-1">
                              {service.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        R$ {(service.priceInCents / 100).toFixed(2)}
                      </div>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {service.durationMinutes} minutos
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openDialog(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card p-12 text-center">
          <Scissors className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Nenhum Serviço Cadastrado
          </h3>
          <p className="mb-4 text-muted-foreground">
            Comece adicionando os serviços oferecidos pela sua barbearia.
          </p>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Serviço
          </Button>
        </Card>
      )}

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Serviço" : "Adicionar Serviço"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do serviço abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Corte Masculino"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Corte, Barba, Combo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceInCents}
                    onChange={(e) => setFormData({ ...formData, priceInCents: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o serviço oferecido"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createService.isPending || updateService.isPending}
              >
                {editingService ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
