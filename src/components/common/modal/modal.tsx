import { ZINDEX } from '@/constants/z-index';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    zIndex?: number;
}

const Modal = ({ isOpen, onClose, title, children, zIndex }: ModalProps) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 app-shell bg-black/30 flex items-center justify-center"
            style={{ zIndex: zIndex || ZINDEX.modalDimmedLayer }}
            onClick={onClose}
        >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal_header">
                    <h2 className="modal_header-title">{title}</h2>
                    <button className="close" onClick={onClose} />
                </header>
                <main className="w-full modal_content">{children}</main>
                <footer className="modal_footer">
                    <button className="modal-close" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="submit">Submit</button>
                </footer>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
