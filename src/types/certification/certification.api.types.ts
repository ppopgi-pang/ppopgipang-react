/**
 * 방문 인증
 */
export type PostVisitCertificationRequest = {
    latitude: number;
    longitude: number;
    store_id: number;
};

export type PostVisitCertificationResponse = {
    certification_count: number;
    id: number;
    occurred_at: string;
};
