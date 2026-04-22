import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { UserInfo } from '@/types/user/user.types';
import { useMe } from '@/hooks/queries/users/use-me';
import { QUERY_KEYS } from '@/constants/api';

/** * 전역 인증 상태 (앱 전체에서 로그인 여부와 유저 정보를 관리)
 */
export interface AuthContext {
    /** `user`: 로그인한 유저의 정보 (비로그인 시 null)*/
    user: UserInfo | null;
    isAuthenticated: boolean;
    /** 첫 앱 진입 시 /me API를 호출하여 로그인 상태를 확인하는 중인지 여부 */
    isLoading: boolean;
    // logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useMe();

    // 토큰 만료 이벤트 수신 → 리다이렉트 없이 비로그인 상태로 전환
    useEffect(() => {
        const handleTokenExpired = () => {
            queryClient.setQueryData(QUERY_KEYS.ME.ALL, null);
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);
        return () => window.removeEventListener('auth:token-expired', handleTokenExpired);
    }, [queryClient]);

    // user/isLoading이 실제로 바뀔 때만 새 객체 생성 → InnerApp 불필요 리렌더 방지
    const value = useMemo(
        () => ({
            user: user ?? null,
            isAuthenticated: !!user,
            isLoading,
        }),
        [user, isLoading],
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
