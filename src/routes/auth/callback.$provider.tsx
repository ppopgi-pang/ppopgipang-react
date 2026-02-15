import Callback from '@/pages/auth/callback';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/callback/$provider')({
    component: RouteComponent,
});

function RouteComponent() {
    const { provider } = Route.useParams();
    return <Callback provider={provider} />;
}
