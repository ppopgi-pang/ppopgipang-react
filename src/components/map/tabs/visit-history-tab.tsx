import { ActiveMarker } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import VisitCertificationButton from '../buttons/visit-certification-button';

interface VisitHistoryTabProps {
    storeId: number;
}

export default function VisitHistoryTab({ storeId: storeId }: VisitHistoryTabProps) {
    if (!storeId) return null;
    return (
        <FlexBox direction={'column'} className="w-full px-5 py-4" gap="md">
            <h3 className="title-1">방문내역</h3>
            <FlexBox align={'center'} gap="sm" className="overflow-scroll min-w-dvw">
                <FlexBox
                    direction={'column'}
                    align={'end'}
                    className="shadow-[0px_2px_4px_rgba(0,0,0,0.04)] border-[0.25px] border-gray-200 p-4 rounded-2xl bg-[#FFF7F9]"
                    gap="sm"
                >
                    <div className="flex items-center gap-4 ">
                        <ActiveMarker className="w-4" />
                        <p className="body-3 text-nowrap">000님은 이번 달에 총 5번 방문했어요!</p>
                    </div>
                    <VisitCertificationButton />
                </FlexBox>
            </FlexBox>
        </FlexBox>
    );
}
