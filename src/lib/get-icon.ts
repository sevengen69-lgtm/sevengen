
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

export const getIcon = (name: IconName): LucideIcon => {
  return iconMap[name] || Zap; 
};

    

    