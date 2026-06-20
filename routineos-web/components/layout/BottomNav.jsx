'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/today', label: 'Today', icon: '📅' },
  { href: '/habits', label: 'Habits', icon: '✅' },
  { href: '/insights', label: 'Insights', icon: '📊' },
  { href: '/buddy', label: 'Buddy', icon: '🤝' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pg-nav">
      <div className="pg-nav-inner">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} className={'pg-nav-item' + (active ? ' active' : '')}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
              <span className="label">{label}</span>
              {active && <span className="pg-nav-dot" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
