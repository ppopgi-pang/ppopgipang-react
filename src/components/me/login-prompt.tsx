import { useNavigate } from '@tanstack/react-router';
import { FlexBox } from '../layout/flexbox';
import { Button } from '../ui/button';

export function LoginPrompt() {
    const navigate = useNavigate();
    return (
        <FlexBox direction="column" as="main" className="px-5 py-4 w-full flex-1">
            <FlexBox
                direction={'column'}
                align={'center'}
                className="w-full rounded-4xl border border-brand-main1 p-4 py-8 gap-6 bg-brand-main1-light"
            >
                <div>
                    <h2 className="title-2 text-brand-main1 text-center">로그인 후 이용가능한 서비스</h2>
                    <p className="body-2 text-center text-[#6D7582]">서비스 로그인을 진행해주세요!</p>
                </div>
                <Button
                    onClick={() => {
                        navigate({ to: '/login' });
                    }}
                    className="w-full"
                >
                    로그인하러 가기
                </Button>
            </FlexBox>
        </FlexBox>
    );
}
