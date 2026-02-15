import { KakaoIcon } from '@/assets/icons';
import { LogoImg } from '@/assets/images';
import { Link } from '@tanstack/react-router';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID ?? '';

const API_SERVER_URL = import.meta.env.VITE_API_URL;

const getKakaoLoginUrl = () => {
    if (!KAKAO_CLIENT_ID) {
        console.error('Missing VITE_KAKAO_CLIENT_ID');
        return '#';
    }

    const redirectUri = `${API_SERVER_URL}/auth/kakao/callback`;

    const params = new URLSearchParams({
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        through_account: 'true',
        state: 'dev',
    });

    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};

export default function LoginPage() {
    const handleKakaoLogin = () => {
        window.location.href = getKakaoLoginUrl();
    };

    return (
        <div className="flex h-full w-full items-center justify-center ">
            <div className="flex min-w-[70%] md:min-w-[300px]  md:max-h-[559px] md:w-[374px] flex-col md:justify-between">
                <header className="mb-[72px] mobile:mb-[92px] flex flex-col items-center">
                    <img src={LogoImg} className="size-28" />
                    <Link to="/" className="text-5xl text-[#f5799d] font-mbc">
                        뽑기팡
                    </Link>

                    <h1 className="sr-only">뽑기팡</h1>
                    <p className="text-center font-normal mobile:text-base text-[13px] text-gray-500">
                        뽑기팡과 함께 즐뽑해봐요!
                    </p>
                </header>

                <main className="mb-1 flex flex-col">
                    <h2 className="mb-9 text-center font-semibold  text-lg text-gray-600">
                        서비스를 이용하려면
                        <br />
                        로그인하세요
                    </h2>

                    <button
                        type="button"
                        onClick={handleKakaoLogin}
                        className="mb-5 mobile:mb-7 flex w-full cursor-pointer items-center justify-center gap-2 mobile:rounded-[8px] rounded-md bg-[#FEE500] mobile:py-4 py-3 text-black"
                    >
                        <KakaoIcon className="w-5 h-5" />
                        <span className=" mobile:text-base text-base">카카오 로그인</span>
                    </button>
                </main>
            </div>
        </div>
    );
}
