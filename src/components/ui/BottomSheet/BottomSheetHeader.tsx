import { BackButtonHeader } from '../back-button-header';

interface Props {
    title?: string;
    onBack: () => void;
}

/**
 * 전체화면 전용 헤더.
 * 기존 ScreenHeader + BackButtonHeader 그대로 재사용합니다.
 */
export function BottomSheetHeader({ onBack }: Props) {
    return <BackButtonHeader onBack={onBack} />;
}
