"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#services', label: 'Serviços' },
  { href: '#about', label: 'Sobre' },
  { href: '#contact', label: 'Contato' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Sevengen</span>
        </Link>
        
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="#contact">Solicitar Orçamento</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
        
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex h-full flex-col justify-center gap-6">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                 <SheetClose asChild>
                  <Button asChild size="lg" className="mt-4" variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild size="lg" className="mt-4">
                    <Link href="#contact">Solicitar Orçamento</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
