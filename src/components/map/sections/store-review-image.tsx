import { cn } from '@/libs/common/cn';
import { useState } from 'react';

interface StoreReviewImageProps {
    src: string | null;
    className?: string;
}

export default function StoreReviewImage({ src, className }: StoreReviewImageProps) {
    const [loaded, setLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    return (
        <div className={cn('relative w-[90px] h-[120px] rounded-lg overflow-hidden', className)}>
            {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            {src && !isError && (
                <img
                    src={src}
                    alt=""
                    className={cn('w-full h-full object-cover', !loaded && 'invisible')}
                    onLoad={() => setLoaded(true)}
                    onError={() => {
                        setLoaded(true);
                        setIsError(true);
                    }}
                />
            )}
            {src && isError && <div>에러!</div>}
        </div>
    );
}
