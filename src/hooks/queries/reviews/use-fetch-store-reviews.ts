import { QUERY_KEYS } from '@/constants/api';
import { reviewService } from '@/services/review/review.service';
import { useQuery } from '@tanstack/react-query';

export function useFetchStoreReviews(storeId: number) {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.BY_STORE(storeId),
        queryFn: async () => {
            const response = await reviewService.getStoreReviews(storeId);
            return response;
        },
        enabled: !!storeId,
    });
}
