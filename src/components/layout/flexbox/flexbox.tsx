import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { flexBoxVariants } from './flexbox-variants';
import { cn } from '@/libs/common/cn';
import type { VariantProps } from 'class-variance-authority';

// FlexBox variant 타입
type FlexBoxVariants = VariantProps<typeof flexBoxVariants>;

// 기본 FlexBox Props
interface BaseFlexBoxProps extends FlexBoxVariants {
    className?: string;
    asChild?: boolean;
}

// 제네릭 타입 정의
type FlexBoxProps<T extends ElementType = 'div'> = BaseFlexBoxProps &
    Omit<ComponentPropsWithoutRef<T>, keyof BaseFlexBoxProps> & {
        as?: T;
    };

// PolymorphicRef 타입
type PolymorphicRef<T extends ElementType> = ComponentPropsWithoutRef<T>['ref'];

// Polymorphic Component 타입 (displayName 포함)
type PolymorphicFlexBox = <T extends ElementType = 'div'>(
    props: FlexBoxProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;

/**
 * 유연한 Flexbox 레이아웃 컴포넌트
 * @example
 * <FlexBox direction="column" gap="4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </FlexBox>
 *
 * @example
 * <FlexBox as="section" justify="center">
 *   Content
 * </FlexBox>
 */
const FlexBoxComponent = forwardRef(
    <T extends ElementType = 'div'>(
        {
            className,
            asChild = false,
            as,
            direction,
            justify,
            align,
            gap,
            wrap,
            fullWidth,
            fullHeight,
            ...props
        }: FlexBoxProps<T>,
        ref: PolymorphicRef<T>
    ) => {
        // asChild가 true면 Slot 사용, 아니면 as prop 또는 기본 'div' 사용
        const Component = asChild ? Slot : as || 'div';

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
) as PolymorphicFlexBox & { displayName?: string };

FlexBoxComponent.displayName = 'FlexBox';

export const FlexBox = FlexBoxComponent;

// 타입 export
export type { FlexBoxProps };
