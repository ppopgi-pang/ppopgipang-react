import LoginPage from '@/pages/auth/login-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: RouteComponent,
});

function RouteComponent() {
    return <LoginPage />;
}
