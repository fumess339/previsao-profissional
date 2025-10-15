import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import ProdutoForm from "../components/admin/ProdutoForm";
import ProdutoListAdmin from "../components/admin/ProdutoListAdmin";
import ProtectedAdminRoute from "../Components/Auth/ProtectedAdminRoute";

function AdminProdutosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const queryClient = useQueryClient();

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos-admin'],
    queryFn: () => base44.entities.Produto.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Produto.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-admin'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Produto.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-admin'] });
      setShowForm(false);
      setEditingProduto(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Produto.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos-admin'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingProduto) {
      updateMutation.mutate({ id: editingProduto.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Produtos</h1>
            <p className="text-gray-600 mt-2">Gerencie o estoque de produtos</p>
          </div>
          <Button 
            onClick={() => {
              setEditingProduto(null);
              setShowForm(!showForm);
            }}
            className="bg-black hover:bg-gray-800 text-white w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <ProdutoForm
              produto={editingProduto}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProduto(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </AnimatePresence>

        <ProdutoListAdmin
          produtos={produtos}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function AdminProdutosPageProtected() {
  return (
    <ProtectedAdminRoute>
      <AdminProdutosPage />
    </ProtectedAdminRoute>
  );
}