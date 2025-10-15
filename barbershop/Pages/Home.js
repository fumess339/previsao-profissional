import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Scissors, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Star,
  Award,
  Gift,
  ChevronRight,
  User
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: servicos = [] } = useQuery({
    queryKey: ['servicos-home'],
    queryFn: () => base44.entities.Servico.filter({ ativo: true }),
  });

  const { data: barbeiros = [] } = useQuery({
    queryKey: ['barbeiros-home'],
    queryFn: () => base44.entities.Barbeiro.filter({ ativo: true }),
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos-home'],
    queryFn: () => base44.entities.Produto.filter({ ativo: true }),
  });

  const { data: user } = useQuery({
    queryKey: ['user-home'],
    queryFn: () => base44.auth.me(),
  });

  const pontosFidelidade = user?.pontos_fidelidade || 0;
  const cortesRealizados = user?.cortes_realizados || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop')",
            filter: "brightness(0.4)"
          }}
        />
        
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Scissors className="w-12 h-12" />
                <h1 className="text-5xl md:text-7xl font-bold">BarberPro</h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                A experiência premium que você merece. <br />
                Estilo, conforto e profissionalismo em cada corte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("Agendamentos")}>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Horário
                  </Button>
                </Link>
                <Link to={createPageUrl("Loja")}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 w-full sm:w-auto">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Ver Produtos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programa de Fidelidade - Destacado */}
      {user && (
        <section className="py-8 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Programa Fidelidade</h3>
                  <p className="text-gray-300">A cada 8 cortes, o próximo é grátis!</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold">{cortesRealizados}</p>
                  <p className="text-sm text-gray-300">Cortes feitos</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{pontosFidelidade}/8</p>
                  <p className="text-sm text-gray-300">Pontos acumulados</p>
                </div>
                <Link to={createPageUrl("Perfil")}>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                    Ver Perfil <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Serviços */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-gray-600 text-lg">Escolha o serviço perfeito para você</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico, index) => (
              <motion.div
                key={servico.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <Scissors className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-black text-white text-lg px-4 py-1">
                        R$ {servico.preco?.toFixed(2)}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{servico.nome}</h3>
                    <p className="text-gray-600 mb-4">{servico.descricao}</p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{servico.duracao} minutos</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={createPageUrl("Agendamentos")}>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-10 py-6 text-lg">
                Agendar Agora
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Barbeiros */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-gray-600 text-lg">Profissionais experientes e apaixonados</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbeiros.map((barbeiro, index) => (
              <motion.div
                key={barbeiro.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative h-80 bg-gray-100">
                    {barbeiro.foto_url ? (
                      <img 
                        src={barbeiro.foto_url} 
                        alt={barbeiro.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <h3 className="text-2xl font-bold">{barbeiro.nome}</h3>
                      <p className="text-sm text-gray-200">{barbeiro.especialidade}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600">{barbeiro.descricao}</p>
                    <div className="flex items-center gap-1 mt-4 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600 text-sm">(5.0)</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Produtos Premium</h2>
            <p className="text-gray-600 text-lg">Cuidados profissionais para levar para casa</p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.slice(0, 4).map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
                  <div className="h-48 bg-gray-100">
                    {produto.imagem_url ? (
                      <img 
                        src={produto.imagem_url} 
                        alt={produto.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-gray-200 text-black">{produto.categoria}</Badge>
                    <h3 className="font-bold text-lg mb-1">{produto.nome}</h3>
                    <p className="text-2xl font-bold">R$ {produto.preco?.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={createPageUrl("Loja")}>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-10 py-6 text-lg">
                Ver Todos os Produtos
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Por que escolher a BarberPro?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Profissionais Certificados",
                description: "Equipe altamente qualificada e experiente"
              },
              {
                icon: Scissors,
                title: "Equipamentos Premium",
                description: "Utilizamos apenas produtos de alta qualidade"
              },
              {
                icon: Gift,
                title: "Programa Fidelidade",
                description: "Ganhe cortes grátis sendo nosso cliente"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para transformar seu visual?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Agende seu horário agora e tenha a melhor experiência em barbearia
            </p>
            <Link to={createPageUrl("Agendamentos")}>
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-12 py-8 text-xl">
                <Calendar className="w-6 h-6 mr-3" />
                Agendar Meu Horário
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="w-8 h-8" />
                <h3 className="text-2xl font-bold">BarberPro</h3>
              </div>
              <p className="text-gray-400">
                Barbearia premium com atendimento de excelência
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl("Agendamentos")} className="hover:text-white transition-colors">Agendamentos</Link></li>
                <li><Link to={createPageUrl("Loja")} className="hover:text-white transition-colors">Loja</Link></li>
                <li><Link to={createPageUrl("Perfil")} className="hover:text-white transition-colors">Meu Perfil</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Horário de Funcionamento</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Segunda a Sexta: 9h - 20h</li>
                <li>Sábado: 9h - 18h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BarberPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}