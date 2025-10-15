import { type LucideIcon, Wrench, Zap, CircuitBoard, HardHat, ShoppingCart, Repeat, HeartPulse } from 'lucide-react';

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: 'Manutenção de Instrumentos',
    description: 'Reparo e calibração de aparelhos de medida, teste e controle.',
    icon: CircuitBoard,
  },
  {
    title: 'Manutenção de Máquinas',
    description: 'Reparo de máquinas e equipamentos de uso geral para indústria e comércio.',
    icon: Wrench,
  },
  {
    title: 'Instalação Elétrica',
    description: 'Serviços de instalação e manutenção elétrica residencial, comercial e industrial.',
    icon: Zap,
  },
  {
    title: 'Varejo de Material Elétrico',
    description: 'Comércio de uma vasta gama de materiais elétricos de alta qualidade.',
    icon: ShoppingCart,
  },
  {
    title: 'Serviços de Engenharia',
    description: 'Consultoria e desenvolvimento de projetos de engenharia elétrica e automação.',
    icon: HardHat,
  },
  {
    title: 'Aluguel de Equipamentos',
    description: 'Aluguel de máquinas e equipamentos comerciais e industriais.',
    icon: Repeat,
  },
  {
    title: 'Reparo de Eletroeletrônicos',
    description: 'Manutenção de equipamentos de uso pessoal, doméstico e hospitalar.',
    icon: HeartPulse,
  },
];
