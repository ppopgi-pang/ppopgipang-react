/**
 * 방문 인증
 */
export type PostVisitCertificationRequest = {
    latitude: number;
    longitude: number;
    rating: 'good' | 'bad';
    reason_ids: number[];
    store_id: number;
};

// export type PostVisitCertificationResponse = {
//     id: number;
//     rewards: {
//         current_level: number;
//         exp: number;
//         exp_to;
//     };
// };
