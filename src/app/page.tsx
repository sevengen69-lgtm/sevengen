
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import QuoteRequestForm from '@/components/quote-request-form';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';
import { getIcon } from '@/lib/get-icon';
import type { HomepageContent, ServiceContent } from '@/lib/types';

const HeroSectionLoading = () => (
  <section className="relative h-[60vh] w-full bg-muted md:h-[70vh]">
    <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-6 px-4 text-center">
      <Skeleton className="h-12 w-3/4 rounded-md" />
      <Skeleton className="h-6 w-1/2 rounded-md" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>
    </div>
  </section>
);

const ServicesSectionLoading = () => (
  <section id="services" className="w-full bg-background py-16 md:py-24">
    <div className="container px-4 md:px-6">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Skeleton className="h-12 w-3/4 mx-auto rounded-md" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
           <Card key={i} className="flex flex-col overflow-hidden rounded-lg border-2 border-transparent shadow-lg">
             <CardHeader className="items-center text-center">
                <Skeleton className="h-16 w-16 rounded-full" />
             </CardHeader>
             <CardContent className="flex-grow text-center">
                <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
                <Skeleton className="h-4 w-full mx-auto mt-2 rounded-md" />
             </CardContent>
           </Card>
        ))}
      </div>
    </div>
  </section>
);

const AboutSectionLoading = () => (
   <section id="about" className="w-full bg-muted py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
             <Skeleton className="h-12 w-3/4 rounded-md" />
             <Skeleton className="h-6 w-full rounded-md" />
             <Skeleton className="h-6 w-5/6 rounded-md" />
          </div>
          <div className="flex justify-center">
             <Skeleton className="h-[400px] w-[600px] rounded-xl" />
          </div>
        </div>
      </div>
    </section>
);


export default function Home() {
  const firestore = useFirestore();
  
  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'homepageContent', 'main');
  }, [firestore]);

  const { data: content, isLoading: isLoadingContent } = useDoc<HomepageContent>(contentRef);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        {isLoadingContent || !content ? <HeroSectionLoading /> : (
          <section className="relative h-[60vh] w-full text-primary-foreground md:h-[70vh]">
            {content.heroImageUrl && (
              <Image
                src={content.heroImageUrl}
                alt={content.heroTitle}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 backdrop-blur-sm" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-6 px-4 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
                {content.heroTitle}
              </h1>
              <p className="max-w-3xl text-lg text-primary-foreground/90 md:text-xl">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <a href="#services">Nossos Serviços</a>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        {isLoadingContent || !content ? <ServicesSectionLoading /> : (
          <section id="services" className="w-full bg-background py-16 md:py-24">
            <div className="container px-4 md:px-6">
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Nossos Serviços
                </h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Oferecemos uma gama completa de soluções para atender às suas necessidades.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {content.services?.map((service: ServiceContent) => {
                  const Icon = getIcon(service.icon);
                  return (
                     <Card
                      key={service.title}
                      className="flex flex-col overflow-hidden rounded-lg border-2 border-transparent shadow-lg transition-all hover:border-primary hover:shadow-2xl hover:-translate-y-2"
                    >
                      <CardHeader className="items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {Icon && <Icon className="h-8 w-8" />}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow text-center">
                        <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                        <CardDescription className="mt-2">{service.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
         {isLoadingContent || !content ? <AboutSectionLoading /> : (
            <section id="about" className="w-full bg-muted py-16 md:py-24">
              <div className="container px-4 md:px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      {content.aboutTitle}
                    </h2>
                    <p className="text-muted-foreground md:text-lg whitespace-pre-wrap">
                      {content.aboutText}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    {content.aboutImageUrl && (
                      <Image
                        src={content.aboutImageUrl}
                        alt={content.aboutTitle}
                        width={600}
                        height={400}
                        className="overflow-hidden rounded-xl object-cover shadow-2xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
         )}


        {/* Quote Request Section */}
        <section id="quote" className="w-full bg-background py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Solicite um Orçamento
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
              </p>
            </div>
            <div className="mx-auto max-w-xl">
              <QuoteRequestForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

