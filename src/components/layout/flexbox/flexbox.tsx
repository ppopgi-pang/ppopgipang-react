import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { FlexBoxProps } from './flexbox.type';
import { flexBoxVariants } from './flexbox-variants';
import { cn } from '@/libs/common/cn';

export const FlexBox = forwardRef<HTMLDivElement, FlexBoxProps>(
    ({ className, asChild = false, direction, justify, align, gap, wrap, fullWidth, fullHeight, ...props }, ref) => {
        const Component = asChild ? Slot : 'div';

        return (
            <Component
                ref={ref}
                className={cn(
                    flexBoxVariants({
                        direction,
                        justify,
                        align,
                        gap,
                        wrap,
                        fullWidth,
                        fullHeight,
                    }),
                    className
                )}
                {...props}
            />
        );
    }
);

FlexBox.displayName = 'FlexBox';
