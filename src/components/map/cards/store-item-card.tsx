import { EditIcon, StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import { cn } from '@/libs/common/cn';
import type { StoreInBounds } from '@/types/store/store.types';

export default function StoreItemCard({ store, isActive }: { store: StoreInBounds; isActive: boolean }) {
    return (
        <div
            key={store.id}
            className={cn(
                'min-w-[308px] flex flex-col gap-3 bg-white rounded-xl px-5 py-4 w-[85%] scale-90 transition-all duration-300',
                isActive &&
                    'transition-all duration-200  border-brand-main3-light shadow-[0px_0px_8px_0px_rgba(255,217,61,0.36)] w-[95%] scale-100'
            )}
        >
            <FlexBox align="center" justify="between" className="px-2">
                <FlexBox direction="column" align="start" justify="start">
                    <h3 className="text-gray-900 text-base font-medium">{store.name}</h3>
                    <FlexBox align="center" gap="sm">
                        <FlexBox align="center" gap="xs" asChild>
                            <span className="inline-flex text-gray-900 text-base font-medium">
                                <StarIcon className="text-brand-main3 w-3 h-3" />
                                {store.average_rating.toFixed(1)}
                            </span>
                        </FlexBox>
                        <span className="text-base">리뷰 {store.review_count}개</span>
                    </FlexBox>
                </FlexBox>

                <button className="bg-brand-main1 rounded-xl px-2 py-1.5 text-white text-base flex items-center gap-1 cursor-pointer shrink-0">
                    <EditIcon />
                    방문인증
                </button>
            </FlexBox>

            {store.recent_review && (
                <div className="w-full bg-bg-primary p-3 rounded-xl text-xs text-gray-900">
                    <p className="line-clamp-2">{store.recent_review}</p>
                </div>
            )}
        </div>
    );
}
