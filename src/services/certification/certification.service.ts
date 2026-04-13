import { API_ENDPOINTS } from '@/constants/api';
import api from '@/libs/common/axios';
import type {
    PostVisitCertificationRequest,
    PostVisitCertificationResponse,
} from '@/types/certification/certification.api.types';

/**
 * Certification API 서비스
 */
export const certificationService = {
    /**
     * 가게 방문 인증 API
     */
    async checkIn(params: PostVisitCertificationRequest): Promise<PostVisitCertificationResponse> {
        const { data } = await api.post<PostVisitCertificationResponse>(API_ENDPOINTS.CERTIFICATIONS.CHECK_IN(), {
            data: params,
        });
        return data;
    },
} as const;
