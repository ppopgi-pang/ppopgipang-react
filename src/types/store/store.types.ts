export interface StoreItem {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string | null;
    averageRating?: number;
    distance?: number;
    isVisited?: boolean;
    thumbnailUrl?: string | null;
    type?: {
        id: number;
        name: string;
        description?: string | null;
    };
}

// Backend 표준 응답 구조
export interface StoreApiResponse {
    success: boolean;
    data: StoreItem[];
    meta: {
        count: number;
    };
}

// 페이지네이션 포함 응답
export interface StoreGalleryResponse {
    success: boolean;
    data: {
        certificationId: number;
        photoUrl: string;
        occurredAt: string;
        userName: string;
        userProfileImage: string | null;
        likeCount: number;
    }[];
    meta: {
        page: number;
        size: number;
        total: number;
    };
}

// 가게 요약 정보 (BottomSheet용)
export interface StoreSummary {
    store: {
        id: number;
        name: string;
        address: string;
        category?: string | null;
        latitude: number;
        longitude: number;
        distance?: number;
        thumbnailUrl?: string | null;
    };
    businessStatus: 'open' | 'closed' | 'unknown';
    myStatus: {
        visitCount: number;
        lootCount: number;
        isScrapped: boolean;
        tier: 'unknown' | 'visited' | 'master';
        stamps: {
            id: number;
            imageName: string;
            acquiredAt: string;
        }[];
    };
    recentLoots: {
        id: number;
        photoUrl: string;
        createdAt: string;
        userName: string;
    }[];
    successProb?: number;
    successLevel?: string;
    myRanking?: number;
}

// 레거시 호환용 (삭제 예정)
export interface StoreListResponse {
    stores: StoreItem[];
    total: number;
}
