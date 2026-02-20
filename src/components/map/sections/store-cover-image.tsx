import { useState } from 'react';
import { cn } from '@/libs/common/cn';

interface StoreCoverImageProps {
    src: string | null;
    className?: string;
}

export default function StoreCoverImage({ src, className }: StoreCoverImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn('relative w-full h-[221px]', className)}>
            {/* src가 없거나(useStoreImages 로딩 중) 이미지가 아직 브라우저에 렌더링되지 않은 경우 skeleton 표시 */}
            {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            {src && (
                <img
                    src={src}
                    alt=""
                    className={cn('w-full h-full object-cover', !loaded && 'invisible')}
                    onLoad={() => setLoaded(true)}
                    onError={() => setLoaded(true)}
                />
            )}
        </div>
    );
}
