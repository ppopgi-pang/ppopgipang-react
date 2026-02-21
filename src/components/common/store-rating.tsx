import { StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';

interface StoreRatingProps {
    averageRating: number;
    reviewCount: number;
}

export default function StoreRating({ averageRating, reviewCount }: StoreRatingProps) {
    return (
        <FlexBox align="center" gap="xs">
            <StarIcon className="text-brand-main3 size-3" />
            <span className="text-base font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-base font-medium inline-block ml-1 shrink-0 no-wrap">
                리뷰 {reviewCount}개
            </span>
        </FlexBox>
    );
}
