import { EditIcon } from '@/assets/icons';

interface VisitCertificationButtonProps {
    onClick?: () => void;
}

export default function VisitCertificationButton({ onClick }: VisitCertificationButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="active:scale-90 duration-300 bg-brand-main1 rounded-xl px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer shrink-0 hover:bg-brand-main1/80 active:bg-brand-main1/80 transition-colors"
        >
            <EditIcon />
            방문인증
        </button>
    );
}
