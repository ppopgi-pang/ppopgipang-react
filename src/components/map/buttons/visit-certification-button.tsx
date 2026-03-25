import { EditIcon } from '@/assets/icons';

interface VisitCertificationButtonProps {
    onClick?: () => void;
}

export default function VisitCertificationButton({ onClick }: VisitCertificationButtonProps) {
    // 부모 카드/슬라이드로의 이벤트 버블링 차단 — 방문인증과 카드 클릭 동작을 분리
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="active:scale-90 duration-300 bg-brand-main1 rounded-lg px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer shrink-0 hover:bg-brand-main1/80 active:bg-brand-main1/80 transition-colors "
        >
            <EditIcon />
            방문인증
        </button>
    );
}
