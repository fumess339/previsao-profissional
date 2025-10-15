import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Scissors, 
  Calendar, 
  ShoppingBag, 
  Star,
  Award,
  Clock,
  Shield,
  TrendingUp,
  Users,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop')",
            filter: "brightness(0.3)"
          }}
        />
        
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                  <Scissors className="w-12 h-12 text-black" />
                </div>
                <h1 className="text-6xl md:text-8xl font-bold">BarberPro</h1>
              </div>
              <p className="text-2xl md:text-3xl text-gray-200 mb-4 leading-relaxed">
                Bem-vindo à melhor experiência <br />
                em barbearia premium
              </p>
              <p className="text-xl text-gray-400 mb-12">
                Estilo, conforto e profissionalismo em cada corte
              </p>
              
              <div className="flex justify-center">
                <Link to={createPageUrl("Home")}>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-xl px-16 py-8">
                    <Calendar className="w-6 h-6 mr-3" />
                    Entrar
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">O que oferecemos</h2>
            <p className="text-xl text-gray-600">Sistema completo para gestão e atendimento</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {/* Card Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-black hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-10">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-center">Área do Cliente</h3>
                  <p className="text-gray-600 text-lg mb-6 text-center">
                    Acesse sua área pessoal e aproveite todos os benefícios
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Agendamentos Online</strong>
                        <p className="text-gray-600">Marque seu horário com seu barbeiro favorito</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShoppingBag className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Loja de Produtos</strong>
                        <p className="text-gray-600">Compre produtos premium para casa</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Award className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Programa Fidelidade</strong>
                        <p className="text-gray-600">A cada 8 cortes, ganhe 1 grátis</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Histórico Completo</strong>
                        <p className="text-gray-600">Acompanhe todos os seus cortes</p>
                      </div>
                    </li>
                  </ul>
                  <Link to={createPageUrl("Home")}>
                    <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white text-lg py-6">
                      Acessar Área do Cliente
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10+", label: "Anos de Experiência" },
              { number: "5000+", label: "Clientes Satisfeitos" },
              { number: "3", label: "Barbeiros Profissionais" },
              { number: "4.9", label: "Avaliação Média" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-5xl font-bold mb-2">{stat.number}</h3>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Acesse sua conta e aproveite todos os benefícios da BarberPro
            </p>
            <div className="flex justify-center">
              <Link to={createPageUrl("Home")}>
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-16 py-8 text-xl">
                  Acessar Minha Conta
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors className="w-8 h-8" />
            <h3 className="text-2xl font-bold">BarberPro</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Sistema completo de gestão para barbearias premium
          </p>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500">
              &copy; 2024 BarberPro. Todos os direitos reservados.
              <Link 
                to={createPageUrl("AdminLogin")} 
                className="text-gray-700 hover:text-gray-500 ml-2 text-xs"
              >
                •
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}