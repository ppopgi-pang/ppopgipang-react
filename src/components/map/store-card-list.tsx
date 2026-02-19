import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useEffect, useRef, useState } from 'react';
import StoreItemCard from './cards/store-item-card';
import type { StoreInBounds } from '@/types/store/store.types';

interface StoreCardListProps {
    filter?: 'all' | 'favorite' | 'popular' | 'verified';
    storeItems: StoreInBounds[];
    selectedStoreId: number | null;
    onSelectStore: (store: StoreInBounds) => void;
    onCardClick?: (store: StoreInBounds) => void;
}

export default function StoreCardList({
    storeItems,
    selectedStoreId,
    onSelectStore,
    onCardClick,
    filter = 'all',
}: StoreCardListProps) {
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

    // ✅ 최초 마운트 시 selectedStoreId를 state로 저장
    const [initialSelectedId] = useState(selectedStoreId);

    // ✅ 프로그래매틱 슬라이드 중인지 플래그 (무한 루프 방지)
    const isProgrammaticSlideRef = useRef(false);

    /**
     * ✅ filteredStores 계산 (렌더링 중 계산, ref 사용 안함)
     */
    const filteredStores = storeItems ? [...storeItems] : [];

    // 1. 필터링 로직
    // switch (filter) {
    //     case 'favorite':
    //         filteredStores = filteredStores.filter((store) => store.isFavorite);
    //         break;
    //     case 'popular':
    //         filteredStores = filteredStores.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    //         break;
    //     case 'verified':
    //         filteredStores = filteredStores.filter((store) => store.isVerified);
    //         break;
    //     // 'all'은 기본 정렬 유지
    // }

    // 2. ✅ 최초 선택된 매장을 맨 앞으로 (state 사용, ref 아님)
    if (initialSelectedId) {
        const selectedIndex = filteredStores.findIndex((store) => store.id === initialSelectedId);

        if (selectedIndex > 0) {
            // 0이면 이미 맨 앞
            const [selectedStore] = filteredStores.splice(selectedIndex, 1);
            filteredStores.unshift(selectedStore);
        }
    }

    /**
     * ✅ Swiper 슬라이드 변경 핸들러
     * - 사용자가 스와이프한 경우만 처리
     */
    const handleSlideChange = (swiper: SwiperType) => {
        // ✅ 프로그래매틱 슬라이드는 무시
        if (isProgrammaticSlideRef.current) {
            isProgrammaticSlideRef.current = false;
            return;
        }

        const activeIndex = swiper.activeIndex;
        const activeStore = filteredStores[activeIndex];

        if (activeStore && activeStore.id !== selectedStoreId) {
            onSelectStore(activeStore);
        }
    };

    /**
     * ✅ Swiper 인스턴스 생성 시
     */
    const handleSwiper = (swiper: SwiperType) => {
        setSwiperInstance(swiper);
    };

    /**
     * ✅ 초기 마운트 시 첫 번째 매장 선택 (맨 앞으로 이동된 매장)
     */
    useEffect(() => {
        if (filteredStores.length > 0 && initialSelectedId) {
            const firstStore = filteredStores[0];
            // 맨 앞에 있는 매장이 초기 선택 매장이고, 아직 선택 안됐으면 선택
            if (firstStore.id === initialSelectedId && selectedStoreId !== firstStore.id) {
                onSelectStore(firstStore);
            }
        }
    }, []); // ✅ 빈 배열: 마운트 시 한 번만 실행

    /**
     * ✅ 외부에서 selectedStoreId 변경 시 해당 슬라이드로 이동
     * - 마커 클릭 등으로 외부에서 매장이 선택된 경우
     */
    useEffect(() => {
        if (!swiperInstance || !selectedStoreId) return;

        const targetIndex = filteredStores.findIndex((store) => store.id === selectedStoreId);

        // ✅ 찾은 인덱스가 유효하고, 현재 활성 슬라이드가 아닌 경우만 이동
        if (targetIndex !== -1 && targetIndex !== swiperInstance.activeIndex) {
            isProgrammaticSlideRef.current = true; // ✅ 프로그래매틱 플래그 설정
            swiperInstance.slideTo(targetIndex);
        }
    }, [selectedStoreId, swiperInstance]);

    /**
     * ✅ filteredStores가 변경되면 Swiper 업데이트
     */
    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.update();
        }
    }, [filter, storeItems, swiperInstance]); // ✅ 필터나 매장 목록 변경 시

    return (
        <div className="w-full overflow-hidden">
            <Swiper
                direction="horizontal"
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                centeredSlidesBounds={true}
                slidesPerView="auto"
                centeredSlides
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                style={{ overflow: 'visible' }}
                className="w-full pl-4! pr-10!"
            >
                {filteredStores.map((store) => (
                    <SwiperSlide
                        key={store.id}
                        style={{ width: 'auto' }}
                        className="cursor-pointer"
                        onClick={() => {
                            const isActive = selectedStoreId === store.id;
                            if (isActive) {
                                onCardClick?.(store);
                            } else {
                                onSelectStore(store);
                            }
                        }}
                    >
                        <StoreItemCard store={store} isActive={selectedStoreId === store.id} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
