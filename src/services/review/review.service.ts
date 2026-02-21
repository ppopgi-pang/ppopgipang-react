import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/axios';
import type { GetStoreReviewsResponse } from '@/types/review/review.api.types';

/**
 * Review API 서비스
 */
export const reviewService = {
    /**
     * 가게 리뷰 목록 조회
     */
    async getStoreReviews(storeId: number): Promise<GetStoreReviewsResponse> {
        const { data } = await api.get<GetStoreReviewsResponse>(API_ENDPOINTS.REVIEWS.BY_STORE(storeId));
        return data;
    },
} as const;
