
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
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      // Se não há usuário logado após o carregamento, redireciona para a página de login
      router.replace('/login?from=/admin/dashboard');
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

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Carregando...</p>
          <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
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
            <CardTitle>Bem-vindo!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta é a sua área de administração. Você acessou com sucesso.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
