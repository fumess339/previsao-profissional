import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";

export default function ProdutoCard({ produto, onAdicionar }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <div className="relative h-64 bg-gray-100">
          {produto.imagem_url ? (
            <img 
              src={produto.imagem_url} 
              alt={produto.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <Badge className="absolute top-3 right-3 bg-black text-white">
            {produto.categoria}
          </Badge>
        </div>
        <CardHeader className="p-4">
          <h3 className="font-bold text-lg">{produto.nome}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{produto.descricao}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">R$ {produto.preco?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}
              </p>
            </div>
            <Button
              onClick={() => onAdicionar(produto)}
              disabled={!produto.estoque || produto.estoque === 0}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}