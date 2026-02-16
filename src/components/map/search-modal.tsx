import { useState } from 'react';
import FullScreenModal from '../common/modal/full-screen-modal';
import { FlexBox } from '../layout/flexbox';
import { ClockIcon, CloseIcon, LeftArrowIcon, StarIcon } from '@/assets/icons';
import { storeService } from '@/services/store/store.service';
import { useQuery } from '@tanstack/react-query';
import useGeolocation from '@/hooks/map/use-user-location';
import CircularLoadingSpinner from '../common/spinner/circular-loading-spinner';
import { Link } from '@tanstack/react-router';

export default function SearchModal({ prevText, onClose }: { prevText?: string; onClose: () => void }) {
    const [searchText, setSearchText] = useState<string>(prevText || '');

    const isLoggedIn = false;

    const { coordinates: userLocation } = useGeolocation({
        watch: false,
        enableHighAccuracy: false,
        maximumAge: 300000,
    });

    const {
        data: searchResult,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['search-result', searchText],
        queryFn: async () => {
            return await storeService.searchStores({
                keyword: searchText,
                latitude: userLocation?.lat,
                longitude: userLocation?.lng,
                page: 1,
                size: 20,
            });
        },
        enabled: false,
    });

    let content = (
        <>
            <h2 className="px-5 pt-4 pb-2 text-gray-900 text-base font-medium text-left">최근 검색</h2>
            <ol className="w-full flex flex-col">
                <li className="px-5 hover:bg-gray-100 transition-colors duration-200 py-4 flex items-center justify-between">
                    <span className="flex items-center gap-4 font-medium text-base">
                        <ClockIcon className="size-5" />
                        팡팡뽑기방
                    </span>
                    <button type="button" className="cursor-pointer">
                        <CloseIcon className="size-6" />
                    </button>
                </li>
            </ol>
        </>
    );

    if (isLoading) {
        // 데이터를 가져오는 중
        content = (
            <div className="flex py-14 items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    } else if (searchResult) {
        // 데이터를 가져온 경우
        if (searchResult.data.length > 0) {
            content = (
                <FlexBox direction="column" className="w-full h-full">
                    <FlexBox align="center" justify="end" gap="lg" className="w-full py-5 px-5">
                        <button className="cursor-pointer flex items-center gap-1 text-brand-main1 font-semibold leading-none">
                            <div className="inline-block text-[12px] w-1.5 h-1.5 rounded-full bg-brand-main1 shrink-0"></div>
                            거리 순
                        </button>

                        <button className="cursor-pointer flex items-center gap-1 text-gray-500 font-medium shrink-0 leading-none">
                            <span className="inline-block text-[12px] w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0"></span>
                            별점 순
                        </button>
                    </FlexBox>
                    <FlexBox direction="column" className="flex-1 w-full" asChild>
                        <ol>
                            {searchResult.data.map((data) => (
                                <li className="transition-all duration-100 cursor-pointer w-full flex items-center pl-5 pr-9 py-4 hover:bg-gray-100 gap-4">
                                    <img src={data.thumbnail_name} className="size-11 rounded-full" />
                                    <FlexBox direction="column" gap="sm" className="flex-1">
                                        <h3 className="leading-none font-semibold text-base">{data.name}</h3>
                                        <p className="flex items-center gap-2.5 text-xs font-medium leading-none">
                                            {data.address}{' '}
                                            <span className="text-gray-400 text-xs font-normal">
                                                {Math.round(data.distance / 1000)}km
                                            </span>
                                        </p>
                                    </FlexBox>
                                    <div className="flex items-center gap-1">
                                        <StarIcon className="w-3 text-brand-main3" />
                                        <span className="text-base font-semibold">{data.average_rating}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </FlexBox>
                </FlexBox>
            );
        } else {
            content = (
                <section className="w-full flex flex-col gap-6">
                    <header className="py-5 px-5">
                        <h3 className="font-medium text-base">관련 검색 결과</h3>
                    </header>
                    <article className="text-center text-gray-700 font-medium text-base">
                        관련 검색 결과를 찾을 수 없어요!
                        <br />
                        가게 정보가 없다면?{' '}
                        <Link to="/" className="text-brand-main1 text-base font-medium underline underline-offset-4">
                            가게 정보 제안하기
                        </Link>
                    </article>
                </section>
            );
        }
    } else if (!isLoggedIn) {
        content = (
            <div className="w-full p-6 bg-brand-main1-light text-center">
                <p className="text-sm text-brand-main1">로그인하면 검색 기록이 저장됩니다.</p>
            </div>
        );
    } else {
        content = <p>검색 결과가 없습니다</p>;
    }
    return (
        <FullScreenModal>
            <FlexBox align="center" justify="between" asChild gap="sm">
                <header className="w-full px-5 py-2.5 border-b-2 border-gray-200">
                    <button onClick={onClose} type="button" className="cursor-pointer">
                        <LeftArrowIcon className="h-5" />
                    </button>
                    <input
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="지역명, 가게명 검색"
                        className="border-2 border-transparent focus-within:border-[#ffc2d6] transition-colors outline-none placeholder:text-gray-500 leading-normal text-base flex-1 min-w-0 pl-4 py-2 rounded-full bg-gray-200"
                    />
                    <button
                        disabled={searchText.trim().length <= 0}
                        type="button"
                        onClick={() => refetch()}
                        className="cursor-pointer disabled:text-gray-500 text-brand-main1 text-base font-semibold shrink-0 whitespace-nowrap min-w-9"
                    >
                        검색
                    </button>
                </header>
            </FlexBox>
            <main className="w-full flex-1 flex flex-col">{content}</main>
        </FullScreenModal>
    );
}
