import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-muted">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-bold">VoltaTech</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} VoltaTech Solutions. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
