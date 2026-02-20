import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/axios';
import type {
    GetImageWithFileNameRequest,
    PostFileUploadsRequest,
    PostFileUploadsResponse,
} from '@/types/common/common.types';

/**
 * Common API 서비스
 */
export const commonService = {
    /**
     * 이미지 업로드
     */
    async postFileUploads(params: PostFileUploadsRequest): Promise<PostFileUploadsResponse> {
        const { data } = await api.post<PostFileUploadsResponse>(API_ENDPOINTS.COMMON.UPLOAD_IMAGE, params);
        return data;
    },

    /**
     * 파일명으로 이미지 조회
     * responseType: 'blob' 필수 — Axios 기본값은 JSON 파싱이므로 명시하지 않으면 Blob이 아닌 객체로 반환됨
     */
    async getImageWithFileName(params: GetImageWithFileNameRequest): Promise<Blob> {
        const { data } = await api.get<Blob>(API_ENDPOINTS.COMMON.GET_IMAGE(params), {
            responseType: 'blob',
        });
        return data;
    },
} as const;
