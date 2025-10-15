
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';

export default function UserDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?from=/user/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
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
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return <UserIcon />;
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Minha Conta</h1>
        <Button onClick={handleLogout} variant="outline">Sair</Button>
      </header>
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-lg">
          <CardHeader className="items-center text-center">
             <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.displayName || 'Usuário'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Bem-vindo ao seu painel. Aqui você pode gerenciar suas informações.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

