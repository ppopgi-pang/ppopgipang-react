import type { StoreInBounds } from '@/types/store/store.types';
import DefaultMarker from './markers/default-marker';

export default function StoreMarkers({ stores }: { stores: StoreInBounds[] }) {
    return stores.map((store) => <DefaultMarker position={{ lat: store.latitude, lng: store.longitude }} />);
}
