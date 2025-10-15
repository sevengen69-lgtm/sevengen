import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { services } from '@/lib/services';
import { ContactForm } from '@/components/contact-form';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full text-primary-foreground md:h-[70vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-6 px-4 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
              Sevengen Automação
            </h1>
            <p className="max-w-3xl text-lg text-primary-foreground/90 md:text-xl">
              Excelência em Elétrica e Automação para Indústria, Residências e Hospitais.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#services">Nossos Serviços</a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#contact">Solicitar Orçamento</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
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
              {services.map((service) => (
                <Card
                  key={service.title}
                  className="flex flex-col overflow-hidden rounded-lg border-2 border-transparent shadow-lg transition-all hover:border-primary hover:shadow-2xl hover:-translate-y-2"
                >
                  <CardHeader className="items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <service.icon className="h-8 w-8" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow text-center">
                    <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                    <CardDescription className="mt-2">{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                      <a href="#contact">Solicitar Orçamento</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full bg-muted py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sobre a Sevengen
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  A Sevengen Automação é sua parceira de confiança em serviços elétricos e de automação. Com uma equipe de especialistas qualificados e anos de experiência, nos dedicamos a fornecer soluções inovadoras, seguras e eficientes para clientes residenciais, comerciais e industriais.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Nosso compromisso é com a qualidade, a confiabilidade e a satisfação total do cliente, utilizando tecnologia de ponta para garantir resultados superiores em cada projeto.
                </p>
              </div>
              <div className="flex justify-center">
                {aboutImage && (
                  <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    data-ai-hint={aboutImage.imageHint}
                    width={600}
                    height={400}
                    className="overflow-hidden rounded-xl object-cover shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full bg-background py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Entre em Contato
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Pronto para começar seu projeto? Preencha o formulário abaixo e nossa equipe entrará em contato.
              </p>
            </div>
            <div className="mx-auto max-w-xl">
              <Card>
                <CardContent className="p-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
