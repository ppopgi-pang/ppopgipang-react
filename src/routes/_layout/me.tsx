import { FlexBox } from '@/components/layout/flexbox';
import { LoginPrompt } from '@/components/me/login-prompt';
import { BackButtonHeader } from '@/components/ui/back-button-header';
import { useAuth } from '@/providers/auth-provider';
import { meQueryOptions, useMe } from '@/queries/users/use-me';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/me')({
    component: RouteComponent,
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(meQueryOptions),
});

function RouteComponent() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { data: me, isPending, error, isError } = useMe();

    if (isPending || isLoading) {
        return <div>로딩 중...</div>;
    }
    if (isError) {
        return <div>{error.message}</div>;
    }

    return (
        <FlexBox direction="column" justify="start" align="center" className="relative w-full h-full">
            <BackButtonHeader onBack={() => router.history.back()} title="마이페이지" />
            {isAuthenticated ? <div>{me?.nickname}님, 안녕하세요!</div> : <LoginPrompt />}
        </FlexBox>
    );
}
