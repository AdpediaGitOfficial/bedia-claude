'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  CalendarCheck,
  Receipt,
  Images,
  HelpCircle,
  Quote,
  Handshake,
  Star,
  Clock,
  FileText,
  Newspaper,
  Users,
  Inbox,
} from 'lucide-react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workshops', label: 'Workshops / Packages', icon: Package },
  { href: '/categories', label: 'Categories', icon: FolderTree },
  { href: '/clay-types', label: 'Clay Types', icon: Layers },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/orders', label: 'Orders', icon: Receipt },
  { href: '/gallery', label: 'Gallery', icon: Images },
  { href: '/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/partners', label: 'Partners', icon: Handshake },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/opening-hours', label: 'Opening Hours', icon: Clock },
  { href: '/terms', label: 'Terms & Conditions', icon: FileText },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/leads', label: 'Leads', icon: Inbox },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold text-brand">BEDIA ADMIN</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                active ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
