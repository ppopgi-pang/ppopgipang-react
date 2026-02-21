/**
 * 리뷰
 */
export interface Review {
    id: number;
    content: string;
    rating: number;
    images: string[];
    create_at: string;
    updated_at: string;
}

/**
 * 가게 리뷰 목록
 */
export interface StoreReviews {
    review_images: string[];
    reviews_responses: Review[];
}
