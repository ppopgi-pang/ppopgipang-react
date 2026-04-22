import { createPortal } from 'react-dom';
import { usePreventScroll } from './usePreventScroll';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetHandle } from './BottomSheetHandle';
import { useBottomSheet } from './useBottomSheet';
import type { BottomSheetProps } from './types';
import { ZINDEX } from '@/constants/z-index';
import { cn } from '@/libs/common/cn';

export function BottomSheet({ isOpen, onClose, title, children, halfRatio }: BottomSheetProps) {
    const { sheetRef, currentSnap, snapTo, dragHandleProps } = useBottomSheet({
        isOpen,
        onClose,
        halfRatio,
    });

    usePreventScroll(isOpen);

    const isFull = currentSnap === 'full';

    if (!isOpen) return null;

    // app-shell 컨테이너에 portal → 모바일 컨테이너 경계 안에서만 렌더링
    // document.body에 portal하면 데스크탑에서 backdrop이 전체 뷰포트를 덮는 문제 발생
    const portalTarget = document.querySelector('.app-shell') ?? document.body;

    return createPortal(
        <div className="absolute inset-0" style={{ zIndex: ZINDEX.bottomSheet }}>
            {/* backdrop */}
            <div data-backdrop className="absolute inset-0 bg-none" onClick={() => snapTo('closed')} />

            {/* Sheet */}
            <div
                ref={sheetRef}
                className={cn(
                    'absolute left-0 right-0 bottom-0',
                    'bg-white flex flex-col',
                    'h-full', // 높이를 100%로 고정하고 translateY로 위치 제어
                    isFull ? 'rounded-none' : 'rounded-t-2xl',
                )}
                style={{ willChange: 'transform' }}
            >
                {/* 전체화면: 페이지 헤더 */}
                {isFull && <BottomSheetHeader title={title} onBack={() => snapTo('closed', false)} />}

                {/* 하프: 핸들 */}
                {!isFull && <BottomSheetHandle dragHandleProps={dragHandleProps} />}

                {/* 콘텐츠 영역 */}
                <div className={cn('flex-1 px-5 pt-4', 'overflow-y-auto')}>
                    {/* overflow-y-auto 요소에 pb 적용 시 브라우저가 스크롤 끝 padding을 무시하는 버그 → 내부 래퍼에 적용 */}
                    <div className="flex flex-col pb-8">{children({ snapTo })}</div>
                </div>
            </div>
        </div>,
        portalTarget,
    );
}
