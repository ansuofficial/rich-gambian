import {
  Bitcoin,
  Building2,
  Camera,
  Car,
  Castle,
  Church,
  Coffee,
  Gem,
  Gift,
  GraduationCap,
  Home,
  Laptop,
  Palette,
  Plane,
  Ship,
  TreePalm,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { ProductIconName } from "@/app/types/types";

const ICON_MAP: Record<ProductIconName, LucideIcon> = {
  utensils: UtensilsCrossed,
  camera: Camera,
  coffee: Coffee,
  gem: Gem,
  gift: Gift,
  car: Car,
  palette: Palette,
  laptop: Laptop,
  church: Church,
  ship: Ship,
  "graduation-cap": GraduationCap,
  "building-2": Building2,
  castle: Castle,
  "tree-palm": TreePalm,
  plane: Plane,
  trophy: Trophy,
  home: Home,
  bitcoin: Bitcoin,
};

interface ProductIconProps {
  name: ProductIconName;
  className?: string;
  strokeWidth?: number;
}

export function ProductIcon({
  name,
  className = "size-5 shrink-0",
  strokeWidth = 1.75,
}: ProductIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}