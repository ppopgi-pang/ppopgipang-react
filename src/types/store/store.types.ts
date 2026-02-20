/**
 * 매장 타입 (카테고리)
 */
export interface StoreType {
    id: number;
    name: string;
    description: string;
}

/**
 * 기본 매장 정보
 */
export interface BaseStore {
    id: number;
    name: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
    region1: string;
    region2: string;
    average_rating: number;
    type: StoreType;
    created_at: string;
    updated_at: string;
}

/**
 * 영역 내 매장
 */
export interface StoreInBounds extends BaseStore {
    recent_review: string | null;
    review_count: number;
}

/**
 * 주변 매장 (거리 포함)
 */
export interface StoreNearby extends BaseStore {
    distance: number;
    recent_review: string | null;
    review_count: number;
}

/**
 * 검색된 매장 (썸네일 포함)
 */
export interface StoreSearch extends BaseStore {
    distance: number;
    thumbnail_name: string;
}

/**
 * 매장 상세 정보
 */

export type PaymentType = 'cash' | 'card' | 'qr';

export interface StoreFacility {
    machine_count: number;
    payment_methods: PaymentType[];
}

export interface StoreOpeningHour {
    id: number;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}

export interface StoreDetail {
    latitude: number;
    longitude: number;
    address: string;
    is_bookmark: boolean;
    phone: string;
    store_facility_response: StoreFacility;
    store_opening_hour_responses: StoreOpeningHour[];
}

export interface StoreSummary {
    average_rating: number;
    id: number;
    image_names: string[];
    name: string;
    review_count: number;
}
