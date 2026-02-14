import { useState, useRef, useCallback } from 'react';
import type { Bounds } from '@/types/common/api.types';

/**
 * 지도 영역(bounds) 관리
 */
export function useMapBounds() {
    const [bounds, setBounds] = useState<Bounds | null>(null);
    const boundsRef = useRef<Bounds | null>(null);

    const updateBounds = useCallback((map: kakao.maps.Map) => {
        const mapBounds = map.getBounds();
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();

        const newBounds: Bounds = {
            north: ne.getLat(),
            south: sw.getLat(),
            east: ne.getLng(),
            west: sw.getLng(),
        };

        const prevBounds = boundsRef.current;

        // 변경 없으면 스킵
        if (prevBounds && isBoundsEqual(prevBounds, newBounds)) {
            return;
        }

        boundsRef.current = newBounds;
        setBounds(newBounds);
    }, []);

    return {
        bounds,
        updateBounds,
    };
}

// 유틸리티 함수
function isBoundsEqual(a: Bounds, b: Bounds): boolean {
    return a.north === b.north && a.south === b.south && a.east === b.east && a.west === b.west;
}
