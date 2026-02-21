import { createFileRoute, Navigate } from '@tanstack/react-router';

// 홈(/)은 지도 화면(/maps)으로 리다이렉트
export const Route = createFileRoute('/_layout/')({
    component: () => <Navigate to="/maps" replace />,
});
