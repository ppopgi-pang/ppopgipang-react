import { StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import { useStoreImages } from '@/hooks/queries/common/use-store-images';
import type { Review } from '@/types/review/review.types';
import { formatReviewDate } from '@/utils/store/format-review-date';
import StoreReviewImage from './store-review-image';

interface ReviewItemProps {
    review: Review;
}

/**
 * 개별 리뷰 아이템 컴포넌트
 * - 리뷰 이미지는 useStoreImages 훅으로 Object URL 변환 후 표시
 * - 닉네임·프로필 이미지는 현재 API에서 제공하지 않으므로 기본값으로 처리
 */
export function ReviewItem({ review }: ReviewItemProps) {
    // 리뷰 이미지 경로 배열을 Object URL 배열로 변환
    const { imageUrls } = useStoreImages(review.images);

    return (
        <FlexBox direction="column" as="article" className="w-full p-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] gap-4">
            {/* 작성자 정보 영역 */}
            <FlexBox direction="row" align="center" gap="md">
                {/* 프로필 이미지: API 미제공으로 placeholder 표시 */}
                <div className="size-16 rounded-full bg-gray-200 shrink-0" role="img" aria-label="프로필 이미지" />
                <FlexBox direction="column">
                    {/* 닉네임: API 미제공으로 '익명' 표시 */}
                    <strong className="text-gray-900 title-1 font-semibold">익명</strong>
                    <FlexBox align="center" gap="xs">
                        <StarIcon className="text-brand-main3 size-3" aria-hidden="true" />
                        <span className="body-1">{review.rating.toFixed(1)}</span>
                    </FlexBox>
                </FlexBox>
            </FlexBox>

            {/* 리뷰 이미지 목록 */}
            {imageUrls.length > 0 && (
                <FlexBox direction="row" className="w-full overflow-x-auto" gap="md">
                    {imageUrls.map((url, index) => (
                        <StoreReviewImage
                            key={review.images[index]}
                            src={url}
                            className="h-[180px] rounded-lg w-[288px] shrink-0"
                        />
                    ))}
                </FlexBox>
            )}

            {/* 리뷰 본문 */}
            {review.content && <p className="body-3 break-keep">{review.content}</p>}

            {/* 작성일: time 태그로 접근성 보장 */}
            <time dateTime={review.updated_at} className="body-4 text-gray-500 self-end">
                {formatReviewDate(review.updated_at)}
            </time>
        </FlexBox>
    );
}
