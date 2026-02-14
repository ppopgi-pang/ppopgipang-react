import { SearchIcon } from '@/assets/icons';
import { SearchInput } from '../common/search-input/search-input';
import type { ComponentProps } from 'react';
import { cn } from '@/libs/common/cn';

interface SearchBarButtonProps extends ComponentProps<'div'> {
    onClick: () => void;
    searchedPlace: string | undefined;
}

export default function SearchBarButton({ onClick, searchedPlace, className, ...props }: SearchBarButtonProps) {
    return (
        <div className={cn('flex-1 cursor-pointer', className)} onClick={onClick} {...props}>
            <SearchInput
                value={searchedPlace || ''}
                placeholder={searchedPlace ? undefined : '지역명, 가게명 검색'}
                readOnly
                className="cursor-pointer pointer-events-none py-3"
                icon={<SearchIcon className="size-6 text-gray-500" />}
            />
        </div>
    );
}
