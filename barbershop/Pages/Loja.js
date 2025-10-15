import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

import ProdutoCard from "../components/loja/ProdutoCard";
import Carrinho from "../components/loja/Carrinho";

export default function LojaPage() {
  const [carrinho, setCarrinho] = useState([]);
  const [showCarrinho, setShowCarrinho] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const queryClient = useQueryClient();

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => base44.entities.Produto.filter({ ativo: true }),
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const finalizarCompraMutation = useMutation({
    mutationFn: async (dadosVenda) => {
      const venda = await base44.entities.Venda.create(dadosVenda);
      
      for (const item of dadosVenda.itens) {
        const produto = produtos.find(p => p.id === item.produto_id);
        if (produto) {
          await base44.entities.Produto.update(item.produto_id, {
            estoque: (produto.estoque || 0) - item.quantidade
          });
        }
      }
      
      return venda;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      setCarrinho([]);
      setShowCarrinho(false);
    },
  });

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.produto_id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.produto_id === produto.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto_id: produto.id,
        produto_nome: produto.nome,
        quantidade: 1,
        preco_unitario: produto.preco,
        subtotal: produto.preco,
        imagem_url: produto.imagem_url,
      }]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.produto_id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade === 0) {
      removerDoCarrinho(produtoId);
      return;
    }
    
    setCarrinho(carrinho.map(item => 
      item.produto_id === produtoId 
        ? { 
            ...item, 
            quantidade: novaQuantidade,
            subtotal: item.preco_unitario * novaQuantidade 
          }
        : item
    ));
  };

  const finalizarCompra = (metodoPagamento) => {
    const total = carrinho.reduce((sum, item) => sum + item.subtotal, 0);
    
    finalizarCompraMutation.mutate({
      cliente_email: user?.email,
      cliente_nome: user?.full_name,
      itens: carrinho,
      total,
      metodo_pagamento: metodoPagamento,
    });
  };

  const categorias = ["todos", "pomada", "cera", "shampoo", "oleo", "navalha", "outros"];
  
  const produtosFiltrados = categoriaFiltro === "todos" 
    ? produtos 
    : produtos.filter(p => p.categoria === categoriaFiltro);

  const totalItensCarrinho = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Loja</h1>
            <p className="text-gray-600 mt-2">Produtos premium para cuidar do seu visual</p>
          </div>
          <Button 
            onClick={() => setShowCarrinho(!showCarrinho)}
            className="bg-black hover:bg-gray-800 text-white w-full md:w-auto relative"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Carrinho
            {totalItensCarrinho > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-white text-black border border-black">
                {totalItensCarrinho}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categorias.map(cat => (
            <Button
              key={cat}
              variant={categoriaFiltro === cat ? "default" : "outline"}
              onClick={() => setCategoriaFiltro(cat)}
              className={categoriaFiltro === cat ? "bg-black text-white" : "border-gray-300"}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        <AnimatePresence>
          {showCarrinho && (
            <Carrinho
              carrinho={carrinho}
              onClose={() => setShowCarrinho(false)}
              onRemover={removerDoCarrinho}
              onAtualizarQuantidade={atualizarQuantidade}
              onFinalizar={finalizarCompra}
              isFinalizando={finalizarCompraMutation.isPending}
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            produtosFiltrados.map(produto => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                onAdicionar={adicionarAoCarrinho}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}