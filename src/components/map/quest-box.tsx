import { FlexBox } from '../layout/flexbox';

export default function QuestBox() {
    return (
        <FlexBox
            direction="column"
            align="center"
            className="w-full bg-white rounded-[20px] py-2 px-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)]"
        >
            <p className="text-xs font-medium">
                <span className="text-brand-main1 leading-normal">'환영해요'</span> 달성까지 앞으로{' '}
                <span className="text-brand-main1">3일</span>!
            </p>
            <FlexBox gap="md" align="center" className="w-full">
                <span className="text-xs">
                    <span className="text-brand-main1">4</span> / 7
                </span>
                <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div className="w-[56%] bg-brand-main3 rounded-full h-2" />
                </div>
            </FlexBox>
        </FlexBox>
    );
}
