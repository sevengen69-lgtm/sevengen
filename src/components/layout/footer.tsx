import React from 'react';
import Link from 'next/link';
import { Phone, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-muted">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">Sevengen</span>
        </Link>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
          <a href="tel:+5541997884294" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Phone className="h-4 w-4" />
            (41) 99788-4294
          </a>
          <p className="text-center md:text-left">
            &copy; {currentYear} Sevengen Automação. Todos os direitos reservados.
          </p>
        </div>
        <Link href="/admin/login" className="text-xs text-muted-foreground transition-colors hover:text-primary">
          Admin
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
