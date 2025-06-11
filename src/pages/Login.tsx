
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de autenticação - substituir por API real
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MarcenariaPro",
        });
        // Aqui você salvaria o token de autenticação
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, preencha todos os campos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-50 to-wood-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-wood-200">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto p-3 bg-wood-600 rounded-full w-fit">
            <Hammer className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-wood-800">MarcenariaPro</CardTitle>
            <CardDescription className="text-wood-600">
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-wood-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-wood-200 focus:border-wood-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-wood-700">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-wood-200 focus:border-wood-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-wood-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-wood-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-wood-600 hover:bg-wood-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-wood-600">
              Esqueceu sua senha?{" "}
              <button className="text-wood-700 hover:text-wood-800 font-medium underline">
                Recuperar senha
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
