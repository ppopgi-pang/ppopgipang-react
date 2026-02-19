import { storeService } from '@/services/store/store.service';
import { useQuery } from '@tanstack/react-query';

export const useFetchStoreDetail = (storeId: number) =>
    useQuery({
        queryKey: ['store', 'detail', storeId],
        queryFn: async () => await storeService.getStoreDetail(storeId),
    });
