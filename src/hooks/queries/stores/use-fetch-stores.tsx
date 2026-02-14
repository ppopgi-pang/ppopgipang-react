import { storeService } from '@/services/store/store.service';
import type { Bounds } from '@/types/common/api.types';
import { useQuery } from '@tanstack/react-query';

export function useFetchStoresInBounds(bounds: Bounds | null) {
    const isBoundsValid =
        bounds !== null && bounds.north !== 0 && bounds.south !== 0 && bounds.east !== 0 && bounds.west !== 0;

    return useQuery({
        queryKey: ['stores', 'bounds', bounds],
        queryFn: async () => {
            if (!bounds || !isBoundsValid) {
                throw new Error('Invalid bounds');
            }
            const response = await storeService.getStoresInBounds(bounds);
            return response.data;
        },
        enabled: false,
        // staleTime: 5 * 60 * 1000,
        // gcTime: 10 * 60 * 1000,
    });
}
