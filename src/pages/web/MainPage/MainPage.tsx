import { useMemo, useState } from "react";
import { InfoTable } from "@/components/web/InfoTable";
import { createColumns } from "./Colums";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EquipmentType } from "./types";
import { OperationRateDialog } from "./OperationRateDialog";
import { EquipmentIdDialog } from "./EquipmentIdDialog";

import { EquipmentMap } from "@/components/map/EquipmentMap";
import { MainTitleCradView } from "@/components/web/MainTitleCardView";
import { mockEquipments } from "@/components/map/equipment.mock";

type EquipmentTab = Extract<EquipmentType, "forklift" | "aerialLift">;

function MainPage() {
  const [selectedType, setSelectedType] = useState<EquipmentTab>("forklift");

  // 장비번호 컬럼값
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(
    null,
  );
  // 장비번호 팝업
  const [isEquipmentIdDialogOpen, setIsEquipmentIdDialogOpen] = useState(false);

  // 가동률 컬럼값
  const [selectedOperationEquipmentId, setSelectedOperationEquipmentId] =
    useState<string | null>(null);

  // 가동률 팝업
  const [isOperationRateDialogOpen, setIsOperationRateDialogOpen] =
    useState(false);

  // 현재날짜
  const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  /* 카드뷰 */
  const equipmentSummary = useMemo(() => {
    const totalCount = mockEquipments.length;

    const runningCount = mockEquipments.filter(
      (equipment) => equipment.status === "running",
    ).length;

    const idleCount = mockEquipments.filter(
      (equipment) => equipment.status === "idle",
    ).length;

    const abnormalCount = mockEquipments.filter((equipment) =>
      ["maintenance", "batteryLow", "error"].includes(equipment.status),
    ).length;

    const lastUpdatedAt = getCurrentDateTime();

    return {
      totalCount,
      runningCount,
      idleCount,
      abnormalCount,
      lastUpdatedAt,
    };
  }, []);

  // 지게차/ 고소차 분리
  const filteredData = useMemo(() => {
    return mockEquipments.filter(
      (equipment) => equipment.type === selectedType,
    );
  }, [selectedType]);

  const columns = useMemo(
    () =>
      createColumns({
        onEquipmentClick: (equipmentId) => {
          setSelectedEquipmentId(equipmentId);
          setIsEquipmentIdDialogOpen(true);
        },

        onOperationRateClick: (equipmentId) => {
          setSelectedOperationEquipmentId(equipmentId);
          setIsOperationRateDialogOpen(true);
        },
      }),
    [],
  );

  return (
    <>
      <MainTitleCradView
        totalCount={equipmentSummary.totalCount}
        runningCount={equipmentSummary.runningCount}
        idleCount={equipmentSummary.idleCount}
        abnormalCount={equipmentSummary.abnormalCount}
        lastUpdatedAt={equipmentSummary.lastUpdatedAt}
      />

      <section className="overflow-hidden rounded-2xl bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">장비 위치</h2>

            <p className="mt-0.5 text-xs text-slate-400">
              지도에서 장비의 현재 상태를 확인하세요.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {filteredData.length}대
          </span>
        </div>

        <div className="h-[520px]">
          <EquipmentMap equipments={filteredData} />
        </div>
      </section>

      <div className="mt-4">
        <Tabs
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as EquipmentTab)}
        >
          <TabsList className="h-10 rounded-xl border border-[#E5E8EB] bg-[#F8F9FA] p-1 mb-2">
            <TabsTrigger
              value="forklift"
              className="
                        rounded-lg px-5 text-sm
                        data-[state=active]:bg-white
                        data-[state=active]:font-semibold
                        data-[state=active]:shadow-sm
                      "
            >
              지게차
              <span className="ml-2 text-xs text-slate-400">3</span>
            </TabsTrigger>

            <TabsTrigger
              value="aerialLift"
              className="
      rounded-lg px-5 text-sm
      data-[state=active]:bg-white
      data-[state=active]:font-semibold
      data-[state=active]:shadow-sm
    "
            >
              고소차
              <span className="ml-2 text-xs text-slate-400">2</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <InfoTable columns={columns} data={filteredData} />

        <OperationRateDialog
          open={isOperationRateDialogOpen}
          equipmentId={selectedOperationEquipmentId}
          onOpenChange={(open) => {
            setIsOperationRateDialogOpen(open);

            if (!open) {
              setSelectedOperationEquipmentId(null);
            }
          }}
        />
        <EquipmentIdDialog
          open={isEquipmentIdDialogOpen}
          equipmentId={selectedEquipmentId}
          onOpenChange={(open) => {
            setIsEquipmentIdDialogOpen(open);

            if (!open) {
              setSelectedEquipmentId(null);
            }
          }}
        />
      </div>
    </>
  );
}
export default MainPage;
