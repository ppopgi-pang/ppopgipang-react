import { useQueries } from '@tanstack/react-query';
import { storeService } from '@/services/store/store.service';
import type { StoreDetail, StoreSummary } from '@/types/store/store.types';

export const useFetchStorePageData = (storeId: number) => {
    const [detailQuery, summaryQuery] = useQueries({
        queries: [
            {
                queryKey: ['store', 'detail', storeId],
                queryFn: () => storeService.getStoreDetail(storeId),
            },
            {
                queryKey: ['store', 'summary', storeId],
                queryFn: () => storeService.getStoreSummary(storeId),
            },
        ],
    });

    return {
        storeDetail: detailQuery.data as StoreDetail,
        storeSummary: summaryQuery.data as StoreSummary,
        isPending: detailQuery.isPending || summaryQuery.isPending,
        isError: detailQuery.isError || summaryQuery.isError,
        error: detailQuery.error ?? summaryQuery.error,
    };
};
