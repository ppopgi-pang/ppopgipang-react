import { EditIcon, StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import type { StoreItem } from '@/types/store/store.types';

interface StoreCardProps {
    store: StoreItem;
    onVisitClick?: (storeId: string) => void;
}

export function StoreCard({ store, onVisitClick }: StoreCardProps) {
    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl px-5 py-4 w-[85%] min-w-[308px] border-brand-main3-light shadow-[0px_0px_8px_0px_rgba(255,217,61,0.36)]">
            <FlexBox align="center" justify="between" className="px-2">
                <FlexBox direction="column" align="start" justify="start">
                    <h3 className="text-gray-900 text-base font-medium">{store.name}</h3>
                    <FlexBox align="center" gap="sm">
                        <FlexBox align="center" gap="xs" asChild>
                            <span className="inline-flex text-gray-900 text-base font-medium">
                                <StarIcon className="text-brand-main3 w-6 h-6" />
                                {/* {store.rating.toFixed(1)} */}
                                3.8
                            </span>
                        </FlexBox>
                        <span className="text-base">리뷰 3개</span>
                    </FlexBox>
                </FlexBox>

                <button
                    onClick={() => onVisitClick?.(store.id.toString())}
                    className="bg-brand-main1 rounded-xl px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer hover:bg-brand-main1/90 active:bg-brand-main1/80 transition-colors"
                >
                    <EditIcon />
                    방문인증
                </button>
            </FlexBox>

            {/* {store.latestReview && (
                <div className="w-full bg-bg-primary p-3 rounded-xl text-xs text-gray-900">
                    <p className="line-clamp-2">{store.latestReview}</p>
                </div>
            )} */}
        </div>
    );
}
