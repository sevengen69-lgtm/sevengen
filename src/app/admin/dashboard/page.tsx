
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useAuth, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { QuoteRequest } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [editableRequestData, setEditableRequestData] = useState<Partial<QuoteRequest>>({});
  
  const [requestToDelete, setRequestToDelete] = useState<QuoteRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

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
    if (!firestore || isAdmin === false) return null;
    return query(collection(firestore, 'quoteRequests'), orderBy('createdAt', 'desc'));
  }, [firestore, isAdmin]);

  const { data: quoteRequests, isLoading: isLoadingQuotes } = useCollection<QuoteRequest>(quoteRequestsQuery);
  
  const handleUpdateStatus = (newStatus: 'pending' | 'contacted' | 'closed') => {
    if (selectedRequest) {
        setEditableRequestData(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveChanges = () => {
    if (!firestore || !selectedRequest) return;
    const docRef = doc(firestore, 'quoteRequests', selectedRequest.id);
    updateDocumentNonBlocking(docRef, editableRequestData);

    toast({
        title: "Sucesso!",
        description: "As informações da solicitação foram atualizadas.",
    });

    setIsModalOpen(false);
  };
  
  const openDeleteAlert = (request: QuoteRequest) => {
    setRequestToDelete(request);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteRequest = () => {
    if (!firestore || !requestToDelete) return;
    const docRef = doc(firestore, 'quoteRequests', requestToDelete.id);
    deleteDocumentNonBlocking(docRef);
    setIsDeleteAlertOpen(false);
    setRequestToDelete(null);
     toast({
        title: "Excluído!",
        description: "A solicitação de orçamento foi excluída com sucesso.",
        variant: "destructive"
    });
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
    setEditableRequestData({
      name: request.name,
      email: request.email,
      phone: request.phone,
      status: request.status,
    });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableRequestData(prev => ({ ...prev, [name]: value }));
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
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => openDeleteAlert(request)}>
                          Excluir
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

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas do pedido de orçamento. Você pode editar os campos e salvar.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="col-span-1 text-right font-semibold text-muted-foreground">Nome</label>
                <Input id="name" name="name" value={editableRequestData.name || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="col-span-1 text-right font-semibold text-muted-foreground">Email</label>
                <Input id="email" name="email" value={editableRequestData.email || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="col-span-1 text-right font-semibold text-muted-foreground">Telefone</label>
                <Input id="phone" name="phone" value={editableRequestData.phone || ''} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="col-span-1 mt-1 text-right font-semibold text-muted-foreground">Mensagem</span>
                <Textarea readOnly value={selectedRequest.message} className="col-span-3 whitespace-pre-wrap rounded-md border bg-muted p-3 text-sm min-h-[100px]" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <span className="col-span-1 text-right font-semibold text-muted-foreground">Status</span>
                 <div className="col-span-3">
                   <Select 
                      value={editableRequestData.status}
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              solicitação de orçamento de "{requestToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRequestToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    