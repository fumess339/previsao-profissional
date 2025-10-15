import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package } from "lucide-react";

export default function ProdutoListAdmin({ produtos, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100">
                {produto.imagem_url ? (
                  <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{produto.nome}</h4>
                  <Badge variant={produto.ativo ? "default" : "secondary"} className={produto.ativo ? "bg-green-100 text-green-800" : ""}>
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <Badge className="mb-2">{produto.categoria}</Badge>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{produto.descricao}</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-lg font-bold">R$ {produto.preco?.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Estoque: {produto.estoque}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(produto)} className="flex-1">
                    <Edit className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(produto.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}