import { useEffect, useRef, useState, useCallback } from 'react';
import FullScreenModal from '../common/modal/full-screen-modal';
import { FlexBox } from '../layout/flexbox';
import { ClockIcon, CloseIcon, LeftArrowIcon, StarIcon } from '@/assets/icons';
import { storeService } from '@/services/store/store.service';
import { useQuery } from '@tanstack/react-query';
import useGeolocation from '@/hooks/map/use-user-location';
import CircularLoadingSpinner from '../common/spinner/circular-loading-spinner';
import { Link } from '@tanstack/react-router';
import type { StoreSearch } from '@/types/store/store.types';
import type { SearchStoresResponse } from '@/types/store/store.api.types';
import { cn } from '@/libs/common/cn';

type SortType = 'distance' | 'rating';

interface SearchModalProps {
    prevText?: string;
    onClose: () => void;
}

export default function SearchModal({ prevText, onClose }: SearchModalProps) {
    const [inputText, setInputText] = useState<string>(prevText || '');
    const [submittedText, setSubmittedText] = useState<string>(prevText || '');
    const [sortType, setSortType] = useState<SortType>('distance'); // 정렬 타입
    const inputRef = useRef<HTMLInputElement>(null); // 포커싱을 위한 ref

    const isLoggedIn = false; // TODO: 실제 로그인 여부로 바꿔야 함

    // 초기 렌더링 시에 포커싱
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // 사용자 위치
    const { coordinates: userLocation } = useGeolocation({
        watch: false,
        enableHighAccuracy: false,
        maximumAge: 300000,
    });

    // search 관련 훅
    const {
        data: searchResult,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['search-result', submittedText, userLocation?.lat, userLocation?.lng],
        queryFn: async () => {
            return await storeService.searchStores({
                keyword: submittedText,
                latitude: userLocation?.lat,
                longitude: userLocation?.lng,
                page: 1,
                size: 20,
            });
        },
        enabled: false,
        staleTime: 1000 * 60 * 3, // 3분
    });

    // 검색 버튼 클릭 시 사용하는 핸들러
    const handleSearch = useCallback(() => {
        if (inputText.trim().length === 0) return;
        setSubmittedText(inputText.trim());
    }, [inputText]);

    // 검색 버튼이 눌린 경우 refetch
    useEffect(() => {
        if (submittedText.length > 0) {
            refetch();
        }
    }, [submittedText, refetch]);

    // 필터 버튼에 따른  필터링
    const sortedResults = searchResult?.data
        ? [...searchResult.data].sort((a, b) =>
              sortType === 'distance' ? a.distance - b.distance : b.average_rating - a.average_rating,
          )
        : [];

    return (
        <FullScreenModal>
            <form
                role="search"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >
                <FlexBox align="center" justify="between" asChild gap="sm">
                    <header className="w-full px-5 py-2.5 border-b-2 border-gray-200">
                        <button onClick={onClose} type="button" className="cursor-pointer">
                            <LeftArrowIcon className="h-5" />
                        </button>
                        <input
                            ref={inputRef}
                            type="search"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="지역명, 가게명 검색"
                            className="border-2 border-transparent focus-within:border-[#ffc2d6] transition-colors outline-none placeholder:text-gray-500 leading-normal text-base flex-1 min-w-0 pl-4 py-2 rounded-full bg-gray-200"
                        />
                        <button
                            type="submit"
                            disabled={inputText.trim().length === 0}
                            className="cursor-pointer disabled:text-gray-500 text-brand-main1 text-base font-semibold shrink-0 whitespace-nowrap min-w-9"
                        >
                            검색
                        </button>
                    </header>
                </FlexBox>
            </form>

            <main className="w-full flex-1 flex flex-col">
                <SearchContent
                    isLoading={isLoading}
                    searchResult={searchResult}
                    sortedResults={sortedResults}
                    sortType={sortType}
                    onSortChange={setSortType}
                    isLoggedIn={isLoggedIn}
                    hasSubmitted={submittedText.length > 0}
                />
            </main>
        </FullScreenModal>
    );
}
interface SearchContentProps {
    isLoading: boolean;
    searchResult: SearchStoresResponse | undefined;
    sortedResults: StoreSearch[];
    sortType: SortType;
    onSortChange: (sort: SortType) => void;
    isLoggedIn: boolean;
    hasSubmitted: boolean;
}

function SearchContent({
    isLoading,
    searchResult,
    sortedResults,
    sortType,
    onSortChange,
    isLoggedIn,
    // hasSubmitted,
}: SearchContentProps) {
    if (isLoading) {
        return (
            <div className="flex py-14 items-center justify-center">
                <CircularLoadingSpinner />
            </div>
        );
    }

    if (searchResult) {
        if (sortedResults.length > 0) {
            return (
                <FlexBox direction="column" className="w-full h-full">
                    <FlexBox align="center" justify="end" gap="lg" className="w-full py-5 px-5">
                        <SortButton
                            label="거리 순"
                            active={sortType === 'distance'}
                            onClick={() => onSortChange('distance')}
                        />
                        <SortButton
                            label="별점 순"
                            active={sortType === 'rating'}
                            onClick={() => onSortChange('rating')}
                        />
                    </FlexBox>
                    <FlexBox direction="column" className="flex-1 w-full" asChild>
                        <ol>
                            {sortedResults.map((data) => (
                                <li
                                    key={data.id}
                                    className="transition-all duration-100 cursor-pointer w-full flex items-center pl-5 pr-9 py-4 hover:bg-gray-100 gap-4"
                                >
                                    <img src={data.thumbnail_name} alt={data.name} className="size-11 rounded-full" />
                                    <FlexBox direction="column" gap="sm" className="flex-1">
                                        <h3 className="leading-none font-semibold text-base">{data.name}</h3>
                                        <p className="flex items-center gap-2.5 text-xs font-medium leading-none">
                                            {data.address}
                                            <span className="text-gray-400 text-xs font-normal">
                                                {data.distance < 1000
                                                    ? `${data.distance}m`
                                                    : `${(data.distance / 1000).toFixed(1)}km`}
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
        }

        return (
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

    // 검색 전 초기 상태
    if (!isLoggedIn) {
        return (
            <>
                <div className="w-full p-6 bg-brand-main1-light text-center">
                    <p className="text-sm text-brand-main1">로그인하면 검색 기록이 저장됩니다.</p>
                </div>
                {/* 비로그인도 최근 검색어 UI는 보여줄 수 있음 (로그인 유도) */}
            </>
        );
    }

    return (
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
}

function SortButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`cursor-pointer flex items-center gap-1 font-semibold leading-none shrink-0 ${
                active ? 'text-brand-main1' : 'text-gray-500 font-medium'
            }`}
        >
            <div
                className={cn(
                    'aspect-square flex size-[6px] rounded-full shrink-0',
                    active ? 'bg-brand-main1' : 'bg-gray-500',
                )}
            />
            {label}
        </button>
    );
}
