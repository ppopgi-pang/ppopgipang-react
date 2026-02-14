import type { Coordinates } from '@/types/map/map.types';
import { useEffect, useState } from 'react';

export default function useGeolocation() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<Coordinates | null>(null);

    useEffect(() => {
        const onSuccess = (pos: GeolocationPosition) => {
            setLoading(false);
            setError(null);
            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        };

        const onError = (err: GeolocationPositionError) => {
            setError(err.message);
            setLoading(false);
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return { loading, error, location };
}
