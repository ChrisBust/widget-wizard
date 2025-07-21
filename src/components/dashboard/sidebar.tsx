'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileText, LayoutDashboard } from 'lucide-react';

import { cn } from '@/lib/utils';
import Logo from '@/components/logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'All-In-One Reviews', icon: LayoutDashboard },
  { href: '#', label: 'Contact Form', icon: FileText },
  { href: '#', label: 'ChatBot', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Widget Wizard</span>
        </Link>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    (pathname.startsWith(item.href) && item.href !== '/') || pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : '',
                    item.href === '#' ? 'cursor-not-allowed opacity-50' : ''
                  )}
                  aria-disabled={item.href === '#'}
                  tabIndex={item.href === '#' ? -1 : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
