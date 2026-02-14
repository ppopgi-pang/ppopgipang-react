import React from 'react';

export default function LocationErrorComponent({ error }: { error: string }) {
    return (
        <div className="flex w-full h-full items-center justify-center">
            <div className="text-center">
                <p className="mb-4 text-status-error font-semibold text-base wrap-break-word">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="cursor-pointer rounded-lg bg-brand-main1 px-4 py-2 text-white"
                >
                    다시 시도
                </button>
            </div>
        </div>
    );
}
