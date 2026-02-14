import type { StoreInBounds } from '@/types/store/store.types';
import DefaultMarker from './markers/default-marker';
import ActiveMarker from './markers/active-marker';
import type { Coordinates } from '@/types/map/map.types';

interface StoreMarkersProps {
    stores: StoreInBounds[];
    selectedStoreId: number | null;
    onSelectStore: (store: StoreInBounds) => void;
}

export default function StoreMarkers({ stores, selectedStoreId, onSelectStore }: StoreMarkersProps) {
    return (
        <>
            {stores.map((store) => {
                const position: Coordinates = {
                    lat: store.latitude,
                    lng: store.longitude,
                };
                const isSelected = selectedStoreId === store.id;
                const handleSelectStore = () => {
                    onSelectStore(store);
                };

                return isSelected ? (
                    <ActiveMarker key={store.id} onClick={handleSelectStore} position={position} />
                ) : (
                    <DefaultMarker key={store.id} position={position} onClick={handleSelectStore} />
                );
            })}
        </>
    );
}
