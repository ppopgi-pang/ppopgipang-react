import { Link, useMatchRoute } from '@tanstack/react-router';
import { FlexBox } from '@/components/layout/flexbox';
import { cn } from '@/libs/common/cn';
import React from 'react';

interface BottomNavProps {
    children: React.ReactNode;
}

interface NavItemProps {
    to: string;
    icon?: React.ReactNode;
}

function BottomNav({ children }: BottomNavProps) {
    return (
        // <div className="fixed bottom-5 left-0 right-0 z-10 px-4 max-w-[var(--app-max-width)] mx-auto">
        <FlexBox direction="row" justify="between" align="center" asChild>
            <nav className="bg-white/60 rounded-full px-2.5 py-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)] backdrop-blur-[10px] w-full">
                {children}
            </nav>
        </FlexBox>
        // </div>
    );
}

function NavItem({ to, icon }: NavItemProps) {
    const matchRoute = useMatchRoute();
    const isActive = matchRoute({ to });

    return (
        <FlexBox direction="column" justify="center" asChild>
            <Link
                to={to}
                className={cn('transition-colors', isActive ? 'text-brand-main1' : 'text-gray-900 hover:text-gray-800')}
            >
                <span
                    className={cn(
                        'flex flex-col items-center justify-center',
                        isActive &&
                            'bg-white px-4 rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] backdrop-blur-[16px]'
                    )}
                >
                    {icon && <span className="[&>svg]:w-[50px] [&>svg]:h-[50px]">{icon}</span>}
                </span>
            </Link>
        </FlexBox>
    );
}

BottomNav.Item = NavItem;

export { BottomNav };
