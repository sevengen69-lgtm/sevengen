
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Apenas aguarda o estado de autenticação ser resolvido.
    if (!isUserLoading) {
      // Se não houver usuário logado após o carregamento, redireciona para o login.
      if (!user) {
        router.replace('/login?from=/admin/dashboard');
      } else {
        // Se há um usuário logado, permite o acesso.
        setIsLoading(false);
      }
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Tela de carregamento enquanto o estado de autenticação é verificado.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Carregando...</p>
          <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
        </div>
      </div>
    );
  }

  // Painel de Administrador para usuários autorizados (qualquer usuário logado).
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <h1 className="text-xl font-semibold">Painel do Administrador</h1>
        <Button onClick={handleLogout} variant="outline">Sair</Button>
      </header>
      <main className="flex-1 p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, Administrador!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta é a sua área de administração. Em breve, novas funcionalidades estarão disponíveis aqui.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
