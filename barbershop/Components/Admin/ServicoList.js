import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Clock } from "lucide-react";

export default function ServicoList({ servicos, isLoading, onEdit, onDelete }) {
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
        <CardTitle>Serviços Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {servicos.map((servico) => (
            <div key={servico.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{servico.nome}</h4>
                  <Badge variant={servico.ativo ? "default" : "secondary"} className={servico.ativo ? "bg-green-100 text-green-800 mt-1" : "mt-1"}>
                    {servico.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-xl font-bold">R$ {servico.preco?.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">{servico.descricao}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <Clock className="w-4 h-4" />
                {servico.duracao} minutos
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(servico)}>
                  <Edit className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(servico.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}