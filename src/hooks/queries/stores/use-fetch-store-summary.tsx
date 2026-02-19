import { storeService } from '@/services/store/store.service';
import { useQuery } from '@tanstack/react-query';

export const useFetchStoreSummary = (storeId: number) =>
    useQuery({
        queryKey: ['store', 'summary', storeId],
        queryFn: async () => await storeService.getStoreSummary(storeId),
    });
