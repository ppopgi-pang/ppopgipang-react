import { ReloadIcon } from '@/assets/icons';
import { ZINDEX } from '@/constants/z-index';

export default function RefetchStoreButton({
    onRefetchStore,
    isVisible,
}: {
    onRefetchStore: () => void;
    isVisible: boolean;
}) {
    if (!isVisible) return null;
    return (
        <button
            className="bg-brand-main1-light rounded-full px-3 py-2  text-sm text-brand-main1-dark font-semibold flex items-center gap-2 cursor-pointer"
            style={{ zIndex: ZINDEX.mapButton }}
            onClick={onRefetchStore}
        >
            <ReloadIcon className="w-3 h-3" />현 지도에서 검색
        </button>
    );
}
