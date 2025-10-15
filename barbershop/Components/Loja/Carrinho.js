import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Carrinho({ 
  carrinho, 
  onClose, 
  onRemover, 
  onAtualizarQuantidade,
  onFinalizar,
  isFinalizando 
}) {
  const [metodoPagamento, setMetodoPagamento] = useState("");

  const total = carrinho.reduce((sum, item) => sum + item.subtotal, 0);

  const handleFinalizar = () => {
    if (!metodoPagamento) {
      alert("Selecione um método de pagamento");
      return;
    }
    onFinalizar(metodoPagamento);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="border-b bg-black text-white flex flex-row items-center justify-between">
          <CardTitle>Carrinho</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4 flex-1">
          {carrinho.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Carrinho vazio
            </div>
          ) : (
            carrinho.map((item) => (
              <div key={item.produto_id} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                  {item.imagem_url ? (
                    <img src={item.imagem_url} alt={item.produto_nome} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.produto_nome}</h4>
                  <p className="text-sm text-gray-600">R$ {item.preco_unitario?.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onAtualizarQuantidade(item.produto_id, item.quantidade - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantidade}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onAtualizarQuantidade(item.produto_id, item.quantidade + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onRemover(item.produto_id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {item.subtotal?.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>

        {carrinho.length > 0 && (
          <CardFooter className="border-t flex-col gap-4 p-4">
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={handleFinalizar}
                disabled={isFinalizando}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isFinalizando ? "Finalizando..." : "Finalizar Compra"}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}