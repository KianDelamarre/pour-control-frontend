import { NavLink } from 'react-router';
import { Wine, Package, CalendarCheck, BarChart3 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
    const navItems = [
        { to: '/', label: 'Inventory', icon: Package, end: true },
        { to: '/cocktails', label: 'Cocktails', icon: Wine },
        { to: '/daily-closeout', label: 'Daily Closeout', icon: CalendarCheck },
        { to: '/reports', label: 'Reports', icon: BarChart3 },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Brand / Logo */}
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <Wine className="h-6 w-6 text-primary" />
                    <span>Pour Control</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 sm:gap-2">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    buttonVariants({
                                        variant: isActive ? 'default' : 'ghost',
                                        size: 'sm',
                                    }),
                                    'gap-2 transition-all',
                                    isActive && 'shadow-sm'
                                )
                            }
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}