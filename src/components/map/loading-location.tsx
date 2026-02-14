import { LocationIcon } from '@/assets/icons';

export default function LoadingLocation() {
    return (
        <div className="flex w-full h-full items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-bg-elevated flex items-center justify-center">
                    <LocationIcon className="h-8 w-8 text-brand-main1-dark" />
                </div>
                <p className="text-sm text-gray-600">현재 위치를 찾는 중...</p>
            </div>
        </div>
    );
}
