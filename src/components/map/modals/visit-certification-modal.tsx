import { LeftArrowIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import { ZINDEX } from '@/constants/z-index';
import { createPortal } from 'react-dom';
import StoreProfileSection from '../sections/store-profile-section';
import { useParams } from '@tanstack/react-router';
import { useStoreImages } from '@/hooks/queries/common/use-store-images';
import LocationPreviewMap from '../location-preview-map';
import { useFetchStorePageData } from '@/hooks/queries/stores/use-fetch-store-page-data';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import useCheckInMutation from '@/hooks/queries/certifications/use-check-in-mutation';
import CheckInSuccessModal from './check-in-success-modal';
import { useState } from 'react';
import type { PostVisitCertificationResponse } from '@/types/certification/certification.api.types';

interface VisitCertificationModalProps {
    onClose: () => void;
}

/**
 * 방문인증 모달
 * - FullScreenModal(z:10) 위에 렌더링되는 Portal 컴포넌트
 * - 닫기 시 onClose 호출 → 상위에서 visit search param 제거 → 매장 상세로 자동 복귀
 */
export default function VisitCertificationModal({ onClose }: VisitCertificationModalProps) {
    const { storeId } = useParams({ from: '/_layout/maps/$storeId' });
    const { storeDetail, storeSummary, isPending } = useFetchStorePageData(Number(storeId));
    const { imageUrls } = useStoreImages(storeSummary?.image_names ?? [], { enabled: !!storeSummary });
    const { isAuthenticated } = useAuth();

    type ModalState = { type: 'closed' } | { type: 'checkInSuccess'; data: PostVisitCertificationResponse };
    const [modal, setModal] = useState<ModalState>({ type: 'closed' });

    const { mutate: checkIn, isSuccess } = useCheckInMutation({
        storeId: Number(storeId),
        latitude: storeDetail?.latitude ?? 0,
        longitude: storeDetail?.longitude ?? 0,
    });

    const submitVisitCertification = () => {
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
        checkIn(undefined, {
            onSuccess: (data) => setModal({ type: 'checkInSuccess', data }),
        });
    };

    if (isPending) {
        return <div></div>;
    }

    if (!storeDetail || !storeSummary) {
        return <div></div>;
    }

    return createPortal(
        <div
            style={{ zIndex: ZINDEX.visitCertificationModal }}
            className="fixed inset-0 bg-gray-200 flex justify-center w-dvw h-dvh"
        >
            <div className="app-shell bg-white h-full flex flex-col">
                {/* 고정 헤더 */}
                <FlexBox align="center" justify="start" asChild gap="lg">
                    <header className="sticky top-0 bg-white w-full px-5 py-4 border-b-2 border-gray-200">
                        <button type="button" onClick={onClose} className="cursor-pointer">
                            <LeftArrowIcon className="w-[15px] h-[30px]" />
                        </button>
                        <h1 className="title-1">방문인증</h1>
                    </header>
                </FlexBox>

                <main className="relative flex-1 flex flex-col items-center bg-bg-primary px-5 pt-10 gap-4">
                    <p className="  text-center text-lg">
                        <span className="font-bold">매장 근처</span>에서 <br />
                        방문 인증을 할 수 있어요
                    </p>
                    <FlexBox direction={'column'} className="p-4 bg-white rounded-2xl w-full" gap="lg">
                        <StoreProfileSection storeSummary={storeSummary} thumbnailUrl={imageUrls[0]} />
                        {imageUrls.filter((url) => url !== null).length > 0 && (
                            <div className="w-full">
                                {imageUrls.map((url) => {
                                    if (!url) return;
                                    return <img src={url} />;
                                })}
                            </div>
                        )}
                        <LocationPreviewMap latitude={storeDetail.latitude} longitude={storeDetail.longitude} />
                        <FlexBox className="w-full" gap="lg">
                            <Button variant={'secondary'} size={'lg'} className="w-[124px]">
                                직접 검색
                            </Button>
                            <Button
                                variant={'default'}
                                size={'lg'}
                                className="flex-1"
                                onClick={submitVisitCertification}
                                disabled={isSuccess}
                            >
                                {isSuccess ? '방문인증 완료' : '위치로 방문인증'}
                            </Button>
                        </FlexBox>
                    </FlexBox>
                    {modal.type === 'checkInSuccess' && (
                        <CheckInSuccessModal
                            certificationCount={modal.data.certification_count}
                            certifiedAt={new Date(modal.data.occurred_at)}
                            onClose={() => setModal({ type: 'closed' })}
                        />
                    )}
                </main>
            </div>
        </div>,
        document.body,
    );
}
