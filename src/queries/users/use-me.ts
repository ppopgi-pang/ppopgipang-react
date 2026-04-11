import { QUERY_KEYS } from '@/constants/api';
import { userService } from '@/services/user/user.service';
import type { UserInfo } from '@/types/user/user.types';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export const meQueryOptions = queryOptions<UserInfo | null>({
    queryKey: QUERY_KEYS.ME.ALL,
    queryFn: async () => {
        try {
            /** TODO: 백엔드 설계가 바뀔 부분 */
            const response = await userService.getMyInfo();
            return response;
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                return null;
            }
            throw error;
        }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
});

export const useMe = () => {
    return useQuery(meQueryOptions);
};
