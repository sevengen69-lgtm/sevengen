
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { initializeFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});

export default function QuoteRequestForm() {
  const { toast } = useToast();
  // State to hold the firestore instance
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  // Initialize Firebase on the client and get the firestore instance
  useEffect(() => {
    const { firestore: fs } = initializeFirebase();
    setFirestore(fs);
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.',
      });
      return;
    }

    try {
      const quoteCollectionRef = collection(firestore, 'quoteRequests');
      await addDocumentNonBlocking(quoteCollectionRef, {
        ...values,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Solicitação Enviada!',
        description: 'Seu pedido de orçamento foi enviado com sucesso. Entraremos em contato em breve.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting quote request: ', error);
      toast({
        variant: 'destructive',
        title: 'Falha no Envio',
        description: 'Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o que você precisa..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting || !firestore}>
          {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
        </Button>
      </form>
    </Form>
  );
}
