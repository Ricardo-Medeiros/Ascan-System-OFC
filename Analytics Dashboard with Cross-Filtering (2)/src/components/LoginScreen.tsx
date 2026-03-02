import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Lock } from "lucide-react";
import ascanLogo from "figma:asset/7f85546267071cda45da22957d2763990ea2084a.png";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "ascannordeste" && password === "ascan8699") {
      onLogin();
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1e293b] border-white/10 shadow-2xl">
        <CardHeader className="space-y-4 flex flex-col items-center text-center pb-2">
          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg p-3 mb-2">
            <img src={ascanLogo} alt="Ascan Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-wide">Acesso Restrito</CardTitle>
          <CardDescription className="text-gray-400">
            Digite suas credenciais para acessar o dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Usuário</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Seu usuário" 
                className="bg-[#0f172a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Sua senha" 
                className="bg-[#0f172a] border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm font-medium text-center bg-red-900/20 p-2 rounded-md border border-red-900/50">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 mt-4">
              <Lock className="w-4 h-4 mr-2" />
              Entrar no Sistema
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-gray-500 justify-center border-t border-white/5 pt-4">
          &copy; 2026 Ascan Nordeste. Todos os direitos reservados.
        </CardFooter>
      </Card>
    </div>
  );
}
