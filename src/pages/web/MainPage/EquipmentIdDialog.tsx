import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CommonDialog } from "@/components/common/CommonDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import {
  getEquipmentIdHistory,
  getEquipmentIdStatus,
} from "@/api/equipmentPopUp.mock";

import { getEquipmentStatusLabel } from "@/components/map/marker.constants";

interface EquipmentIdDialogProps {
  open: boolean;
  equipmentId: string | null;
  onOpenChange: (open: boolean) => void;
}

type EquipmentDialogTab = "status" | "history";

interface HistorySearchRange {
  startDate: string;
  endDate: string;
}

const initialSearchRange: HistorySearchRange = {
  startDate: "2026-08-01",
  endDate: "2026-08-05",
};

// 장비 상세 팝업 전체 UI와 탭/조회 상태를 관리
export function EquipmentIdDialog({
  open,
  equipmentId,
  onOpenChange,
}: EquipmentIdDialogProps) {
  const [activeTab, setActiveTab] = useState<EquipmentDialogTab>("status");

  // 사용자가 입력 중인 날짜
  const [startDate, setStartDate] = useState(initialSearchRange.startDate);
  const [endDate, setEndDate] = useState(initialSearchRange.endDate);

  // 실제 API 요청에 적용된 날짜
  const [searchRange, setSearchRange] =
    useState<HistorySearchRange>(initialSearchRange);

  /*
   * 가동현황 API 자동 실행
   */
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useQuery({
    queryKey: ["equipment-id-status", equipmentId],
    queryFn: () => getEquipmentIdStatus(equipmentId!),
    enabled: open && equipmentId !== null,
  });

  /*
   * 히스토리 탭을 선택했을 때만 실행
   * 날짜 조회 조건이 변경되면 다시 실행
   */
  const {
    data: historyData = [],
    isFetching: isHistoryFetching,
    isError: isHistoryError,
  } = useQuery({
    queryKey: [
      "equipment-id-history",
      equipmentId,
      searchRange.startDate,
      searchRange.endDate,
    ],
    queryFn: () =>
      getEquipmentIdHistory(
        equipmentId!,
        searchRange.startDate,
        searchRange.endDate,
      ),
    enabled: open && equipmentId !== null && activeTab === "history",
  });

  // 다른 장비를 클릭하면 팝업을 가동현황 탭으로 초기화
  useEffect(() => {
    if (!equipmentId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab("status");
    setStartDate(initialSearchRange.startDate);
    setEndDate(initialSearchRange.endDate);
    setSearchRange(initialSearchRange);
  }, [equipmentId]);

  const handleHistorySearch = () => {
    if (!startDate || !endDate) {
      window.alert("조회 기간을 모두 선택해 주세요.");
      return;
    }

    if (startDate > endDate) {
      window.alert("시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }

    setSearchRange({
      startDate,
      endDate,
    });
  };

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title={equipmentId ?? "장비 상세 정보"}
      className="max-w-5xl"
      bodyClassName="p-0"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EquipmentDialogTab)}
        className="flex h-[520px] flex-col"
      >
        <TabsList className="mb-2 h-10 shrink-0 rounded-xl border border-[#E5E8EB] bg-[#F8F9FA] p-1">
          <TabsTrigger
            value="status"
            className="
                        rounded-lg px-5 text-sm
                        data-[state=active]:bg-white
                        data-[state=active]:font-semibold
                        data-[state=active]:shadow-sm
                      "
          >
            가동현황
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="
                        rounded-lg px-5 text-sm
                        data-[state=active]:bg-white
                        data-[state=active]:font-semibold
                        data-[state=active]:shadow-sm
                      "
          >
            히스토리
          </TabsTrigger>
        </TabsList>

        {/* 가동현황 */}
        <TabsContent
          value="status"
          className="m-0 min-h-0 flex-1 overflow-y-auto p-6"
        >
          {isStatusLoading && (
            <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
              장비 가동현황을 불러오는 중입니다.
            </div>
          )}

          {isStatusError && (
            <div className="flex h-[420px] items-center justify-center text-sm text-red-500">
              장비 가동현황을 불러오지 못했습니다.
            </div>
          )}

          {!isStatusLoading && !isStatusError && statusData && (
            <div className="space-y-6">
              {/* 요약 정보 */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatusCard
                  label="현재 상태"
                  value={getEquipmentStatusLabel(statusData.status)}
                />

                <StatusCard
                  label="현재 가동률"
                  value={`${statusData.operationRate}%`}
                />

                <StatusCard
                  label="오늘 가동시간"
                  value={statusData.todayOperationTime}
                />

                <StatusCard
                  label="남은 연료"
                  value={`${statusData.fuelLevel}%`}
                />
              </div>

              {/* 시간대별 가동률 */}
              <section className="rounded-md border p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">시간대별 가동률</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {statusData.equipmentName}의 오늘 시간대별 가동률입니다.
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    최종 업데이트: {statusData.lastUpdatedAt}
                  </span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusData.hourlyRates}
                      margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, "가동률"]} />
                      <Bar
                        dataKey="rate"
                        fill="#5B7FF1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={48}
                      >
                        <LabelList
                          dataKey="rate"
                          position="top"
                          formatter={(value) => `${value}%`}
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          )}
        </TabsContent>

        {/* 히스토리 */}
        <TabsContent
          value="history"
          className="m-0 min-h-0 flex-1 overflow-y-auto p-6"
        >
          <div className="space-y-4">
            {/* 조회 조건 */}
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="equipment-history-start-date"
                  className="text-sm font-medium mr-1"
                >
                  시작일
                </label>

                <Input
                  id="equipment-history-start-date"
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(event) => {
                    const nextStartDate = event.target.value;

                    setStartDate(nextStartDate);

                    if (endDate && nextStartDate > endDate) {
                      setEndDate(nextStartDate);
                    }
                  }}
                  className="w-40"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="equipment-history-end-date"
                  className="text-sm font-medium mr-1"
                >
                  종료일
                </label>

                <Input
                  id="equipment-history-end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(event) => {
                    const nextEndDate = event.target.value;

                    setEndDate(nextEndDate);

                    if (startDate && nextEndDate < startDate) {
                      setStartDate(nextEndDate);
                    }
                  }}
                  className="w-40"
                />
              </div>

              <Button
                type="button"
                onClick={handleHistorySearch}
                disabled={isHistoryFetching}
              >
                {isHistoryFetching ? "조회 중" : "조회"}
              </Button>
            </div>

            {/* 히스토리 결과 */}
            {isHistoryError ? (
              <div className="flex h-64 items-center justify-center rounded-md border text-sm text-red-500">
                장비 히스토리를 불러오지 못했습니다.
              </div>
            ) : (
              <div className="max-h-[430px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                      <TableHead className="text-center">날짜</TableHead>

                      <TableHead className="text-center">가동시간</TableHead>

                      <TableHead className="text-center">대기시간</TableHead>

                      <TableHead className="text-center">정비시간</TableHead>

                      <TableHead className="text-center">평균 가동률</TableHead>

                      <TableHead className="text-center">연료 사용량</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isHistoryFetching ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-40 text-center text-muted-foreground"
                        >
                          히스토리를 불러오는 중입니다.
                        </TableCell>
                      </TableRow>
                    ) : historyData.length > 0 ? (
                      historyData.map((history, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-center">
                            {history.date}
                          </TableCell>

                          <TableCell className="text-center">
                            {history.operationTime}
                          </TableCell>

                          <TableCell className="text-center">
                            {history.idleTime}
                          </TableCell>

                          <TableCell className="text-center">
                            {history.maintenanceTime}
                          </TableCell>

                          <TableCell className="text-center font-medium">
                            {history.averageOperationRate.toFixed(1)}%
                          </TableCell>

                          <TableCell className="text-center">
                            {history.fuelUsed.toFixed(1)}L
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-40 text-center text-muted-foreground"
                        >
                          조회된 장비 이력이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </CommonDialog>
  );
}

interface StatusCardProps {
  label: string;
  value: string;
}

// 장비 상태 요약 카드뷰
function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded-md border bg-muted/20 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
