import { useRef, useCallback, useEffect, useState } from 'react';
import type { SnapPoint } from './types';
import { DEFAULT_HALF_RATIO, VELOCITY_THRESHOLD, SNAP_EASING, SNAP_DURATION_MS } from './constants';

/** `UseBottomSheetOptions`
 * - 훅의 사용처에서 전달하는 옵션
 */
interface UseBottomSheetOptions {
    /** `isOpen`: 바텀시트가 열려있는지 */
    isOpen: boolean;
    /** `onClose`: 바텀시트가 닫히면 부모에게 알려주는 함수 */
    onClose: () => void;
    /** `halfRatio`: 하프 사이즈 비율 */
    halfRatio?: number;
}

/** `UseBottomSheetReturn`
 * - 훅이 반환하는 값
 */
interface UseBottomSheetReturn {
    /** `sheetRef`: 바텀시트 DOM에 붙일 ref */
    sheetRef: React.RefObject<HTMLDivElement | null>;
    /** `currentSnap`: 지금 스냅의 위치
     * - `half`, `full`, `closed`
     */
    currentSnap: SnapPoint;
    /** `snapTo`: 원하는 위치로 바텀시트를 이동시키는 함수 */
    snapTo: (snap: SnapPoint, animate?: boolean) => void;
    /** `dragHandleProps`: 핸들에 spread할 이벤트 객체 */
    dragHandleProps: {
        /** `onMousedown`: PC에서 마우스 버튼을 클릭하는 순간 발생*/
        onMouseDown: (e: React.MouseEvent) => void;
        /** `onTouchStart`: 모바일에서 손가락으로 핸들을 터치하는 순간 발생 */
        onTouchStart: (e: React.TouchEvent) => void;
    };
}

export function useBottomSheet({
    isOpen,
    onClose,
    halfRatio = DEFAULT_HALF_RATIO,
}: UseBottomSheetOptions): UseBottomSheetReturn {
    const sheetRef = useRef<HTMLDivElement>(null);
    const [currentSnap, setCurrentSnap] = useState<SnapPoint>('half');

    // ref로 관리하는 이유:
    // 드래그 중 매 mousemove마다 setState하면 리렌더링 폭풍이 발생합니다.
    // transform은 직접 DOM 조작으로 처리하고, 최종 스냅 상태만 state로 관리합니다.
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startTransY = useRef(0);
    const currentTransY = useRef(0);
    const lastY = useRef(0);
    const lastTime = useRef(0);
    const velocity = useRef(0);

    /**
     * `getContainerH`
     * -  전체 컨테이너 높이를 측정 시점마다 최신값으로 가져오는 함수
     */
    const getContainerH = useCallback(() => {
        return sheetRef.current?.parentElement?.offsetHeight ?? 0;
    }, []);

    /** `getHalfH`
     * - 하프 상태일 때 시트가 얼마나 올라와 보여야 하는지 계산하는 함수
     */
    const getHalfH = useCallback(() => {
        return Math.round(getContainerH() * halfRatio);
    }, [getContainerH, halfRatio]);

    /**
     * `yForSnap`
     * - 현재 스냅 위치에서 `translateY`값이 얼마여야 하는지 계산
     * - `translateY`: 요소를 y축으로 얼마나 밀어낼지를 나타냄. 값이 클수록 'closed'에 가까워짐
     */
    const yForSnap = useCallback(
        (snap: SnapPoint): number => {
            const containerH = getContainerH();
            if (snap === 'closed') return containerH;
            if (snap === 'half') return containerH - getHalfH();
            return 0;
        },
        [getContainerH, getHalfH],
    );

    /**
     * `setTranslateY` : 바텀시트를 위치를 변경하는 함수
     * - DOM을 직접 조작합니다.
     * — 드래그 중 리렌더링 없이 60fps 유지
     */
    //
    const setTranslateY = useCallback(
        (y: number, animate: boolean) => {
            const el = sheetRef.current; //바텀시트 DOM 요소를 갖고오기
            if (!el) return;

            el.style.transition = animate ? `transform ${SNAP_DURATION_MS}ms ${SNAP_EASING}` : 'none'; //바텀시트의 위치 변경 애니메이션
            el.style.transform = `translateY(${y}px)`; //바텀시트의 위치 변경

            const backdrop = el.parentElement?.querySelector<HTMLElement>('[data-backdrop]');
            if (backdrop) {
                const containerH = getContainerH();
                const pct = 1 - y / containerH;
                backdrop.style.transition = animate ? `opacity ${SNAP_DURATION_MS}ms ${SNAP_EASING}` : 'none';
                backdrop.style.opacity = String(Math.min(1, Math.max(0, pct * 1.3)));
            }
        },
        [getContainerH],
    );

    /**
     *  `snapTo`
     * - 바텀시트를 특정 스냅의 위치로 이동하도록 모든 함수를 호출하는 함수
     */
    const snapTo = useCallback(
        (snap: SnapPoint, animate = true) => {
            const y = yForSnap(snap); // snap으로 이동하기 위한 y값 계산
            currentTransY.current = y; //시트의 현재 위치가 y임을 JS가 알 수 있도록 내부적으로 저장
            setTranslateY(y, animate); // 실제 바텀시트의 위치를 이동
            setCurrentSnap(snap); //변경된 스냅을 저장

            if (snap === 'closed') {
                setTimeout(onClose, SNAP_DURATION_MS); //닫히는 액션의 경우, 애니메이션 이후에 사용자가 전달 onClose 호출
            }
        },
        [yForSnap, setTranslateY, onClose],
    );

    // isOpen 변화 감지 → 열기 애니메이션
    useEffect(() => {
        if (!isOpen) return;

        const el = sheetRef.current;
        if (!el) return;

        const containerH = getContainerH();

        // 시트를 맨 아래로 즉시 이동 - 사용자 눈에는 시트가 안보이는 상태
        el.style.transition = 'none';
        el.style.transform = `translateY(${containerH}px)`;
        currentTransY.current = containerH;

        // requestAnimationFrame을 통해 closed에서 half로 변경되는게 잘 보이도록 한다.
        // 다음 프레임에서 올라오는 애니메이션을 렌더링함
        requestAnimationFrame(() => {
            setCurrentSnap('half');
            snapTo('half', true);
        });
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
    // snapTo는 의도적으로 deps 제외한다. — isOpen 변화 시에만 실행해야 하므로

    /** `onDragStart` : 드래그를 시작할 때 호출되는 함수
     *
     */
    const onDragStart = useCallback(
        /**
         *
         * @param clientY - 드래그를 시작한 순간의 y좌표(커서 또는 손가락). 매 프레임마다 브라우저가 자동으로 넘겨준다.
         * @returns
         */
        (clientY: number) => {
            // 전체화면에서는 드래그 비활성화 - back button을 눌러서 닫음
            if (currentSnap === 'full') return;

            isDragging.current = true; // 드래그 중
            startY.current = clientY; // 핸들 터치 시작점 (손가락 y 좌표)
            startTransY.current = currentTransY.current; // 현재 바텀시트 상단의 위치
            lastY.current = clientY; // onDragMove에서 사용하는 직전 프레임의 핸들 터치 시작점 (손가락 y 좌표)
            lastTime.current = Date.now(); // onDragMove에서 사용하는 직전 프레임의 시간
            velocity.current = 0; // 드래그 속도를 초기화

            const el = sheetRef.current;
            if (el) el.style.transition = 'none'; // 드래그 시작 시 애니메이션 제거
        },
        [currentSnap],
    );

    /** `onDragMove` : 드래그 중에 호출되는 함수
     *
     */
    const onDragMove = useCallback(
        /**
         *
         * @param clientY - 현재의 y좌표(커서 또는 손가락). 매 프레임마다 브라우저가 자동으로 넘겨준다.
         * @returns
         */
        (clientY: number) => {
            if (!isDragging.current) return; // 현재 드래그 중이 아니라면 리턴

            const now = Date.now();
            const dt = now - lastTime.current; // 시간 변화량 계산
            if (dt > 0) {
                velocity.current = (clientY - lastY.current) / dt; // 속도 = 거리 / 시간
            }
            lastY.current = clientY; // lastY를 현재 y좌표로 업데이트
            lastTime.current = now; // lastTime을 현재 y좌표로 업데이트

            /** 시트 위치를 계산하고 이동시키는 로직 */
            const raw = startTransY.current + (clientY - startY.current); // 실제 변화량: 손가락의 좌표 변화량을 startTransY에 더한다
            const clamped = Math.max(0, Math.min(getContainerH(), raw)); // 최대 변화량은 컨테이너의 높이
            currentTransY.current = clamped; // 현재 프레임에서 y가 이동해야 할 y는 clamped
            setTranslateY(clamped, false); // 바텀 시트의 위치 변경
        },
        [getContainerH, setTranslateY],
    );

    /**
     * `onDragEnd`: 드래그가 끝났을 때 호출되는 함수
     * - 어디로 스냅할지를 결정합니다.
     */
    const onDragEnd = useCallback(() => {
        if (!isDragging.current) return; // 현재 드래그 중이 아니라면 리턴
        isDragging.current = false; // 드래그가 끝났음을 저장

        const containerH = getContainerH();
        const halfY = yForSnap('half');
        const v = velocity.current; // 속도
        const y = currentTransY.current; // 현재 프레임에서의 y 변화량

        // 빠른 스와이프: 속도만으로 방향 결정
        if (v > VELOCITY_THRESHOLD) {
            // 속도가 (아래방향으로) 빠른 경우
            snapTo('closed'); // 닫기
            return;
        }
        if (v < -VELOCITY_THRESHOLD) {
            // 속도가 (위방향으로) 빠른 경우
            snapTo('full'); // 전체 화면
            return;
        }

        // 느린 드래그: 위치 기반으로 가장 가까운 스냅으로
        const midToFull = halfY * 0.45; // 올릴 때는 조금 더 민감하게
        const midToClose = halfY + (containerH - halfY) * 0.4; // 내릴 때는 둔감하게

        if (y < midToFull) snapTo('full');
        else if (y > midToClose) snapTo('closed');
        else snapTo('half');
    }, [getContainerH, yForSnap, snapTo]);

    // 전역 mousemove / mouseup 등록
    // 핸들 밖으로 마우스가 나가도 드래그가 끊기지 않게
    useEffect(() => {
        /**
         * `onMouseMove` : PC에서 마우스가 움직일 때마다 호출되는 이벤트 핸들러 함수
         * - `onTouchMove`와 동일한 역할을 합니다.
         * @param e - `MouseEvent`
         * @returns
         */
        const onMouseMove = (e: MouseEvent) => onDragMove(e.clientY);
        /**
         * `onMouseUp` : PC에서 마우스 버튼을 뗄 때 호출되는 이벤트 핸들러 함수
         * @param e - `MouseEvent`
         * @returns
         */
        const onMouseUp = () => {
            if (isDragging.current) onDragEnd(); //핸들에서 손을 뗀 게 맞는지 확인한다.
        };
        /**
         * `onMouseMove` : 모바일에서 손가락이 움직일 때마다 호출되는 이벤트 핸들러 함수
         * @param e - `TouchEvent`
         * @returns
         */
        const onTouchMove = (e: TouchEvent) => onDragMove(e.touches[0].clientY);
        /**
         * `onTouchEnd` : 모바일에서 손가락을 뗄 때 호출되는 이벤트 핸들러 함수
         * - `onMouseMove`와 동일한 역할을 합니다.
         * @param e - `TouchEvent`
         * @returns
         */
        const onTouchEnd = () => {
            if (isDragging.current) onDragEnd();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [onDragMove, onDragEnd]);

    /**
     * `dragHandleProps`: 바텀 핸들 div에 붙일 이벤트를 묶어둔 객체
     */
    const dragHandleProps = {
        onMouseDown: (e: React.MouseEvent) => {
            e.preventDefault(); // 텍스트 드래그 셀렉션 방지
            onDragStart(e.clientY);
        },
        onTouchStart: (e: React.TouchEvent) => {
            onDragStart(e.touches[0].clientY); // 첫 번째 손가락의 y좌표
        },
    };

    return { sheetRef, currentSnap, snapTo, dragHandleProps };
}
