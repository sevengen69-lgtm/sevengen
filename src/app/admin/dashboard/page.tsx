
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { QuoteRequest } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const quoteRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'quoteRequests'), orderBy('createdAt', 'desc'));
  }, [firestore, isAdmin]);

  const { data: quoteRequests, isLoading: isLoadingQuotes } = useCollection<QuoteRequest>(quoteRequestsQuery);
  
  const handleUpdateStatus = (newStatus: 'pending' | 'contacted' | 'closed') => {
    if (!firestore || !selectedRequest) return;
    const docRef = doc(firestore, 'quoteRequests', selectedRequest.id);
    updateDocumentNonBlocking(docRef, { status: newStatus });
    
    // Optimistically update local state
    if (selectedRequest) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };


  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error on logout:", error);
    }
  };
  
  const openDetailsModal = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold">Painel do Administrador</h1>
          <Button onClick={handleLogout} variant="outline">Sair</Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          <Card>
            <CardHeader>
              <CardTitle>Solicitações de Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingQuotes && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Carregando orçamentos...</TableCell>
                    </TableRow>
                  )}
                  {!isLoadingQuotes && quoteRequests && quoteRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhuma solicitação de orçamento encontrada.</TableCell>
                    </TableRow>
                  )}
                  {quoteRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.createdAt ? format(request.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}</TableCell>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'pending' ? 'destructive' : request.status === 'contacted' ? 'secondary' : 'success'}>
                          {request.status === 'pending' ? 'Pendente' : request.status === 'contacted' ? 'Contatado' : 'Fechado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetailsModal(request)}>
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas do pedido de orçamento.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1 text-right font-semibold text-muted-foreground">Nome</span>
                <span className="col-span-3">{selectedRequest.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1 text-right font-semibold text-muted-foreground">Email</span>
                <span className="col-span-3">{selectedRequest.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1 text-right font-semibold text-muted-foreground">Telefone</span>
                <span className="col-span-3">{selectedRequest.phone || 'Não informado'}</span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="col-span-1 mt-1 text-right font-semibold text-muted-foreground">Mensagem</span>
                <p className="col-span-3 whitespace-pre-wrap rounded-md border bg-muted p-3 text-sm">
                  {selectedRequest.message}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <span className="col-span-1 text-right font-semibold text-muted-foreground">Status</span>
                 <div className="col-span-3">
                   <Select 
                      value={selectedRequest.status}
                      onValueChange={(value: 'pending' | 'contacted' | 'closed') => handleUpdateStatus(value)}
                   >
                    <SelectTrigger>
                        <SelectValue placeholder="Mudar status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                   </Select>
                 </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
