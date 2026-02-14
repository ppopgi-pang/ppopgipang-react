const BASE = 0;
const ABOVE = 1;

const MAP = BASE + ABOVE;
const HEADER = MAP + 1; // 1 - 헤더
const MAP_OVERLAY = HEADER + ABOVE; // 2 - 지도 위 오버레이 (맵 컨트롤 포함)
const MAP_BUTTON = MAP_OVERLAY + ABOVE; // 3 - 지도 위 버튼
const BOTTOM_SHEET = MAP_BUTTON + ABOVE; // 4 - 바텀 시트
const BOTTOM_NAVIGATION_BAR = BOTTOM_SHEET + ABOVE; // 5 - 바텀 nav
const FLOATING_BUTTON = BOTTOM_NAVIGATION_BAR + ABOVE; // 6 - 전역 플로팅 버튼
const DROPDOWN_LIST = FLOATING_BUTTON + ABOVE; // 7 - 드롭다운 리스트
const MODAL_DIMMED_LAYER = DROPDOWN_LIST + ABOVE; // 8 - 일반 모달 backdrop
const MODAL_CONTAINER = MODAL_DIMMED_LAYER + ABOVE; // 9 - 일반 모달 본체
const FULLSCREEN_MODAL = MODAL_CONTAINER + ABOVE; // 10 - 풀스크린 모달
const TOAST = FULLSCREEN_MODAL + ABOVE; // 11 - 토스트 알림 (최상위)

export const ZINDEX = {
    map: MAP,
    header: HEADER,
    mapOverlay: MAP_OVERLAY,
    mapButton: MAP_BUTTON,
    bottomSheet: BOTTOM_SHEET,
    bottomNavigationBar: BOTTOM_NAVIGATION_BAR,
    floatingButton: FLOATING_BUTTON,
    dropdownList: DROPDOWN_LIST,
    modalDimmedLayer: MODAL_DIMMED_LAYER,
    modalContainer: MODAL_CONTAINER,
    fullscreenModal: FULLSCREEN_MODAL,
    toast: TOAST,
} as const;

type ZIndexKeys =
    | 'header'
    | 'mapOverlay'
    | 'bottomNavigationBar'
    | 'floatingButton'
    | 'dropdownList'
    | 'modalDimmedLayer'
    | 'modalContainer'
    | 'fullscreenModal'
    | 'toast';

export type ZIndexTokens = Record<ZIndexKeys, number>;
