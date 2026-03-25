import { FlexBox } from '@/components/layout/flexbox';
import { LoginPrompt } from '@/components/me/login-prompt';
import { BackButtonHeader } from '@/components/ui/back-button-header';
import { createFileRoute, useRouter } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/me')({
    component: RouteComponent,
});

function RouteComponent() {
    const router = useRouter();

    return (
        <FlexBox direction="column" justify="start" align="center" className="relative w-full h-full">
            <BackButtonHeader onBack={() => router.history.back()} title="마이페이지" />
            <LoginPrompt />
        </FlexBox>
    );
}
