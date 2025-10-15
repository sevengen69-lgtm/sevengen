'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

type QuoteRequestStatus = 'pending' | 'processing' | 'completed';

type QuoteRequest = {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  serviceType: string;
  description: string;
  requestDate: {
    seconds: number;
    nanoseconds: number;
  };
  status: QuoteRequestStatus;
};

const statusTranslations: Record<QuoteRequestStatus, string> = {
  pending: 'pendente',
  processing: 'em processamento',
  completed: 'concluído',
};


export default function AdminPage() {
  const firestore = useFirestore();
  const quoteRequestsQuery = useMemo(
    () => (firestore ? collection(firestore, 'quoteRequests') : null),
    [firestore]
  );
  const { data: quoteRequests, isLoading } = useCollection<QuoteRequest>(quoteRequestsQuery);

  const getStatusVariant = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  const formatTimestamp = (timestamp: QuoteRequest['requestDate']) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/40 p-4 md:p-10">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Carregando solicitações...</p>}
            {!isLoading && (!quoteRequests || quoteRequests.length === 0) && (
              <p>Nenhuma solicitação de orçamento encontrada.</p>
            )}
            {!isLoading && quoteRequests && quoteRequests.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{formatTimestamp(request.requestDate)}</TableCell>
                        <TableCell>{request.contactName}</TableCell>
                        <TableCell>{request.contactEmail}</TableCell>
                        <TableCell>{request.contactPhone || 'N/A'}</TableCell>
                        <TableCell>{request.serviceType}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(request.status)}>
                            {statusTranslations[request.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
