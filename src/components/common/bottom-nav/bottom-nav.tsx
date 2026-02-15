import { Link, useMatchRoute } from '@tanstack/react-router';
import { FlexBox } from '@/components/layout/flexbox';
import { cn } from '@/libs/common/cn';
import React from 'react';
import type { ComponentType } from 'react';

import { HomeIcon, StarIcon, ChatIcon, MyIcon, FeedIcon } from '@/assets/icons';
import { ZINDEX } from '@/constants/z-index';

export const MAIN_NAV_CONFIG = [
    { to: '/maps', icon: HomeIcon, label: '지도' },
    { to: '/feed', icon: FeedIcon, label: '피드' },
    { to: '/star', icon: StarIcon, label: '즐겨찾기' },
    { to: '/chat', icon: ChatIcon, label: '채팅' },
    { to: '/my', icon: MyIcon, label: '마이페이지' },
] as const;

const BOTTOM_NAV_STYLES = {
    container: 'fixed bottom-[var(--bottom-nav-offset)] left-0 right-0 px-5 max-w-[var(--app-max-width)] mx-auto',
    nav: 'backdrop-blur-[10px] flex items-center justify-between rounded-full bg-white/60 shadow-lg py-3 px-2.5',
    item: {
        base: 'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200',
        active: 'text-main-1  bg-white px-9 shadow-lg',
        inactive: 'text-gray-900 hover:text-gray-700',
    },
} as const;

// Props 타입 정의 개선
interface BottomNavProps {
    children: React.ReactNode;
    className?: string; // 커스터마이징 옵션 추가
}

interface NavItemProps {
    to: string;
    icon: ComponentType<{ className?: string }>;
    label?: string; // 접근성을 위한 라벨 추가
    exact?: boolean; // 정확한 경로 매칭 옵션
}

/**
 * 하단 네비게이션 컨테이너
 * @example
 * <BottomNav>
 *   <BottomNav.Item to="/home" icon={<HomeIcon />} label="홈" />
 * </BottomNav>
 */
function BottomNavRoot({ children, className }: BottomNavProps) {
    return (
        <div className={cn(BOTTOM_NAV_STYLES.container, className)} style={{ zIndex: ZINDEX.bottomNavigationBar }}>
            <FlexBox
                as="nav"
                align="center"
                justify="around"
                className={BOTTOM_NAV_STYLES.nav}
                role="navigation"
                aria-label="주요 네비게이션"
            >
                {children}
            </FlexBox>
        </div>
    );
}

function NavItem({ to, icon, label, exact = false }: NavItemProps) {
    const matchRoute = useMatchRoute();
    const isActive = !!matchRoute({ to, fuzzy: !exact });
    const Icon = icon;

    return (
        <Link
            to={to}
            className={cn(
                BOTTOM_NAV_STYLES.item.base,
                isActive ? BOTTOM_NAV_STYLES.item.active : BOTTOM_NAV_STYLES.item.inactive
            )}
            aria-label={label || to}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className="flex items-center justify-center size-[50px]">
                <Icon className="size-6" />
            </span>
        </Link>
    );
}

export const BottomNav = Object.assign(BottomNavRoot, {
    Item: NavItem,
});

export type { BottomNavProps, NavItemProps };
