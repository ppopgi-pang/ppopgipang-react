import { FilterIcon } from '@/assets/icons';
import { cn } from '@/libs/common/cn';
import type { ComponentPropsWithRef } from 'react';

interface FilterButtonProps extends ComponentPropsWithRef<'button'> {
    isActive?: boolean;
}

export default function StoreFilteringButton({ isActive = false, className, ...props }: FilterButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'h-full aspect-square flex items-center justify-center',
                'rounded-full bg-white border-gray-200 backdrop-blur-[33px]',
                'cursor-pointer transition-all duration-200',
                'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)]',
                'hover:text-divider-primary active:text-divider-primary active:scale-90 transition-all duration-200',
                isActive && 'text-divider-primary',
                className
            )}
            {...props}
        >
            <FilterIcon className="size-6" />
        </button>
    );
}
