import { type LucideIcon, Wrench, Zap, CircuitBoard, HardHat, ShoppingCart, Repeat, HeartPulse } from 'lucide-react';
import type { IconName } from './types';


export const iconMap: Record<IconName, LucideIcon> = {
  Wrench,
  Zap,
  CircuitBoard,
  HardHat,
  ShoppingCart,
  Repeat,
  HeartPulse,
};


export const defaultServices = [
  {
    title: 'Manutenção de Instrumentos',
    description: 'Reparo e calibração de aparelhos de medida, teste e controle.',
    icon: 'CircuitBoard',
  },
  {
    title: 'Manutenção de Máquinas',
    description: 'Reparo de máquinas e equipamentos para indústria, comércio e hospitais.',
    icon: 'Wrench',
  },
  {
    title: 'Instalação Elétrica',
    description: 'Serviços de instalação e manutenção elétrica residencial, comercial e hospitalar.',
    icon: 'Zap',
  },
  {
    title: 'Varejo de Material Elétrico',
    description: 'Comércio de uma vasta gama de materiais elétricos de alta qualidade.',
    icon: 'ShoppingCart',
  },
  {
    title: 'Serviços de Engenharia',
    description: 'Consultoria e projetos de engenharia elétrica e automação industrial e predial.',
    icon: 'HardHat',
  },
  {
    title: 'Aluguel de Equipamentos',
    description: 'Aluguel de máquinas e equipamentos comerciais e industriais.',
    icon: 'Repeat',
  },
  {
    title: 'Reparo de Eletroeletrônicos',
    description: 'Manutenção de equipamentos de uso pessoal, doméstico e hospitalar.',
    icon: 'HeartPulse',
  },
];

    