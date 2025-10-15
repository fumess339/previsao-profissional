import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import BarbeiroForm from "../components/admin/BarbeiroForm";
import BarbeiroList from "../components/admin/BarbeiroList";
import ProtectedAdminRoute from "../Components/Auth/ProtectedAdminRoute";

function AdminBarbeirosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBarbeiro, setEditingBarbeiro] = useState(null);
  const queryClient = useQueryClient();

  const { data: barbeiros = [], isLoading } = useQuery({
    queryKey: ['barbeiros-admin'],
    queryFn: () => base44.entities.Barbeiro.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Barbeiro.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbeiros-admin'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Barbeiro.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbeiros-admin'] });
      setShowForm(false);
      setEditingBarbeiro(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Barbeiro.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barbeiros-admin'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingBarbeiro) {
      updateMutation.mutate({ id: editingBarbeiro.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (barbeiro) => {
    setEditingBarbeiro(barbeiro);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este barbeiro?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Barbeiros</h1>
            <p className="text-gray-600 mt-2">Gerencie os profissionais da barbearia</p>
          </div>
          <Button 
            onClick={() => {
              setEditingBarbeiro(null);
              setShowForm(!showForm);
            }}
            className="bg-black hover:bg-gray-800 text-white w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Barbeiro
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <BarbeiroForm
              barbeiro={editingBarbeiro}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingBarbeiro(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </AnimatePresence>

        <BarbeiroList
          barbeiros={barbeiros}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function AdminBarbeirosPageProtected() {
  return (
    <ProtectedAdminRoute>
      <AdminBarbeirosPage />
    </ProtectedAdminRoute>
  );
}