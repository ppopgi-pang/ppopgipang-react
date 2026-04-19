import { certificationService } from '@/services/certification/certification.service';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function useCheckInMutation({
    storeId,
    latitude,
    longitude,
}: {
    storeId: number;
    latitude: number;
    longitude: number;
}) {
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await certificationService.checkIn({ store_id: storeId, latitude, longitude });
            return response;
        },
        onSuccess: () => {
            toast.success('방문 인증이 완료되었습니다.');
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || '체크인 실패';
                toast.error(errorMessage);
            }
        },
    });
    return mutation;
}
