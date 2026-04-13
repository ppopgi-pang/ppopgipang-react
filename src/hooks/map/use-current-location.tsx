import type { Coordinates } from '@/types/map/map.types';
import { useCallback, useEffect, useState } from 'react';

const isGeolocationSupported = typeof navigator !== 'undefined' && !!navigator.geolocation;

export default function useGeolocation() {
    const [isLoading, setIsLoading] = useState(isGeolocationSupported);
    const [error, setError] = useState<string | null>(
        isGeolocationSupported ? null : '이 브라우저는 위치 서비스를 지원하지 않아요.',
    );
    const [location, setLocation] = useState<Coordinates | null>(null);

    const onSuccess = useCallback((pos: GeolocationPosition) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
        console.log('위치 정보가 업데이트되었습니다:', { lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, []);

    const onError = useCallback((err: GeolocationPositionError) => {
        setError(err.message);
        setIsLoading(false);
        console.log('위치 정보를 가져오는 중 오류가 발생했습니다:', err.message);
    }, []);

    useEffect(() => {
        if (!isGeolocationSupported) return;

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, [onSuccess, onError]);

    // 외부에서 수동으로 위치를 다시 가져올 때 사용
    const refetch = useCallback(() => {
        if (!isGeolocationSupported) return;

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, [onSuccess, onError]);

    return {
        isLoading,
        isError: error !== null,
        error,
        location,
        refetch,
    };
}
