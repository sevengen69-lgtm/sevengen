
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '#services', label: 'Serviços' },
  { href: '#about', label: 'Sobre' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();


  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const renderAuthButtons = () => {
    if (isUserLoading) {
      return null; // Don't show buttons while checking auth state
    }

    if (user) {
      return (
        <>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Admin</Link>
          </Button>
          <Button onClick={handleLogout} variant="ghost">
            Sair
          </Button>
        </>
      );
    }

    return (
      <>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </>
    );
  };
  
    const renderMobileAuthButtons = () => {
    if (isUserLoading) {
      return null;
    }

    if (user) {
      return (
        <>
          <SheetClose asChild>
              <Button asChild size="lg" className="w-full mt-4" variant="outline">
                  <Link href="/admin/dashboard">Admin</Link>
              </Button>
          </SheetClose>
          <SheetClose asChild>
              <Button onClick={handleLogout} size="lg" className="w-full mt-4" variant="ghost">
                  Sair
              </Button>
          </SheetClose>
        </>
      );
    }

    return (
       <>
        <SheetClose asChild>
          <Button asChild size="lg" className="w-full mt-4">
            <Link href="/login">Login</Link>
          </Button>
        </SheetClose>
      </>
    );
  };


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
          {renderAuthButtons()}
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
                 {renderMobileAuthButtons()}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
