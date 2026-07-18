import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Image,
  Newspaper,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  Settings,
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
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Gallery", href: "/gallery", icon: Image },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Testimonials", href: "/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/faqs", icon: HelpCircle },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Settings", href: "/settings", icon: Settings },
];
