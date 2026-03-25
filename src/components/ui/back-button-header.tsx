/**
 * BackButtonHeader
 *
 * ScreenHeader 위에 구성되는 헬퍼 컴포넌트.
 * left 슬롯에 뒤로가기 버튼(LeftArrowIcon), center 슬롯에 타이틀을 배치합니다.
 * forwardRef로 ref를 노출해 높이 측정(ResizeObserver)을 지원합니다.
 */
import { forwardRef, type ReactNode } from 'react';
import { LeftArrowIcon } from '@/assets/icons';
import { ScreenHeader } from './screen-header';

export interface BackButtonHeaderProps {
    /** 뒤로가기 버튼 클릭 핸들러 */
    onBack: () => void;
    /** 헤더 타이틀*/
    title?: string;
    /** 헤더 오른쪽 슬롯 */
    right?: ReactNode;
    /**
     * sticky 여부 (기본값: true)
     * ScreenHeader의 sticky prop으로 전달됨
     */
    sticky?: boolean;
    /** 추가 className */
    className?: string;
}

const BackButtonHeader = forwardRef<HTMLElement, BackButtonHeaderProps>(
    ({ onBack, title, right, sticky, className }, ref) => {
        return (
            <ScreenHeader
                ref={ref}
                sticky={sticky}
                className={className}
                left={
                    <button type="button" onClick={onBack} className="cursor-pointer">
                        <LeftArrowIcon className="w-4" />
                    </button>
                }
                center={title !== undefined ? <h1 className="title-1">{title}</h1> : undefined}
                right={right}
            />
        );
    },
);

BackButtonHeader.displayName = 'BackButtonHeader';

export { BackButtonHeader };
