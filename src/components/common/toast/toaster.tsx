import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            style={
                {
                    /* 배경: brand-main1-light (#fff7f9) */
                    '--normal-bg': 'var(--color-brand-main1-light)',
                    /* 외곽선: brand-main1 (#ff85a2) */
                    '--normal-border': 'var(--color-brand-main1-dark)',
                    /* 텍스트: brand-main1 */
                    '--normal-text': 'var(--color-brand-main1)',
                    /* border-radius: full */
                    '--border-radius': '9999px',
                    '--font-family': 'var(--font-pretendard)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    /* 토스트 컨테이너: padding-3, gap-2, 그림자 brand-main1 */
                    toast: 'px-3 gap-2 shadow-[3px_3px_6px_var(--color-brand-main1)]!',
                    /* 제목: bold 16px, brand-main1 색상 */
                    title: 'font-bold! text-[16px]! text-[#FF5084]! leading-none! font-pretendard!',
                    /* 아이콘: brand-main1 색상 */
                    icon: 'text-[var(--color-brand-main1)]',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
