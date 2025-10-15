import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User } from "lucide-react";

export default function BarbeiroList({ barbeiros, isLoading, onEdit, onDelete }) {
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
        <CardTitle>Barbeiros Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {barbeiros.map((barbeiro) => (
            <div key={barbeiro.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {barbeiro.foto_url ? (
                  <img src={barbeiro.foto_url} alt={barbeiro.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{barbeiro.nome}</h4>
                  <Badge variant={barbeiro.ativo ? "default" : "secondary"} className={barbeiro.ativo ? "bg-green-100 text-green-800" : ""}>
                    {barbeiro.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{barbeiro.especialidade}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{barbeiro.descricao}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => onEdit(barbeiro)}>
                    <Edit className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(barbeiro.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Excluir
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