import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scissors, Shield, Lock, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt to login
      await base44.auth.login(email, password);
      
      // Get user data to verify if they're admin
      const userData = await base44.auth.me();
      
      if (userData.role !== "admin") {
        setError("Acesso negado. Apenas administradores podem acessar esta área.");
        await base44.auth.logout();
        return;
      }

      // If admin, redirect to dashboard
      navigate(createPageUrl("AdminDashboard"));
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop')] bg-cover bg-center opacity-5" />
      
      <div className="w-full max-w-md relative z-10">
        <Link to={createPageUrl("Index")}>
          <Button 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </Link>

        <Card className="border-2 border-white/10 bg-black/80 backdrop-blur-xl text-white shadow-2xl">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-black" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">Área Administrativa</CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Acesso restrito a administradores
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
                <Lock className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@barberpro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-white focus:ring-white h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-white focus:ring-white h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gray-100 h-12 text-base font-semibold"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                    Verificando...
                  </div>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Entrar como Administrador
                  </>
                )}
              </Button>
            </form>

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Scissors className="w-4 h-4" />
                <span>BarberPro - Sistema Administrativo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          Apenas usuários com permissões administrativas podem acessar esta área
        </p>
      </div>
    </div>
  );
}
