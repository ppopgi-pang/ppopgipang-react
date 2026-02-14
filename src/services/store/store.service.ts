import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/axios';
import type {
    GetStoresInBoundsRequest,
    GetStoresInBoundsResponse,
    GetStoresNearbyRequest,
    GetStoresNearbyResponse,
    SearchStoresRequest,
    SearchStoresResponse,
} from '@/types/store/store.api.types';

/**
 * Store API 서비스
 */
export const storeService = {
    /**
     * 영역 내 매장 조회
     */
    async getStoresInBounds(params: GetStoresInBoundsRequest): Promise<GetStoresInBoundsResponse> {
        const { data } = await api.get<GetStoresInBoundsResponse>(API_ENDPOINTS.STORES.IN_BOUNDS, { params });
        return data;
    },

    /**
     * 주변 매장 조회
     */
    async getStoresNearby(params: GetStoresNearbyRequest): Promise<GetStoresNearbyResponse> {
        const { data } = await api.get<GetStoresNearbyResponse>(API_ENDPOINTS.STORES.NEARBY, { params });
        return data;
    },

    /**
     * 매장 검색
     */
    async searchStores(params: SearchStoresRequest): Promise<SearchStoresResponse> {
        const { data } = await api.get<SearchStoresResponse>(API_ENDPOINTS.STORES.SEARCH, { params });
        return data;
    },

    /**
     * 매장 상세 조회
     */
    // async getStoreDetail(id: number) {
    //     const { data } = await api.get(API_ENDPOINTS.STORES.DETAIL(id));
    //     return data;
    // },
} as const;
