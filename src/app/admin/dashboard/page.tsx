
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isUserLoading || !firestore) {
      // Aguarda o usuário e o firestore estarem prontos
      return;
    }

    if (!user) {
      // Se não há usuário logado, redireciona para a página de login
      router.replace('/login?from=/admin/dashboard');
      return;
    }

    // Temos um usuário, agora vamos verificar sua permissão
    const checkAdminStatus = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAuthorized(true);
        } else {
          // Usuário não é admin, nega o acesso e redireciona
          setIsAuthorized(false);
          toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Você não tem permissão para acessar esta página.",
          });
          router.replace('/');
        }
      } catch (error) {
        console.error("Erro ao verificar permissão de admin:", error);
        setIsAuthorized(false);
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Verificando permissões...</p>
          <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redundância para garantir que o usuário não autorizado não veja o conteúdo.
    // O redirecionamento já terá sido acionado no useEffect.
    return (
       <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Acesso Negado</p>
          <p className="text-sm text-muted-foreground">Você será redirecionado.</p>
        </div>
      </div>
    );
  }
  
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
