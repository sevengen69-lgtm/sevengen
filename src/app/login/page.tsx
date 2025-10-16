
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Carrega dinamicamente o formulário de login no lado do cliente para evitar erros de SSR com useSearchParams
const LoginClient = dynamic(() => import('./login-client'), {
  // Mostra um esqueleto de carregamento enquanto o componente real é carregado
  loading: () => (
     <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Acesse sua conta para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>
        </CardContent>
     </Card>
  ),
  ssr: false, // Desativa a renderização no lado do servidor para este componente
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Suspense fallback={
            <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Acesse sua conta para continuar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
             </Card>
        }>
            <LoginClient />
        </Suspense>
    </div>
  );
}
