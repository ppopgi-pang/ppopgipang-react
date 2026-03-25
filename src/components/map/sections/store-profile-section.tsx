import { StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import type { StoreSummary } from '@/types/store/store.types';
import { StoreIcon } from 'lucide-react';

interface StoreProfileSectionProps {
    storeSummary: StoreSummary;
    thumbnailUrl: string | null;
}

/** 매장 프로필 정보 표시 — 썸네일, 이름, 별점, 리뷰 수 */
export default function StoreProfileSection({ storeSummary, thumbnailUrl }: StoreProfileSectionProps) {
    return (
        <FlexBox align={'center'} justify={'start'} className="w-full gap-4" as="div">
            {thumbnailUrl ? (
                <div className="rounded-full overflow-hidden size-16 shrink-0 bg-gray-200">
                    <img src={thumbnailUrl} alt={storeSummary.name} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="flex items-center justify-center size-16 p-4 rounded-full bg-[#FDECEE]">
                    <StoreIcon className="text-divider-primary size-6" />
                </div>
            )}

            <FlexBox direction={'column'} as="p" className="flex-1">
                <h2 className="title-1">{storeSummary.name}</h2>
                <FlexBox align="center" gap="xs">
                    <StarIcon className="text-brand-main3 size-3" />
                    <span className="text-base font-medium">{storeSummary.average_rating}</span>
                    <span className="text-base font-medium inline-block ml-1 shrink-0 no-wrap">
                        리뷰 {storeSummary.review_count}개
                    </span>
                </FlexBox>
            </FlexBox>
        </FlexBox>
    );
}
