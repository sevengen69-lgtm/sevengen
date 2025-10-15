
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aguarda a finalização do carregamento do usuário e a disponibilidade do firestore
    if (isUserLoading || !firestore) {
      return; 
    }
    
    // Se não houver usuário logado após o carregamento, redireciona para o login
    if (!user) {
      router.replace('/login?from=/admin/dashboard'); 
      return;
    }

    const checkAdminRole = async () => {
      // Define o UID do usuário a partir do objeto 'user'
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        // Verifica se o documento existe e se a função é 'admin'
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAuthorized(true);
        } else {
          // Se não for admin, marca como não autorizado
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Erro ao verificar a função do administrador:", error);
        setIsAuthorized(false);
      } finally {
        // Finaliza o estado de carregamento
        setIsLoading(false);
      }
    };

    checkAdminRole();
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
  
  // Tela de carregamento enquanto as permissões são verificadas
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
  
  // Tela para usuários que não são administradores autorizados
  if (!isAuthorized) {
     return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">Acesso Negado</p>
          <p className="text-sm text-muted-foreground">Você não tem permissão para acessar esta página.</p>
           <Button onClick={() => router.push('/')} variant="link" className="mt-4">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  // Painel de Administrador para usuários autorizados
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
