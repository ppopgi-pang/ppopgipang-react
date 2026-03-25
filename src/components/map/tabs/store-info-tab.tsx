import { FlexBox } from '@/components/layout/flexbox';
import { formatPaymentMethods } from '@/utils/store/format-payment-methods';
import type { StoreDetail } from '@/types/store/store.types';
import LocationPreviewMap from '../location-preview-map';
import { openMapDirections } from '@/utils/store/open-map-direction';
import { toast } from 'sonner';

interface StoreInfoTabProps {
    storeDetail: StoreDetail;
}

export default function StoreInfoTab({ storeDetail, storeName }: StoreInfoTabProps & { storeName: string }) {
    const handleCopy = async (textToCopy: string) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success('복사가 완료되었습니다');
        } catch {
            toast.error('텍스트 복사에 실패했습니다');
        }
    };

    return (
        <FlexBox direction={'column'} gap={'md'} className="w-full px-5 py-4">
            <h3 className="title-1">가게 정보</h3>
            <FlexBox direction={'column'} gap="md" as="p" className="w-full p-4  bg-[#fff7f9] rounded-xl">
                <LocationPreviewMap
                    latitude={storeDetail.latitude}
                    longitude={storeDetail.longitude}
                    wheelScrollable
                    draggable
                />
                <p className="body-3 flex items-center justify-between gap-2 pr-10 w-full">
                    <span className="flex-nowrap break-keep">{storeDetail.address}</span>
                    <button
                        onClick={() => handleCopy(storeDetail.address)}
                        className="text-divider-primary underline underline-offset-3 cursor-pointer hover:text-divider-primary/75 shrink-0"
                    >
                        복사
                    </button>
                </p>
                <div className="w-full flex items-center justify-center gap-2">
                    {/* <button
                        className="bg-white rounded-lg body-1 py-2 px-2.5 text-gray-700 flex items-center gap-2">
                        <BookmarkIcon className="size-6" /> 즐겨찾기 */}
                    <button
                        className="cursor-pointer bg-white rounded-lg body-1 py-2 px-2.5 text-gray-700 flex items-center gap-2 w-[130px]  justify-center"
                        onClick={() =>
                            openMapDirections(
                                'kakao',
                                {
                                    lat: storeDetail.latitude,
                                    lng: storeDetail.longitude,
                                },
                                storeName,
                            )
                        }
                    >
                        {/* <BookmarkIcon className="size-6" /> 즐겨찾기 */} 길찾기
                    </button>
                    <button className="bg-brand-main1 bg-main-1 text-white rounded-lg body-1 py-2 px-2.5 flex-1">
                        솔직 후기 남기기
                    </button>
                </div>
            </FlexBox>

            <FlexBox direction={'column'} justify={'around'} gap="xs" as="article" className="w-full">
                <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 items-baseline w-full  text-[#000]">
                    <dt className="body-1">영업시간</dt>
                    <dd className="flex flex-col gap-1 body-3 text-[#000]">
                        <div className="flex items-center gap-2">
                            <span className="text-brand-main1 bg-gray-100 px-2 py-1 rounded-full body-3">영업중</span>
                            <span>오늘 오전 9시 ~ 18시</span>
                        </div>
                        <p>매일 오전 9시 ~ 18시</p>
                    </dd>

                    <dt className="body-1">결제 방식</dt>
                    <dd className="body-3 ">
                        {formatPaymentMethods(storeDetail.store_facility_response.payment_methods)}
                    </dd>

                    <dt className="body-1">전화번호</dt>
                    <dd className="flex items-center h-ful">
                        <a href="tel:02-1234-1234" className="body-3 hover:underline text-[#000]">
                            {storeDetail.phone}
                        </a>
                    </dd>

                    {/* Row 4: 대표 메뉴 */}
                    <dt className="body-1">대표 메뉴</dt>
                    <dd className="w-full">
                        <ul className="flex flex-col gap-[5px] w-full body-3">
                            <li className="flex justify-between items-center">
                                <span>인형뽑기(1회)</span>
                                <span>1,000원</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>가챠</span>
                                <span>1,000원</span>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </FlexBox>
        </FlexBox>
    );
}
