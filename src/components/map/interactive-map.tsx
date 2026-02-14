// import type { Coordinates } from '@/types/map/map.types';
// import { Map } from 'react-kakao-maps-sdk';

// interface InteractiveMapProps {
//     center: Coordinates;
//     onCreate: (map: kakao.maps.Map) => void;

//     initialLevel?: number;
//     minLevel?: number;
//     maxLevel?: number;

//     onBoundsChanged?: (map: kakao.maps.Map) => void;
//     onZoomChanged?: (level: number) => void;
//     onClick?: (position: Coordinates) => void;
//     onDragEnd?: (center: Coordinates) => void;

//     isPanto?: boolean;

//     // === 상호작용 제어 ===
//     draggable?: boolean; // 기본: true
//     zoomable?: boolean; // 기본: true
//     scrollwheel?: boolean; // 기본: true

//     // === UI 컨트롤 ===
//     showZoomControl?: boolean;
//     showMapTypeControl?: boolean;

//     // === 스타일 ===
//     style?: React.CSSProperties;
//     className?: string;

//     // === 마커 등 ===
//     children?: React.ReactNode;
// }

// // 기본값 설정
// export function InteractiveMap({
//     center,
//     onCreate,
//     initialLevel = 3,
//     minLevel = 1,
//     maxLevel = 5,
//     isPanto = true,
//     draggable = true,
//     zoomable = true,
//     scrollwheel = true,
//     showZoomControl = true,
//     showMapTypeControl = false,
//     style = { width: '100%', height: '100%' },
//     onBoundsChanged,
//     onZoomChanged,
//     onClick,
//     onDragEnd,
//     children,
// }: InteractiveMapProps) {
//     return (
//         <Map
//             center={center}
//             level={initialLevel}
//             isPanto={isPanto}
//             draggable={draggable}
//             zoomable={zoomable}
//             scrollwheel={scrollwheel}
//             minLevel={minLevel}
//             maxLevel={maxLevel}
//             style={style}
//             onCreate={onCreate}
//             onBoundsChanged={onBoundsChanged}
//             onZoomChanged={onZoomChanged}
//             onClick={(_, mouseEvent) => {
//                 onClick?.({
//                     lat: mouseEvent.latLng.getLat(),
//                     lng: mouseEvent.latLng.getLng(),
//                 });
//             }}
//             onDragEnd={(map) => {
//                 const center = map.getCenter();
//                 onDragEnd?.({
//                     lat: center.getLat(),
//                     lng: center.getLng(),
//                 });
//             }}
//         >
//             {/* {showZoomControl && <ZoomControl position="RIGHT" />} */}
//             {/* {showMapTypeControl && <MapTypeControl position="TOPRIGHT" />} */}
//             {children}
//         </Map>
//     );
// }
