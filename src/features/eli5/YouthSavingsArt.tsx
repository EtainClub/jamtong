export function SavingsMatch() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="청년의 저축에 정부 기여금이 더해지는 구조">
      <rect x="35" y="105" width="150" height="75" rx="12" fill="var(--navy)" />
      <rect x="190" y="135" width="95" height="45" rx="12" fill="var(--burgundy)" />
      <text x="110" y="145" textAnchor="middle" fontSize="18" fill="white">내 저축</text>
      <text x="237" y="162" textAnchor="middle" fontSize="13" fill="white">정부 기여금</text>
      <text x="160" y="65" textAnchor="middle" fontSize="19" fill="var(--ink)">함께 쌓는 미래</text>
      <text x="160" y="210" textAnchor="middle" fontSize="13" fill="var(--ash)">도식 · 가입 유형별 조건 적용</text>
    </svg>
  );
}

export function SavingsApply() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="신청, 자격심사, 계좌 개설은 서로 다른 단계">
      <path d="M60 115H260" stroke="var(--stone)" strokeWidth="5" />
      {["신청", "심사", "계좌 개설"].map((label, i) => (
        <g key={label}>
          <circle cx={60 + i * 100} cy="115" r="30" fill="var(--navy)" />
          <text x={60 + i * 100} y="121" textAnchor="middle" fontSize="18" fill="white">{i + 1}</text>
          <text x={60 + i * 100} y="177" textAnchor="middle" fontSize="15" fill="var(--ink)">{label}</text>
        </g>
      ))}
      <text x="160" y="55" textAnchor="middle" fontSize="19" fill="var(--ink)">신청한 뒤에도 절차가 있어요</text>
    </svg>
  );
}
