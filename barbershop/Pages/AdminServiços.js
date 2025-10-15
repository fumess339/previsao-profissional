import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import ServicoForm from "../components/admin/ServicoForm";
import ServicoList from "../components/admin/ServicoList";
import ProtectedAdminRoute from "../Components/Auth/ProtectedAdminRoute";

function AdminServicosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const queryClient = useQueryClient();

  const { data: servicos = [], isLoading } = useQuery({
    queryKey: ['servicos-admin'],
    queryFn: () => base44.entities.Servico.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Servico.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-admin'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Servico.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-admin'] });
      setShowForm(false);
      setEditingServico(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Servico.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos-admin'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingServico) {
      updateMutation.mutate({ id: editingServico.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (servico) => {
    setEditingServico(servico);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Serviços</h1>
            <p className="text-gray-600 mt-2">Gerencie os serviços oferecidos</p>
          </div>
          <Button 
            onClick={() => {
              setEditingServico(null);
              setShowForm(!showForm);
            }}
            className="bg-black hover:bg-gray-800 text-white w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Serviço
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <ServicoForm
              servico={editingServico}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingServico(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </AnimatePresence>

        <ServicoList
          servicos={servicos}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function AdminServicosPageProtected() {
  return (
    <ProtectedAdminRoute>
      <AdminServicosPage />
    </ProtectedAdminRoute>
  );
}