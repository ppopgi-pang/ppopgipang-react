import { ZINDEX } from '@/constants/z-index';
import { createPortal } from 'react-dom';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
    return createPortal(
        <>
            {isOpen ? (
                <div
                    className="fixed inset-0 app-shell bg-black/30 flex items-center justify-center"
                    style={{ zIndex: ZINDEX.filterModal }}
                    onClick={onClose}
                >
                    <main className="w-full h-full pt-20 pr-4">
                        {
                            <div className="transition-all duration-300 w-full h-full flex flex-col items-end justify-start gap-2">
                                <button className="active:scale-90 cursor-pointer bg-white rounded-full px-4 py-2 text-base font-medium">
                                    전체
                                </button>
                                <button className="active:scale-90 cursor-pointer bg-[#bfede2] rounded-full px-4 py-2 text-base font-medium">
                                    찜한 가게
                                </button>

                                <button className="active:scale-90 cursor-pointer bg-[#ffceda] rounded-full px-4 py-2 text-base font-medium">
                                    인기순
                                </button>
                                <button className="active:scale-90 cursor-pointer bg-[#fff0b1] rounded-full px-4 py-2 text-base font-medium">
                                    최근 인증 많은 순
                                </button>
                            </div>
                        }
                    </main>
                </div>
            ) : null}
        </>,
        document.body
    );
}
