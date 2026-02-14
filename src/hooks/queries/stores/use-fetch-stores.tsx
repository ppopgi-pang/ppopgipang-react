import { storeService } from '@/services/store/store.service';
import type { Bounds } from '@/types/common/api.types';
import { useQuery } from '@tanstack/react-query';

export function useFetchStoresInBounds(bounds: Bounds) {
    const isBoundsValid = bounds.north !== 0 && bounds.south !== 0;

    return useQuery({
        queryKey: ['stores', bounds.north, bounds.south, bounds.east, bounds.west],
        queryFn: async () => {
            if (!isBoundsValid) return;
            return await storeService.getStoresInBounds(bounds).then((res) => res.data);
        },
        enabled: false,
        placeholderData: (previousData) => previousData,
    });
}
