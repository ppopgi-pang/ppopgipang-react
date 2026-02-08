import { cn } from '@/libs/common/cn';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function SearchInput({ icon, className, ...props }: SearchInputProps) {
    return (
        <div className="relative h-full flex-1">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</div>
            )}
            <input
                {...props}
                className={cn(
                    'h-full w-full outline-none bg-white pl-10 pr-3 py-2 rounded-full placeholder:text-gray-500 text-base',
                    className
                )}
            />
        </div>
    );
}
