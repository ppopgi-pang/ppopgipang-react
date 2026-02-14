import type { ReactNode } from 'react';
import { FlexBox } from '../layout/flexbox';
import { ZINDEX } from '@/constants/z-index';

export default function MapHeader({ children }: { children: ReactNode }) {
    return (
        <FlexBox style={{ zIndex: ZINDEX.mapButton }} direction="column" gap="lg" className="w-full">
            <FlexBox direction="row" justify="center" align="center" gap="xs" className="h-11 w-full">
                {children}
            </FlexBox>
        </FlexBox>
    );
}
