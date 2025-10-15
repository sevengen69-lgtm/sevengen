
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { defaultServices } from '@/lib/services';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { iconMap } from '@/lib/get-icon';
import { Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { HomepageContent, IconName } from '@/lib/types';


const serviceSchema = z.object({
  icon: z.custom<IconName>(),
  title: z.string().min(1, 'O título do serviço é obrigatório.'),
  description: z.string().min(1, 'A descrição do serviço é obrigatória.'),
  status: z.enum(['active', 'coming_soon']).default('active'),
});

const formSchema = z.object({
  logoUrl: z.string().url({ message: 'Por favor, insira uma URL válida.' }).or(z.literal('')).default(''),
  heroTitle: z.string().min(1, 'O título principal é obrigatório.'),
  heroSubtitle: z.string().min(1, 'O subtítulo é obrigatório.'),
  heroImageUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }),
  aboutTitle: z.string().min(1, 'O título da seção "Sobre" é obrigatório.'),
  aboutText: z.string().min(1, 'O texto da seção "Sobre" é obrigatório.'),
  aboutImageUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }),
  services: z.array(serviceSchema),
});


const defaultValues: z.infer<typeof formSchema> = {
    logoUrl: '',
    heroTitle: 'Sevengen Automação',
    heroSubtitle: 'Excelência em Elétrica e Automação para Indústria, Residências e Hospitais.',
    heroImageUrl: 'https://innvoltpaineis.com.br/wp-content/uploads/2022/08/2022-09-05-instalacoes-eletricas-prediais.jpg',
    aboutTitle: 'Sobre a Sevengen',
    aboutText: 'A Sevengen Automação é sua parceira de confiança em serviços elétricos e de automação. Com uma equipe de especialistas qualificados e anos de experiência, nos dedicamos a fornecer soluções inovadoras, seguras e eficientes para clientes residenciais, comerciais e industriais.\n\nNosso compromisso é com a qualidade, a confiabilidade e a satisfação total do cliente, utilizando tecnologia de ponta para garantir resultados superiores em cada projeto.',
    aboutImageUrl: 'https://www.comanderautomacao.com.br/wp-content/uploads/2021/09/climatizacao-de-paineis-eletricos.jpg',
    services: defaultServices as any,
}


export default function ContentManagementPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'homepageContent', 'main');
  }, [firestore]);

  const { data: contentData, isLoading: isLoadingContent } = useDoc<HomepageContent>(contentRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });


  useEffect(() => {
    if (isUserLoading || isLoadingContent) return;
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
  }, [user, isUserLoading, router, firestore, isLoadingContent]);
  
  
  useEffect(() => {
    if (contentData) {
        const dataWithDefaults = {
            ...defaultValues,
            ...contentData,
            logoUrl: contentData.logoUrl || '',
            services: contentData.services || [],
        };
        form.reset(dataWithDefaults);
    } else {
        form.reset(defaultValues);
    }
  }, [contentData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!contentRef) return;
    
    const valuesToSave = {
      ...values,
      logoUrl: values.logoUrl || '',
    };
    
    setDocumentNonBlocking(contentRef, valuesToSave, { merge: true });
    toast({
      title: 'Conteúdo Salvo!',
      description: 'As alterações na página inicial foram salvas com sucesso.',
    });
  };

  if (isAdmin === null || isUserLoading || isLoadingContent) {
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
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
        <h1 className="text-xl font-semibold">Gerenciar Conteúdo da Página Inicial</h1>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard">Voltar ao Painel</Link>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Cabeçalho</CardTitle>
                <CardDescription>Edite o logotipo do site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Logotipo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seção Principal (Hero)</CardTitle>
                <CardDescription>Edite o conteúdo principal que aparece no topo da página.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="heroTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Principal</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heroSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="heroImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem de Fundo</FormLabel>
                       <FormControl><Input placeholder="https://picsum.photos/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seção "Sobre Nós"</CardTitle>
                <CardDescription>Edite as informações sobre a sua empresa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="aboutTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Seção</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aboutText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto da Seção</FormLabel>
                      <FormControl><Textarea className="min-h-32" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="aboutImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                       <FormControl><Input placeholder="https://picsum.photos/..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
               <CardHeader>
                <CardTitle>Seção de Serviços</CardTitle>
                <CardDescription>Edite os serviços oferecidos. Você pode adicionar ou remover itens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                     <FormField
                        control={form.control}
                        name={`services.${index}.icon`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ícone</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Selecione um ícone" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.keys(iconMap).map(iconName => (
                                        <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                      control={form.control}
                      name={`services.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do Serviço</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição do Serviço</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.status`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Em Breve</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value === 'coming_soon'}
                              onCheckedChange={(checked) => {
                                field.onChange(checked ? 'coming_soon' : 'active');
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="absolute top-2 right-2">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ icon: 'Zap', title: '', description: '', status: 'active' })}
                >
                    Adicionar Serviço
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 sticky bottom-0 bg-background/90 p-4 border-t">
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}

    