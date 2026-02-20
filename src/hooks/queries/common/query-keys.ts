/**
 * 이미지 쿼리키 팩토리
 * 파일 경로를 키로 사용하여 동일 이미지 중복 요청 방지
 */
export const imageKeys = {
    all: ['images'] as const,
    image: (imageName: string) => [...imageKeys.all, imageName] as const,
} as const;
