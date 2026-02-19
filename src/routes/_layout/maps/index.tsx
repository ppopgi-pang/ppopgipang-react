import { createFileRoute } from '@tanstack/react-router';

// maps.tsx (부모)가 MapPage를 렌더링하므로 index는 null 반환
export const Route = createFileRoute('/_layout/maps/')({
    component: () => null,
});
