import { CertificationImg } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { FlexBox } from '@/components/layout/flexbox';
import { ZINDEX } from '@/constants/z-index';
import { Link } from '@tanstack/react-router';
import type { MouseEvent } from 'react';

interface CheckInSuccessModalProps {
    /** 인증 횟수 */
    certificationCount: number;
    /** 인증 시각 */
    certifiedAt: Date;
    onClose: () => void;
}

/**
 * 방문인증 성공 모달
 * - 백드롭 클릭 시 닫힘
 * - 모달 본문 클릭은 이벤트 전파 차단
 */
export default function CheckInSuccessModal({ certificationCount, certifiedAt, onClose }: CheckInSuccessModalProps) {
    // 모달 본문 클릭이 백드롭으로 전파되지 않도록 차단
    const stopPropagation = (e: MouseEvent) => e.stopPropagation();

    return (
        <div
            style={{ zIndex: ZINDEX.checkInSuccessModal }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={onClose}
        >
            <FlexBox
                direction={'column'}
                align={'center'}
                gap={32}
                className="w-full m-4 max-w-[400px] bg-white rounded-xl px-4 py-7"
                onClick={stopPropagation}
            >
                <img src={CertificationImg} alt="방문인증 성공 이미지" />
                <FlexBox direction={'column'} align={'center'} gap={8} as={'section'} className="w-full">
                    <p className="body-4">🕒 {certifiedAt.toLocaleTimeString()}에 방문 인증됨</p>
                    <h2 className="title-1">
                        벌써 <span className="text-[#00B8FF]">{certificationCount}</span>번째 인증이네요!
                    </h2>
                    <Button variant={'default'} className="w-full">
                        이 가게 후기 남기기
                    </Button>
                    <Link to={`/maps`} className="text-gray-600 body-4 underline underline-offset-2">
                        근처 다른 뽑기방 보기
                    </Link>
                </FlexBox>
            </FlexBox>
        </div>
    );
}
