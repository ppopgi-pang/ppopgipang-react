import { useState, useRef, useCallback } from 'react';
import type { Bounds } from '@/types/common/api.types';

/**
 * 지도 영역(bounds) 관리
 *
 * currentBounds: 현재 지도가 보여주는 영역 (ref로만 관리)
 * searchBounds: API 호출용 영역 (state로 관리)
 */
export function useMapBounds() {
    // API 호출용 bounds (재검색 버튼 클릭 시만 업데이트)
    const [searchBounds, setSearchBounds] = useState<Bounds | null>(null);

    // 현재 지도 bounds (렌더링 불필요, ref로만 관리)
    const currentBoundsRef = useRef<Bounds | null>(null);

    /**
     * 지도 이동/줌 시 현재 bounds만 업데이트 (렌더링 없음)
     */
    const updateCurrentBounds = useCallback((map: kakao.maps.Map) => {
        const mapBounds = map.getBounds();
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();

        const newBounds: Bounds = {
            north: ne.getLat(),
            south: sw.getLat(),
            east: ne.getLng(),
            west: sw.getLng(),
        };

        currentBoundsRef.current = newBounds;
    }, []);

    /**
     * 재검색 버튼 클릭 시 API 호출용 bounds 업데이트
     */
    const commitSearchBounds = useCallback(() => {
        if (currentBoundsRef.current) {
            setSearchBounds({ ...currentBoundsRef.current });
        }
    }, []);

    /**
     * 초기 bounds 설정 (첫 로딩 시)
     */
    const initializeSearchBounds = useCallback((map: kakao.maps.Map) => {
        const mapBounds = map.getBounds();
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();

        const initialBounds: Bounds = {
            north: ne.getLat(),
            south: sw.getLat(),
            east: ne.getLng(),
            west: sw.getLng(),
        };

        currentBoundsRef.current = initialBounds;
        setSearchBounds(initialBounds);
    }, []);

    return {
        currentBoundsRef, // 현재 지도 영역 (읽기 전용)
        searchBounds, // API 호출용 영역
        updateCurrentBounds, // 지도 이동 시 호출
        commitSearchBounds, // 재검색 버튼 클릭 시 호출
        initializeSearchBounds, // 초기 로딩 시 호출
    };
}
