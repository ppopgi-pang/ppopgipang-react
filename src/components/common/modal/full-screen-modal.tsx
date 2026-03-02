import { ZINDEX } from '@/constants/z-index';
import { forwardRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// IntersectionObserver의 root로 스크롤 컨테이너를 사용할 수 있도록 ref 노출
const FullScreenModal = forwardRef<HTMLDivElement, { children: ReactNode }>(function FullScreenModal(
    { children },
    ref,
) {
    return createPortal(
        <div
            style={{ zIndex: ZINDEX.fullscreenModal }}
            className="fixed inset-0 bg-gray-200 flex justify-center w-dvw h-dvh"
        >
            <div ref={ref} className="app-shell bg-white h-full overflow-y-auto">
                {children}
            </div>
        </div>,
        document.body,
    );
});

export default FullScreenModal;