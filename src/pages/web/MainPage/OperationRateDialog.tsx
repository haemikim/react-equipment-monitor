import { useMemo, useState } from "react";
import ExcelJS from "exceljs";

import {
  Bar,
  BarChart,
  Rectangle,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

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
  dailySummary,
  operationTimeSummary,
  mockOperationHistory,
} from "@/api/operationPopUp.mock";
import type { OperationTimeSummary } from "./types";

interface OperationRateDialogProps {
  open: boolean;
  equipmentId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function OperationRateDialog({
  open,
  equipmentId,
  onOpenChange,
}: OperationRateDialogProps) {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-05");

  // 입력 중인 날짜와 실제 조회 조건을 분리
  const [searchRange, setSearchRange] = useState({
    startDate: "2026-08-01",
    endDate: "2026-08-05",
  });

  const filteredHistory = useMemo(() => {
    if (!equipmentId) return [];

    return mockOperationHistory
      .filter(
        (history) =>
          history.equipmentId === equipmentId &&
          history.date >= searchRange.startDate &&
          history.date <= searchRange.endDate,
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [equipmentId, searchRange]);

  // ID별로 가동시간 요약 정보를 조회
  const selectedOperationTimeSummary = useMemo(() => {
    if (!equipmentId) return [];

    return operationTimeSummary[equipmentId] ?? [];
  }, [equipmentId]);

  // ID별로 일일 장비 상태 정보를 조회
  const selectedDailySummary = useMemo(() => {
    if (!equipmentId) return null;

    return dailySummary[equipmentId] ?? null;
  }, [equipmentId]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      window.alert("조회 기간을 모두 선택해 주세요.");
      return;
    }

    setSearchRange({
      startDate,
      endDate,
    });
  };

  const handleExcelDownload = async () => {
    if (filteredHistory.length === 0) {
      window.alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("가동시간");

    worksheet.columns = [
      {
        header: "일자",
        key: "date",
        width: 15,
      },
      {
        header: "작업시간",
        key: "workTime",
        width: 15,
      },
      {
        header: "주행시간",
        key: "drivingTime",
        width: 15,
      },
      {
        header: "공회전",
        key: "idleTime",
        width: 15,
      },
      {
        header: "가동률A",
        key: "operationRateA",
        width: 12,
      },
      {
        header: "가동률B",
        key: "operationRateB",
        width: 12,
      },
    ];

    filteredHistory.forEach((history) => {
      worksheet.addRow({
        date: history.date,
        workTime: history.workTime,
        drivingTime: history.drivingTime,
        idleTime: history.idleTime,
        operationRateA: `${history.operationRateA.toFixed(1)}%`,
        operationRateB: `${history.operationRateB.toFixed(1)}%`,
      });
    });

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF2563EB",
      },
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.eachRow((row) => {
      row.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = `가동시간_${equipmentId}_${searchRange.startDate}_${searchRange.endDate}.xlsx`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${equipmentId ?? "-"} 장비 상세`}
      className="max-w-5xl"
      bodyClassName="p-0"
    >
      <Tabs defaultValue="daily" className="flex h-[520px] flex-col">
        <TabsList className="mb-2 h-10 shrink-0 rounded-xl border border-[#E5E8EB] bg-[#F8F9FA] p-1">
          <TabsTrigger
            value="daily"
            className="
              rounded-lg px-5 text-sm
              data-[state=active]:bg-white
              data-[state=active]:font-semibold
              data-[state=active]:shadow-sm
            "
          >
            가동일보
          </TabsTrigger>

          <TabsTrigger
            value="time"
            className="
              rounded-lg px-5 text-sm
              data-[state=active]:bg-white
              data-[state=active]:font-semibold
              data-[state=active]:shadow-sm
            "
          >
            가동시간
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="daily"
          className="m-0 min-h-0 flex-1 overflow-y-auto p-6"
        >
          <div className="mb-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <GaugeCard
              label="연료"
              value={selectedDailySummary?.fuelLevel ?? 0}
              unit="%"
              color="#2563EB"
            />

            <GaugeCard
              label="유압오일"
              value={selectedDailySummary?.hydraulicOilTemperature ?? 0}
              unit="℃"
              color="#22C55E"
            />

            <GaugeCard
              label="냉각수"
              value={selectedDailySummary?.coolantTemperature ?? 0}
              unit="℃"
              color="#0EA5E9"
            />

            <GaugeCard
              label="변속오일"
              value={selectedDailySummary?.transmissionOilTemperature ?? 0}
              unit="℃"
              color="#334155"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-3">
                <h3 className="font-semibold">가동 시간</h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">구분</TableHead>
                    <TableHead className="text-center">당일 시간</TableHead>
                    <TableHead className="text-center">7일 평균시간</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selectedOperationTimeSummary.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="text-center font-medium">
                        {item.category}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.today}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.sevenDayAverage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            <section className="rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-3">
                <h3 className="font-semibold">가동 시간 비율</h3>
              </div>

              <div className="h-[220px] p-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedOperationTimeSummary}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />

                    {/* 가동시간 항목 */}
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={70}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 14,
                        fill: "#334155",
                      }}
                    />

                    <Bar
                      dataKey="rate"
                      barSize={24}
                      radius={[5, 5, 5, 5]}
                      background={{
                        fill: "#F1F3F5",
                        radius: 5,
                      }}
                      shape={(props) => {
                        const item = props.payload as OperationTimeSummary;

                        return (
                          <Rectangle
                            {...props}
                            fill={getChartColor(item.color)}
                            radius={5}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent
          value="time"
          className="m-0 min-h-0 flex-1 overflow-y-auto p-6"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="operation-start-date"
                    className="text-sm font-medium mr-1"
                  >
                    시작일
                  </label>

                  <Input
                    id="operation-start-date"
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(event) => {
                      const nextDate = event.target.value;
                      setStartDate(nextDate);

                      if (endDate && nextDate > endDate) {
                        setEndDate(nextDate);
                      }
                    }}
                    className="w-40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="operation-end-date"
                    className="text-sm font-medium mr-1"
                  >
                    종료일
                  </label>

                  <Input
                    id="operation-end-date"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(event) => {
                      const nextDate = event.target.value;
                      setEndDate(nextDate);

                      if (startDate && nextDate < startDate) {
                        setStartDate(nextDate);
                      }
                    }}
                    className="w-40"
                  />
                </div>

                <Button type="button" onClick={handleSearch}>
                  조회
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleExcelDownload}
              >
                엑셀 다운로드
              </Button>
            </div>

            <div className="max-h-[430px] overflow-auto rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="text-center">일자</TableHead>
                    <TableHead className="text-center">작업시간</TableHead>
                    <TableHead className="text-center">주행시간</TableHead>
                    <TableHead className="text-center">공회전</TableHead>
                    <TableHead className="text-center">가동률A</TableHead>
                    <TableHead className="text-center">가동률B</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="text-center">
                          {history.date}
                        </TableCell>

                        <TableCell className="text-center">
                          {history.workTime}
                        </TableCell>

                        <TableCell className="text-center">
                          {history.drivingTime}
                        </TableCell>

                        <TableCell className="text-center">
                          {history.idleTime}
                        </TableCell>

                        <TableCell className="text-center">
                          {history.operationRateA.toFixed(1)}%
                        </TableCell>

                        <TableCell className="text-center">
                          {history.operationRateB.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-40 text-center text-muted-foreground"
                      >
                        조회된 가동시간 데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CommonDialog>
  );
}

interface GaugeCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

function GaugeCard({ label, value, unit, color }: GaugeCardProps) {
  // API에서 비정상적으로 0 미만 또는 100 초과 값이 들어오는 경우
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  const chartData = [
    {
      value: normalizedValue,
    },
  ];

  return (
    <div className="rounded-md border p-4">
      <div className="relative mx-auto h-32 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="68%"
            outerRadius="92%"
            startAngle={90}
            endAngle={-270}
            barSize={12}
            data={chartData}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />

            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={{
                fill: "#F1F3F5",
              }}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-slate-900">
            {value}
            {unit}
          </span>

          <span className="mt-1 text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
}

const getChartColor = (color: string): string => {
  switch (color) {
    case "bg-blue-500":
      return "#3B82F6";

    case "bg-orange-500":
      return "#F97316";

    case "bg-red-500":
      return "#EF4444";

    case "bg-green-500":
      return "#22C55E";

    default:
      return "#3B82F6";
  }
};
