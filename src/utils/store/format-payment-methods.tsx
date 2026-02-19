import type { PaymentType } from '@/types/store/store.types';
import React from 'react';

const PAYMENT_NAME_MAP = {
    cash: '현금 결제',
    card: '카드 결제',
    qr: 'QR 결제',
};

export const formatPaymentMethods = (methods: PaymentType[]) => {
    if (!methods || methods.length === 0) return '-';

    return methods.map((method, index) => {
        const translatedName = PAYMENT_NAME_MAP[method] || method;

        return (
            <React.Fragment key={method}>
                {translatedName}
                {index < methods.length - 1 && <span className="text-gray-400 mx-1">/</span>}
            </React.Fragment>
        );
    });
};
