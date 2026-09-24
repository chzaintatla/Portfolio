import {
  Activity, ArrowUpRight, BarChart3, Blocks, Boxes, BrainCircuit, Briefcase, Building, Building2, Cloud, Code2,
  Compass, Cpu, Database, FileText, Globe, GraduationCap, HandHeart, Handshake, HeartHandshake, HeartPulse, Landmark, Layers,
  LifeBuoy, Lightbulb, type LucideIcon,
  Megaphone, MessageCircle, PenTool, Rocket, Search, Share2, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Store,
  Target, TrendingUp, Truck, Users, UtensilsCrossed, Workflow, Zap,
} from "lucide-react";

/**
 * Curated icon registry. CMS records store the icon *name*; only these are bundled, which keeps
 * lucide tree-shaken. Add names here to make them selectable in the admin.
 */
export const ICONS: Record<string, LucideIcon> = {
  Activity, ArrowUpRight, BarChart3, Blocks, Boxes, BrainCircuit, Briefcase, Building, Building2, Cloud, Code2,
  Compass, Cpu, Database, FileText, Globe, GraduationCap, HandHeart, Handshake, HeartHandshake, HeartPulse, Landmark, Layers,
  LifeBuoy, Lightbulb, Megaphone,
  MessageCircle, PenTool, Rocket, Search, Share2, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Store, Target,
  TrendingUp, Truck, Users, UtensilsCrossed, Workflow, Zap,
};

export const ICON_NAMES = Object.keys(ICONS).sort();

export function Icon({ name, className, fallback = Sparkles }: { name?: string | null; className?: string; fallback?: LucideIcon }) {
  const Cmp = (name && ICONS[name]) || fallback;
  return <Cmp className={className} aria-hidden="true" strokeWidth={1.6} />;
}
