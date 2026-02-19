import FullScreenModal from '@/components/common/modal/full-screen-modal';
import { BookmarkIcon, LeftArrowIcon, StarIcon } from '@/assets/icons';
import { FlexBox } from '@/components/layout/flexbox';
import VisitCertificationButton from './buttons/visit-certification-button';
import { Map } from 'react-kakao-maps-sdk';
import ActiveMarker from './markers/active-marker';
import { useFetchStorePageData } from '@/hooks/queries/stores/use-fetch-store-page-data';
import { formatPaymentMethods } from '@/utils/store/format-payment-methods';

interface StoreDetailModalProps {
    storeId: number;
    onClose: () => void;
}

export default function StoreDetailModal({ storeId, onClose }: StoreDetailModalProps) {
    // TODO: storeId로 상세 데이터 fetch
    const { storeDetail, storeSummary, isPending, isError, error } = useFetchStorePageData(storeId);

    if (isPending) {
        return '스켈레톤';
    }

    if (isError) {
        return <div>{error?.message || ''}</div>;
    }

    if (isError || !storeDetail || !storeSummary) {
        return <div>에러!</div>;
    }

    return (
        <FullScreenModal>
            <FlexBox align="center" justify={'between'} gap="sm" asChild>
                <header className="w-full px-5 py-4 border-b-2 border-gray-200">
                    <button type="button" onClick={onClose} className="cursor-pointer">
                        <LeftArrowIcon className="w-[15px] h-[30px]" />
                    </button>
                </header>
            </FlexBox>

            <main className="w-full flex-1 flex flex-col gap-4">
                <FlexBox direction={'column'} className="w-full" as="section">
                    <FlexBox align={'center'} justify={'start'} className="w-full px-5 py-4 gap-4" as="div">
                        <img className="rounded-full overflow-hidden size-16 shrink-0" />
                        <FlexBox direction={'column'} as="p" className="flex-1">
                            <h2 className="title-1">{storeSummary.name}</h2>
                            <FlexBox align="center" gap="xs">
                                <StarIcon className="text-brand-main3 size-3" />
                                <span className="text-base font-medium">{storeSummary.average_rating}</span>
                                <span className="text-base font-medium inline-block ml-1 shrink-0 no-wrap">
                                    리뷰 {storeSummary.review_count}개
                                </span>
                            </FlexBox>
                        </FlexBox>
                        <VisitCertificationButton />
                    </FlexBox>
                    <img src={''} className="w-full h-[221px] object-cover" />
                </FlexBox>
                <FlexBox direction={'column'} className="w-full" as="section">
                    <nav className="w-full flex transition-all duration-200">
                        <button className="flex-1 p-2.5 font-semibold text-base border-b border-brand-main1">
                            가게정보
                        </button>
                        <button className="flex-1 p-2.5 font-semibold text-base text-gray-400 border-b border-gray-400">
                            방문내역
                        </button>
                        <button className="flex-1 p-2.5 font-semibold text-base text-gray-400 border-b border-gray-400">
                            리뷰 ({storeSummary.review_count})
                        </button>
                    </nav>
                    <FlexBox direction={'column'} gap={'md'} className="w-full px-5 py-4">
                        <h3 className="title-1">가게 정보</h3>
                        <FlexBox direction={'column'} gap="md" as="p" className="w-full p-4  bg-[#fff7f9] rounded-xl">
                            <Map
                                center={{ lat: 36, lng: 34 }}
                                style={{ width: '100%', height: '137px', borderRadius: '12px' }}
                            >
                                <ActiveMarker position={{ lat: 36, lng: 34 }} />
                            </Map>
                            <p className="body-3 flex items-center justify-start gap-2">
                                서울특별시 마포구 합정동 427-4{' '}
                                <button className="text-divider-primary underline underline-offset-3">복사</button>
                            </p>
                            <div className="w-full flex items-center justify-center gap-2">
                                <button className="bg-white rounded-lg body-1 py-2 px-2.5 text-gray-700 flex items-center gap-2">
                                    <BookmarkIcon className="size-6" /> 즐겨찾기
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
                                        <span className="text-brand-main1 bg-gray-100 px-2 py-1 rounded-full body-3">
                                            영업중
                                        </span>
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
                </FlexBox>
            </main>
        </FullScreenModal>
    );
}
