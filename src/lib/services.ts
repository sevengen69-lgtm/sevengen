import { type LucideIcon, Wrench, Zap, CircuitBoard, HardHat, ShoppingCart, Repeat, HeartPulse } from 'lucide-react';
import type { IconName, ServiceContent } from './types';


export const iconMap: Record<IconName, LucideIcon> = {
  Wrench,
  Zap,
  CircuitBoard,
  HardHat,
  ShoppingCart,
  Repeat,
  HeartPulse,
};


export const defaultServices: ServiceContent[] = [
  {
    title: 'Manutenção de Instrumentos',
    description: 'Reparo e calibração de aparelhos de medida, teste e controle.',
    icon: 'CircuitBoard',
    status: 'active',
  },
  {
    title: 'Manutenção de Máquinas',
    description: 'Reparo de máquinas e equipamentos para indústria, comércio e hospitais.',
    icon: 'Wrench',
    status: 'active',
  },
  {
    title: 'Instalação Elétrica',
    description: 'Serviços de instalação e manutenção elétrica residencial, comercial e hospitalar.',
    icon: 'Zap',
    status: 'active',
  },
  {
    title: 'Varejo de Material Elétrico',
    description: 'Comércio de uma vasta gama de materiais elétricos de alta qualidade.',
    icon: 'ShoppingCart',
    status: 'active',
  },
  {
    title: 'Serviços de Engenharia',
    description: 'Consultoria e projetos de engenharia elétrica e automação industrial e predial.',
    icon: 'HardHat',
    status: 'active',
  },
  {
    title: 'Aluguel de Equipamentos',
    description: 'Aluguel de máquinas e equipamentos comerciais e industriais.',
    icon: 'Repeat',
    status: 'coming_soon',
  },
  {
    title: 'Reparo de Eletroeletrônicos',
    description: 'Manutenção de equipamentos de uso pessoal, doméstico e hospitalar.',
    icon: 'HeartPulse',
    status: 'active',
  },
];
