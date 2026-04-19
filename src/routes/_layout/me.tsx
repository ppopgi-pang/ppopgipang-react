import { FlexBox } from '@/components/layout/flexbox';
import { LoginPrompt } from '@/components/me/login-prompt';
import { BackButtonHeader } from '@/components/ui/back-button-header';
import { useAuth } from '@/providers/auth-provider';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/me')({
    component: RouteComponent,
});

function RouteComponent() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <FlexBox direction="column" justify="start" align="center" className="relative w-full h-full">
            <BackButtonHeader onBack={() => router.history.back()} title="마이페이지" />
            {isAuthenticated ? <div>{user?.nickname}님, 안녕하세요!</div> : <LoginPrompt />}
        </FlexBox>
    );
}
