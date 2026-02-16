import { ZINDEX } from '@/constants/z-index';
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function FullScreenModal({ children }: { children: ReactNode }) {
    return createPortal(
        <div
            style={{ zIndex: ZINDEX.fullscreenModal }}
            className="fixed inset-0 bg-gray-200 flex justify-center w-dvw h-dvh"
        >
            <div className="app-shell bg-white h-full overflow-y-auto">{children}</div>
        </div>,
        document.body
    );
}
