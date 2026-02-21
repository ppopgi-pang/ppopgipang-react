import CircularLoadingSpinner from '@/components/common/spinner/circular-loading-spinner';
import StoreRating from '@/components/common/store-rating';
import { FlexBox } from '@/components/layout/flexbox';
import { useFetchStoreReviews } from '@/hooks/queries/reviews/use-fetch-store-reviews';
import StoreReviewImage from '../sections/store-review-image';
import { useStoreImages } from '@/hooks/queries/common/use-store-images';

interface ReviewsTabProps {
    storeId: number;
}

export default function ReviewsTab({ storeId: storeId }: ReviewsTabProps) {
    const { data, isPending } = useFetchStoreReviews(storeId);

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

    return (
        <FlexBox direction={'column'} className="w-full px-5 py-4" gap="md">
            <FlexBox direction={'column'} gap="xs">
                <h3 className="title-1">리뷰 ({reviewCount})</h3>
                <StoreRating averageRating={3.2} reviewCount={reviewCount} />
            </FlexBox>

            {data.review_images.length > 0 ? (
                <FlexBox align={'center'} gap="sm">
                    {imageUrls.map((url) => {
                        return <StoreReviewImage src={url} />;
                    })}
                </FlexBox>
            ) : (
                <div className="w-full text-center text-gray-500 body-3">
                    사진 리뷰가 없습니다. 첫 번째로 사진 리뷰를 남겨보세요!
                </div>
            )}
        </FlexBox>
    );
}
