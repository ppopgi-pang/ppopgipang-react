/**
 * ISO String을 'YY.MM.DD.요일' 형식으로 변환합니다.
 * @param dateString - '2026-02-08T14:00:00Z'와 같은 ISO 형식 문자열
 */
export const formatReviewDate = (dateString: string): string => {
    const date = new Date(dateString);

    // 날짜가 유효하지 않을 경우 예외 처리
    if (isNaN(date.getTime())) return '-';

    const yy = String(date.getFullYear()).slice(-2); // 뒤의 2자리만
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    // 요일 계산
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = weekDays[date.getDay()];

    return `${yy}.${mm}.${dd}.${dayName}`;
};

// 사용 예시
// console.log(formatReviewDate("2026-02-08T14:00:00Z")); // "26.02.08.일"
