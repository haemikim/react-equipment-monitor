interface MainTitleCradViewProps {
  totalCount: number;
  runningCount: number;
  idleCount: number;
  abnormalCount: number;
  lastUpdatedAt?: string;
}

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
}

export function MainTitleCradView({
  totalCount,
  runningCount,
  idleCount,
  abnormalCount,
  lastUpdatedAt,
}: MainTitleCradViewProps) {
  return (
    <section className="space-y-4">
      {/* 메인 제목 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#191f28]">장비 관제</h1>

          <p className="mt-1 text-sm text-[#8b95a1]">
            장비의 현재 위치와 가동 상태를 확인할 수 있습니다.
          </p>
        </div>

        {lastUpdatedAt && (
          <span className="text-sm text-[#8b95a1]">
            최근 업데이트 {lastUpdatedAt}
          </span>
        )}
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 divide-x divide-[#E5E8EB] rounded-2xl bg-white px-2 py-4">
        <SummaryItem title="전체 장비" value={totalCount} color="bg-blue-500" />

        <SummaryItem
          title="가동 중"
          value={runningCount}
          color="bg-emerald-500"
        />

        <SummaryItem title="대기 중" value={idleCount} color="bg-amber-400" />

        <SummaryItem
          title="이상 장비"
          value={abnormalCount}
          color="bg-red-500"
        />
      </div>
    </section>
  );
}

function SummaryItem({ title, value, color }: SummaryCardProps) {
  return (
    <div className="flex items-center justify-center gap-4 px-5">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />

        <span className="text-sm font-medium text-[#8B95A1]">{title}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#191F28]">{value}</span>

        <span className="text-sm text-[#8B95A1]">대</span>
      </div>
    </div>
  );
}
