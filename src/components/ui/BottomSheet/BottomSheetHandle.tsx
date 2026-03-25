interface Props {
    dragHandleProps: {
        onMouseDown: (e: React.MouseEvent) => void;
        onTouchStart: (e: React.TouchEvent) => void;
    };
}

export function BottomSheetHandle({ dragHandleProps }: Props) {
    return (
        <div>
            <div
                {...dragHandleProps}
                className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
                aria-label="드래그해서 크기 조절"
                role="separator"
            >
                <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}
