/**
 * ScreenHeader
 *
 * 앱 내 화면(모달·페이지) 상단 헤더 공통 컴포넌트.
 * left / center / right 슬롯 기반으로 구성하며,
 * forwardRef로 ref를 노출해 높이 측정(ResizeObserver)을 지원합니다.
 */
import { cn } from '@/libs/common/cn';
import { forwardRef, type ReactNode } from 'react';

export interface ScreenHeaderProps {
    /** 헤더 왼쪽 슬롯 (뒤로가기 버튼 등) */
    left?: ReactNode;
    /** 헤더 가운데 슬롯 (타이틀, 검색 인풋 등) */
    center?: ReactNode;
    /** 헤더 오른쪽 슬롯 (액션 버튼 등) */
    right?: ReactNode;
    /**
     * sticky 여부 (기본값: true)
     * true 이면 sticky top-0 z-20 을 적용합니다.
     */
    sticky?: boolean;
    /** 추가 className */
    className?: string;
}

const ScreenHeader = forwardRef<HTMLElement, ScreenHeaderProps>(
    ({ left, center, right, sticky = true, className }, ref) => {
        return (
            <header
                ref={ref}
                className={cn(
                    // 기본 스타일
                    'w-full bg-white border-b-2 border-gray-200 px-5 py-4',
                    'flex items-center justify-between gap-2',
                    // sticky 옵션
                    sticky && 'sticky top-0 z-20',
                    className,
                )}
            >
                {/* 왼쪽 슬롯 */}
                <div className="flex items-center shrink-0">{left}</div>

                {/* 가운데 슬롯 — flex-1 로 남은 공간 차지 */}
                {center !== undefined && <div className="flex-1 flex items-center min-w-0">{center}</div>}

                {/* 오른쪽 슬롯 */}
                {right !== undefined && <div className="flex items-center shrink-0">{right}</div>}
            </header>
        );
    },
);

ScreenHeader.displayName = 'ScreenHeader';

export { ScreenHeader };
