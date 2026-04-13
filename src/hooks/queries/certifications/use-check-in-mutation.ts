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
        onSuccess: (data) => {
            toast.success(`체크인 성공! 현재 방문 인증 횟수: ${data.certification_count}`);
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
