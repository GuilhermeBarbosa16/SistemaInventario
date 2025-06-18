import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MarcenariaPro",
        });
        navigate('/');
      } else {
        // Modo registro
        if (password !== confirmPassword) {
          toast({
            title: "Erro no cadastro",
            description: "As senhas não coincidem",
            variant: "destructive",
          });
          return;
        }

        if (password.length < 6) {
          toast({
            title: "Erro no cadastro",
            description: "A senha deve ter pelo menos 6 caracteres",
            variant: "destructive",
          });
          return;
        }

        await register(name, email, password, confirmPassword);
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao MarcenariaPro",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: isLoginMode ? "Erro no login" : "Erro no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
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
              {isLoginMode ? "Faça login para acessar o sistema" : "Crie sua conta no sistema"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-wood-700">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-wood-200 focus:border-wood-400"
                  required
                />
              </div>
            )}
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
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-wood-700">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite sua senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-wood-200 focus:border-wood-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-wood-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-wood-500" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-wood-600 hover:bg-wood-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (isLoginMode ? "Entrando..." : "Criando conta...") : (isLoginMode ? "Entrar" : "Criar conta")}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-wood-200"></div>
              <span className="px-3 text-sm text-wood-600">ou</span>
              <div className="flex-1 border-t border-wood-200"></div>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              className="w-full text-wood-700 hover:text-wood-800 hover:bg-wood-50"
            >
              {isLoginMode ? "Não tem uma conta? Criar conta" : "Já tem uma conta? Fazer login"}
            </Button>
            {isLoginMode && (
              <p className="text-sm text-wood-600">
                Esqueceu sua senha?{" "}
                <button className="text-wood-700 hover:text-wood-800 font-medium underline">
                  Recuperar senha
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
