import { useQueries } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { commonService } from '@/services/common/common.service';
import type { GetImageWithFileNameRequest } from '@/types/common/common.types';
import { imageKeys } from './query-keys';

/**
 * "stores/4-cover.jpg" → { path: "stores", fileName: "4-cover.jpg" }
 * 중첩 경로도 처리: "stores/sub/img.jpg" → { path: "stores/sub", fileName: "img.jpg" }
 */
export function parseImageName(imageName: string): GetImageWithFileNameRequest {
    const lastSlash = imageName.lastIndexOf('/');
    if (lastSlash === -1) {
        return { path: '', fileName: imageName };
    }
    return {
        path: imageName.substring(0, lastSlash),
        fileName: imageName.substring(lastSlash + 1),
    };
}

/**
 * 매장 이미지 목록을 병렬로 페칭하는 훅
 *
 * - 각 이미지를 독립 쿼리로 관리 → 개별 캐싱, 일부 실패해도 나머지 정상 표시
 * - Blob → Object URL 변환 후 반환 (인증 헤더가 필요한 API이므로 <img src> 직접 사용 불가)
 * - Map으로 Object URL을 추적하여 중복 생성 방지
 * - 언마운트 또는 imageNames 변경 시 사용하지 않는 Object URL 해제 (메모리 누수 방지)
 *
 * @param imageNames - 서버에서 받은 이미지 경로 배열 (예: ["stores/4-cover.jpg", ...])
 * @param enabled - false면 imageNames가 있어도 페칭하지 않음 (상위 쿼리 로딩 중일 때 사용)
 *
 * @example
 * // storeSummary가 없으면 [] → 쿼리 없음, 도착하면 자동으로 페칭 시작
 * const { imageUrls } = useStoreImages(storeSummary?.image_names ?? []);
 *
 * // 명시적 제어가 필요할 때
 * const { imageUrls } = useStoreImages(imageNames, { enabled: !isSummaryLoading });
 */
export function useStoreImages(imageNames: string[], { enabled = true }: { enabled?: boolean } = {}) {
    const objectUrlMapRef = useRef<Map<string, string>>(new Map());

    const results = useQueries({
        queries: imageNames.map((imageName, idx) => ({
            queryKey: imageKeys.image(imageName),
            queryFn: async () => {
                // const params = parseImageName(imageName);

                if (idx === 0) {
                    const params = { path: 'temps', fileName: 'eb288427-3020-4812-9e1c-2b8e953462db.png' };
                    return commonService.getImageWithFileName(params);
                } else {
                    const params = { path: 'temps', fileName: 'df9a096d-085b-4e78-8365-633eefb473d0.png' };
                    return commonService.getImageWithFileName(params);
                }
            },
            enabled,
            // 이미지 파일은 변경되지 않으므로 한 번 로드하면 stale 처리 안 함
            staleTime: Infinity,
            // 메모리 절약을 위해 10분 후 가비지 컬렉션
            gcTime: 10 * 60 * 1000,
        })),
    });

    // imageNames가 변경될 때 더 이상 쓰지 않는 Object URL 해제
    useEffect(() => {
        const activeNames = new Set(imageNames);

        objectUrlMapRef.current.forEach((url, name) => {
            if (!activeNames.has(name)) {
                URL.revokeObjectURL(url);
                objectUrlMapRef.current.delete(name);
            }
        });
    }, [imageNames.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    // 컴포넌트 언마운트 시 남은 Object URL 전부 해제
    useEffect(() => {
        return () => {
            objectUrlMapRef.current.forEach((url) => URL.revokeObjectURL(url));
            objectUrlMapRef.current.clear();
        };
    }, []);

    // Blob → Object URL 변환 (이미 변환된 것은 기존 URL 재사용)
    const imageUrls = results.map((result, index) => {
        if (!result.data) return null;

        const name = imageNames[index];
        if (!objectUrlMapRef.current.has(name)) {
            objectUrlMapRef.current.set(name, URL.createObjectURL(result.data));
        }
        return objectUrlMapRef.current.get(name) ?? null;
    });

    return {
        // 순서 보장: imageNames 배열과 동일한 순서로 URL 반환 (로드 전이면 null)
        imageUrls,
        // 한 개라도 로딩 중이면 true
        isLoading: results.some((r) => r.isPending),
        // 한 개라도 에러면 true
        isError: results.some((r) => r.isError),
        // 로드 완료된 이미지 수 (UI에서 진행률 표시 등에 활용)
        loadedCount: results.filter((r) => r.isSuccess).length,
        totalCount: imageNames.length,
    };
}
