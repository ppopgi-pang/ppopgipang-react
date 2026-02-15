import type { ReactNode } from 'react';
import { FlexBox } from '../layout/flexbox';
import { ZINDEX } from '@/constants/z-index';

export default function MapHeader({ children }: { children: ReactNode }) {
    return (
        <FlexBox direction="column" gap="lg" className="w-full relative" style={{ zIndex: ZINDEX.mapHeader }}>
            <FlexBox direction="row" justify="center" align="center" gap="xs" className="h-11 w-full">
                {children}
            </FlexBox>
        </FlexBox>
    );
}
