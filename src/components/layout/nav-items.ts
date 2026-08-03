import {
  LayoutDashboard,
  Wrench,
  Image,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Settings,
  FileText,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/faqs", icon: HelpCircle },
  { label: "Terms & Conditions", href: "/terms-conditions", icon: FileText },
  { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Settings", href: "/settings", icon: Settings },
];
