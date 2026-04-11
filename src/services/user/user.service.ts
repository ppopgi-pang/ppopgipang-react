import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/axios';
import type { GetMyInfoResponse } from '@/types/user/user.api.types';

/**
 * User API 서비스
 */
export const userService = {
    /**
     * 내 정보 조회
     * - 액세스 토큰으로 현재 로그인한 사용자의 정보를 조회
     */
    async getMyInfo(): Promise<GetMyInfoResponse> {
        const { data } = await api.get<GetMyInfoResponse>(API_ENDPOINTS.USERS.ME);
        return data;
    },
} as const;
