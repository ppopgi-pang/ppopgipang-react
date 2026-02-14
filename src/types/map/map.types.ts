export interface Coordinates {
    lat: number;
    lng: number;
}

export interface MarkerSize {
    width: number;
    height: number;
}

export interface MarkerImageConfig {
    src: string;
    size: MarkerSize;
}

export interface MarkerProps {
    position: Coordinates;
    size?: { width: number; height: number };
    onClick?: () => void;
}

export type MapCenterChangeHandler = (center: Coordinates) => void;
export type MapBoundsChangeHandler = (map: kakao.maps.Map) => void;
export type MapLoadHandler = (map: kakao.maps.Map) => void;
