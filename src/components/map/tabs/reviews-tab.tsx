import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import StoreRating from '@/components/common/store-rating';
import { FlexBox } from '@/components/layout/flexbox';
import { useFetchStoreReviews } from '@/hooks/queries/reviews/use-fetch-store-reviews';
import { useStoreImages } from '@/hooks/queries/common/use-store-images';
import StoreReviewImage from '../sections/store-review-image';
import { ReviewItem } from '../sections/review-item';

interface ReviewsTabProps {
    storeId: number;
}

export default function ReviewsTab({ storeId }: ReviewsTabProps) {
    const { data, isPending } = useFetchStoreReviews(storeId);

    // 가게 대표 리뷰 이미지 목록을 Object URL 배열로 변환
    const { imageUrls } = useStoreImages(data?.review_images ?? []);

    if (isPending) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    }

    if (!data) {
        return <div>데이터가 없습니다</div>;
    }

    const reviewCount = data.reviews_responses.length;

    // 리뷰가 있는 경우 평균 별점 계산, 없으면 0
    const averageRating =
        reviewCount > 0 ? data.reviews_responses.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

    return (
        <FlexBox direction="column" className="w-full px-5 py-4" gap="md">
            {/* 요약 헤더: 리뷰 수 및 평균 별점 */}
            <FlexBox direction="column" gap="xs">
                <h3 className="title-1">리뷰 ({reviewCount})</h3>
                <StoreRating averageRating={averageRating} reviewCount={reviewCount} />
            </FlexBox>

            {/* 가게 대표 리뷰 이미지 썸네일 목록 */}
            {imageUrls.length > 0 ? (
                <FlexBox align="center" gap="sm">
                    {imageUrls.map((url, index) => (
                        <StoreReviewImage key={data.review_images[index]} src={url} />
                    ))}
                </FlexBox>
            ) : (
                <div className="w-full text-center text-gray-500 body-3 h-[120px] flex items-center justify-center">
                    사진 리뷰가 없습니다. <br />첫 번째로 사진 리뷰를 남겨보세요!
                </div>
            )}

            {/* 개별 리뷰 목록 */}
            <FlexBox direction="column" as="ol" className={'w-full'}>
                {data.reviews_responses.map((review) => (
                    <li key={review.id} className="w-full">
                        <ReviewItem review={review} />
                    </li>
                ))}
            </FlexBox>
        </FlexBox>
    );
}
