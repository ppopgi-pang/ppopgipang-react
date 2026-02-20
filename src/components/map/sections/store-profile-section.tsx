import { StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import VisitCertificationButton from '@/components/map/buttons/visit-certification-button';
import type { StoreSummary } from '@/types/store/store.types';

interface StoreProfileSectionProps {
    storeSummary: StoreSummary;
    thumbnailUrl: string | null;
}

export default function StoreProfileSection({ storeSummary, thumbnailUrl }: StoreProfileSectionProps) {
    return (
        <FlexBox align={'center'} justify={'start'} className="w-full px-5 py-4 gap-4" as="div">
            <div className="rounded-full overflow-hidden size-16 shrink-0 bg-gray-200">
                {thumbnailUrl && (
                    <img src={thumbnailUrl} alt={storeSummary.name} className="w-full h-full object-cover" />
                )}
            </div>
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
            <VisitCertificationButton />
        </FlexBox>
    );
}
