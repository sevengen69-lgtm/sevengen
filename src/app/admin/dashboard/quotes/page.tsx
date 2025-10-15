
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { collection, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { QuoteRequest } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Trash2, Edit, Building } from 'lucide-react';
import Link from 'next/link';

export default function AdminQuotesPage() {
  const { user, isUserLoading } = useUser();
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
    if (isUserLoading) return;
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
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
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

  const { activeRequests, closedRequests } = useMemo(() => {
    const active: QuoteRequest[] = [];
    const closed: QuoteRequest[] = [];
    quoteRequests?.forEach(req => {
      if (req.status === 'closed') {
        closed.push(req);
      } else {
        active.push(req);
      }
    });
    return { activeRequests: active, closedRequests: closed };
  }, [quoteRequests]);
  
  const handleUpdateStatus = (newStatus: 'pending' | 'contacted' | 'closed') => {
    if (selectedRequest) {
        setEditableRequestData(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveChanges = () => {
    if (!firestore || !selectedRequest) return;
    const docRef = doc(firestore, 'quoteRequests', selectedRequest.id);
    updateDocumentNonBlocking(docRef, editableRequestData);
    toast({ title: "Sucesso!", description: "As informações da solicitação foram atualizadas." });
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
     toast({ title: "Excluído!", description: "A solicitação de orçamento foi excluída com sucesso.", variant: "destructive" });
  };
  
  const openDetailsModal = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setEditableRequestData({ name: request.name, email: request.email, phone: request.phone, company: request.company, status: request.status });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableRequestData(prev => ({ ...prev, [name]: value }));
  };

  const renderRequestCard = (request: QuoteRequest) => (
    <Card key={request.id} className="flex flex-col">
        <CardHeader>
            <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1">{request.name}</span>
                <Badge variant={request.status === 'pending' ? 'destructive' : 'secondary'}>
                    {request.status === 'pending' ? 'Pendente' : 'Contatado'}
                </Badge>
            </CardTitle>
            {request.company && (
              <p className="flex items-center text-sm font-medium text-muted-foreground pt-1">
                <Building className="w-4 h-4 mr-2" />
                {request.company}
              </p>
            )}
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" /> <span>{request.email}</span>
            </div>
            {request.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" /> <span>{request.phone}</span>
                </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{request.createdAt ? format(request.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '-'}</span>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => openDetailsModal(request)}>
                <Edit className="w-4 h-4 mr-2" /> Ver Detalhes
            </Button>
            <Button variant="destructive" size="sm" onClick={() => openDeleteAlert(request)}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </Button>
        </CardFooter>
    </Card>
  );
  
  const renderClosedRequestCard = (request: QuoteRequest) => (
    <Card key={request.id} className="flex flex-col bg-muted/50">
        <CardHeader>
            <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1">{request.name}</span>
                <Badge variant='success'>Fechado</Badge>
            </CardTitle>
            {request.company && (
              <p className="flex items-center text-sm font-medium text-muted-foreground pt-1">
                <Building className="w-4 h-4 mr-2" />
                {request.company}
              </p>
            )}
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" /> <span>{request.email}</span>
            </div>
            {request.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" /> <span>{request.phone}</span>
                </div>
            )}
             <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{request.createdAt ? format(request.createdAt.toDate(), "dd/MM/yyyy", { locale: ptBR }) : '-'}</span>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => openDetailsModal(request)}>
                <Edit className="w-4 h-4 mr-2" /> Ver Detalhes
            </Button>
            <Button variant="destructive" size="sm" onClick={() => openDeleteAlert(request)}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
            </Button>
        </CardFooter>
    </Card>
  );

  if (isAdmin === null || isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
      router.replace('/admin/login');
      return null;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
          <h1 className="text-xl font-semibold">Gerenciamento de Orçamentos</h1>
           <Button asChild variant="outline">
              <Link href="/admin/dashboard">Voltar ao Painel</Link>
           </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6">
            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Solicitações Ativas</h2>
                {isLoadingQuotes && <p>Carregando solicitações...</p>}
                {!isLoadingQuotes && activeRequests.length === 0 && <p>Nenhuma solicitação ativa encontrada.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeRequests.map(renderRequestCard)}
                </div>
            </section>

            <Separator className="my-8" />

            <section>
                <h2 className="text-2xl font-bold tracking-tight mb-4">Orçamentos Fechados</h2>
                {isLoadingQuotes && <p>Carregando orçamentos...</p>}
                {!isLoadingQuotes && closedRequests.length === 0 && <p>Nenhum orçamento fechado encontrado.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {closedRequests.map(renderClosedRequestCard)}
                </div>
            </section>
        </main>
      </div>

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
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="company" className="col-span-1 text-right font-semibold text-muted-foreground">Empresa</label>
                <Input id="company" name="company" value={editableRequestData.company || ''} onChange={handleInputChange} className="col-span-3" />
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
