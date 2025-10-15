
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowRight, Briefcase, FileText, BarChart2, Shield } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user) {
      router.replace('/admin/login');
      return;
    }
    if (!firestore) {
      setIsAdmin(false);
      return;
    }

    const checkAdminStatus = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin permissions:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, isUserLoading, router, firestore]);
  
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error on logout:", error);
    }
  };

  if (isAdmin === null || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Verificando permissões...</p>
          <p className="text-sm text-muted-foreground">Aguarde um momento.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          <Button onClick={handleLogout} variant="destructive" className="mt-4 mr-2">
             Sair
          </Button>
          <Button onClick={() => router.push('/')} variant="link" className="mt-4">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex min-h-screen flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
          <h1 className="text-xl font-semibold">Painel do Administrador</h1>
          <Button onClick={handleLogout} variant="outline">Sair</Button>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Link href="/admin/dashboard/quotes" className="group">
                <Card className="hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Orçamentos</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Gerenciar</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      Ver e gerenciar todas as solicitações
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </CardContent>
                </Card>
            </Link>
            <Link href="/admin/dashboard/content" className="group">
                <Card className="hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Conteúdo da Página</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Editar</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      Modificar textos e imagens da página inicial
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </CardContent>
                </Card>
            </Link>

            {/* Card "Em Breve" */}
            <div className="relative group cursor-not-allowed">
              <Card className="transition-all">
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 rounded-lg"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Análises</div>
                  <p className="text-xs text-muted-foreground">
                    Métricas e insights de desempenho
                  </p>
                </CardContent>
              </Card>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Badge variant="secondary">Em Breve</Badge>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
