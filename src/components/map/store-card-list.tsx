import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useEffect, useMemo, useRef, useState } from 'react';
import StoreItemCard from './cards/store-item-card';
import type { StoreInBounds } from '@/types/store/store.types';
import { useMapStore, useSelectedStoreId } from '@/stores/use-map-store';

interface StoreCardListProps {
    filter?: 'all' | 'favorite' | 'popular' | 'verified';
    storeItems: StoreInBounds[];
    onCardClick?: (store: StoreInBounds) => void;
}

interface StoreSwiperProps {
    storeItems: StoreInBounds[];
    initialSelectedId: number;
    filter: StoreCardListProps['filter'];
    onCardClick?: (store: StoreInBounds) => void;
}

/**
 * 부모의 {selectedStoreId && <StoreSwiper>} 조건 덕분에
 * 이 컴포넌트가 마운트될 때 initialSelectedId는 항상 non-null이 보장됨.
 *
 * initialSelectedId를 useRef로 고정해 storeItems가 변경되더라도
 * 항상 최초 선택 매장이 맨 앞에 유지됨.
 */
function StoreSwiper({ storeItems, initialSelectedId, filter, onCardClick }: StoreSwiperProps) {
    const selectedStoreId = useSelectedStoreId();
    const selectStore = useMapStore((s) => s.selectStore);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const isProgrammaticSlideRef = useRef(false);

    // 마운트 시점의 ID를 고정 — setter를 쓰지 않으므로 절대 변하지 않는 값
    // useRef 대신 useState를 쓰는 이유: useMemo deps에 넣을 수 있어 lint 안전
    const [frozenInitialId] = useState(initialSelectedId);

    const sortedStores = useMemo(() => {
        const arr = [...storeItems];
        const idx = arr.findIndex((s) => s.id === frozenInitialId);
        if (idx > 0) arr.unshift(...arr.splice(idx, 1));
        return arr;
    }, [storeItems, frozenInitialId]); // frozenInitialId는 불변 → storeItems 변경 시만 재계산

    const handleSlideChange = (swiper: SwiperType) => {
        if (isProgrammaticSlideRef.current) {
            isProgrammaticSlideRef.current = false;
            return;
        }
        const activeStore = sortedStores[swiper.activeIndex];
        if (activeStore && activeStore.id !== selectedStoreId) {
            selectStore(activeStore);
        }
    };

    // 외부(마커 클릭 등)에서 selectedStoreId 변경 시 해당 슬라이드로 이동
    useEffect(() => {
        if (!swiperInstance || !selectedStoreId) return;
        const targetIndex = sortedStores.findIndex((s) => s.id === selectedStoreId);
        if (targetIndex !== -1 && targetIndex !== swiperInstance.activeIndex) {
            isProgrammaticSlideRef.current = true;
            swiperInstance.slideTo(targetIndex);
        }
    }, [selectedStoreId, swiperInstance]); // eslint-disable-line react-hooks/exhaustive-deps

    // storeItems / filter 변경 시 Swiper 내부 레이아웃 갱신
    useEffect(() => {
        swiperInstance?.update();
    }, [filter, storeItems, swiperInstance]);

    return (
        <Swiper
            direction="horizontal"
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            centeredSlidesBounds={true}
            slidesPerView="auto"
            centeredSlides
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            style={{ overflow: 'visible' }}
            className="w-full pl-4! pr-10!"
        >
            {sortedStores.map((store) => (
                <SwiperSlide
                    key={store.id}
                    style={{ width: 'auto' }}
                    className="cursor-pointer"
                    onClick={() => {
                        if (selectedStoreId === store.id) {
                            onCardClick?.(store);
                        } else {
                            selectStore(store);
                        }
                    }}
                >
                    <StoreItemCard store={store} isActive={selectedStoreId === store.id} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default function StoreCardList({ storeItems, onCardClick, filter = 'all' }: StoreCardListProps) {
    const selectedStoreId = useSelectedStoreId();

    return (
        <div className="w-full overflow-hidden">
            {selectedStoreId && (
                <StoreSwiper
                    storeItems={storeItems}
                    initialSelectedId={selectedStoreId}
                    filter={filter}
                    onCardClick={onCardClick}
                />
            )}
        </div>
    );
}
