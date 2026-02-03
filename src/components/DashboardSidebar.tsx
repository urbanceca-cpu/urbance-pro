'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
    { href: '/dashboard/jobs', label: 'Jobs', icon: '📋' },
    { href: '/dashboard/payouts', label: 'Payouts', icon: '💰' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
    { href: '/dashboard/support', label: 'Support', icon: '💬' },
  ];

  return (
    <aside className="w-64 bg-white sticky top-0 h-screen border-r border-blue-100">
      <nav className="pt-8 px-4">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold text-dark">Urbance</h2>
          <p className="text-sm text-medium-grey">Provider Portal</p>
        </div>

        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  pathname === link.href
                    ? 'bg-[#2F80ED] text-white'
                    : 'text-medium-grey hover:bg-blue-50 hover:text-[#2F80ED]'
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
