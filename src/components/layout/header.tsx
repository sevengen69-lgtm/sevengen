
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Zap, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import type { HomepageContent } from '@/lib/types';

const navLinks = [
  { href: '/#services', label: 'Serviços' },
  { href: '/#about', label: 'Sobre' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const contentRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'homepageContent', 'main');
  }, [firestore]);

  const { data: content } = useDoc<HomepageContent>(contentRef);

  useEffect(() => {
    if (user && firestore) {
      const checkAdmin = async () => {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      };
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [user, firestore]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const renderAuthButtons = () => {
    if (isUserLoading) {
      return null;
    }

    if (user) {
      if (isAdmin) {
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
          <Button asChild variant="outline">
            <Link href="/user/dashboard">
              <UserIcon className="mr-2 h-4 w-4" />
              Minha Conta
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="ghost">
            Sair
          </Button>
        </>
      );
    }

    return (
      <>
        <Button asChild variant="ghost">
          <Link href="/login">User</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/login">Admin</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Cadastro</Link>
        </Button>
      </>
    );
  };
  
  const renderMobileAuthButtons = () => {
    if (isUserLoading) {
      return null;
    }

    if (user) {
      if (isAdmin) {
        return (
          <>
            <SheetClose asChild>
              <Button asChild size="lg" className="w-full mt-4">
                <Link href="/admin/dashboard">Admin Dashboard</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button onClick={handleLogout} size="lg" className="w-full mt-2" variant="outline">
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
              <Link href="/user/dashboard">Minha Conta</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleLogout} size="lg" className="w-full mt-2" variant="outline">
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
            <Link href="/login">Login User</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button asChild size="lg" className="w-full mt-2">
            <Link href="/admin/login">Login Admin</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button asChild size="lg" variant="outline" className="w-full mt-2">
            <Link href="/signup">Cadastro</Link>
          </Button>
        </SheetClose>
      </>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {content?.logoUrl ? (
            <Image src={content.logoUrl} alt="Sevengen Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          ) : (
            <Zap className="h-6 w-6 text-primary" />
          )}
          <span className="font-headline text-xl font-bold">Sevengen</span>
        </Link>
        
        <nav className="hidden md:flex md:items-center md:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            {renderAuthButtons()}
          </div>
          <ThemeToggle />
        </nav>
        
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex h-full flex-col justify-center gap-6 text-center">
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
                 <div className="flex flex-col items-center gap-4 mt-6">
                  {renderMobileAuthButtons()}
                 </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

    