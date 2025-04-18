'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Program Advisor', href: '/' },
    { name: 'Spin Simulator', href: '/spin-simulator' },
    // You can add these back later once they're stable
    // { name: 'Schedule', href: '/coach-schedule' },
    // { name: 'Billing', href: '/billing' },
    // { name: 'Coaching Hub', href: '/coaching-hub' },
  ];

  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex gap-4 items-center justify-center">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium px-4 py-2 rounded transition ${
            pathname === item.href
              ? 'bg-blue-600 text-white'
              : 'text-blue-700 hover:bg-blue-100'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
