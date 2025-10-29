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
import { Edit, Plus, Trash2, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { Barber } from "../../../../drizzle/schema";

export default function AdminBarbers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    specialties: "",
  });

  const utils = trpc.useUtils();
  const { data: barbers, isLoading } = trpc.barbers.listAll.useQuery();

  const createBarber = trpc.barbers.create.useMutation({
    onSuccess: () => {
      toast.success("Barbeiro cadastrado com sucesso!");
      utils.barbers.listAll.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cadastrar barbeiro");
    },
  });

  const updateBarber = trpc.barbers.update.useMutation({
    onSuccess: () => {
      toast.success("Barbeiro atualizado com sucesso!");
      utils.barbers.listAll.invalidate();
      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar barbeiro");
    },
  });

  const deleteBarber = trpc.barbers.delete.useMutation({
    onSuccess: () => {
      toast.success("Barbeiro removido com sucesso!");
      utils.barbers.listAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover barbeiro");
    },
  });

  const openDialog = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber);
      setFormData({
        name: barber.name,
        email: barber.email || "",
        phone: barber.phone || "",
        bio: barber.bio || "",
        specialties: barber.specialties || "",
      });
    } else {
      setEditingBarber(null);
      setFormData({ name: "", email: "", phone: "", bio: "", specialties: "" });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingBarber(null);
    setFormData({ name: "", email: "", phone: "", bio: "", specialties: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (editingBarber) {
      updateBarber.mutate({ id: editingBarber.id, ...formData });
    } else {
      createBarber.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este barbeiro?")) {
      deleteBarber.mutate({ id });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Barbeiros</h1>
          <p className="text-muted-foreground">Gerencie os profissionais da barbearia</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Barbeiro
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
      ) : barbers && barbers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-card-foreground">{barber.name}</CardTitle>
                      <Badge variant={barber.isActive ? "default" : "secondary"} className="mt-1">
                        {barber.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {barber.email && (
                  <p className="text-sm text-muted-foreground">📧 {barber.email}</p>
                )}
                {barber.phone && (
                  <p className="text-sm text-muted-foreground">📱 {barber.phone}</p>
                )}
                {barber.bio && (
                  <p className="text-sm text-muted-foreground">{barber.bio}</p>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openDialog(barber)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(barber.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card p-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Nenhum Barbeiro Cadastrado
          </h3>
          <p className="mb-4 text-muted-foreground">
            Comece adicionando os profissionais da sua barbearia.
          </p>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Barbeiro
          </Button>
        </Card>
      )}

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingBarber ? "Editar Barbeiro" : "Adicionar Barbeiro"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do profissional abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Breve descrição sobre o profissional"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades</Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Ex: Cortes clássicos, Barbas, Degradês"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createBarber.isPending || updateBarber.isPending}
              >
                {editingBarber ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
