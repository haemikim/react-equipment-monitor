import {
  getEquipmentStatusLabel,
  getEquipmentTypeLabel,
  getMarkerColor,
} from "./marker.constants";
import type { Equipment } from "@/pages/web/MainPage/types";

interface CreateEquipmentInfoOverlayParams {
  equipment: Equipment;
  onDetailClick?: (equipmentId: string) => void;
}

const createInfoRow = (
  label: string,
  value: string | number | null | undefined,
): HTMLDivElement => {
  const row = document.createElement("div");
  row.className = "equipment-info-overlay__row";

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent =
    value === undefined || value === null || value === "" ? "-" : String(value);

  row.append(term, description);

  return row;
};

export const createEquipmentInfoOverlay = ({
  equipment,
}: CreateEquipmentInfoOverlayParams): HTMLDivElement => {
  const markerColor = getMarkerColor(equipment);

  const wrapper = document.createElement("div");
  wrapper.className = "equipment-info-overlay";

  const card = document.createElement("div");
  card.className = "equipment-info-overlay__card";
  card.style.setProperty("--overlay-color", markerColor);

  const title = document.createElement("div");
  title.className = "equipment-info-overlay__title";
  title.textContent = `${equipment.name} (${getEquipmentTypeLabel(
    equipment.type,
  )})`;

  const list = document.createElement("dl");
  list.className = "equipment-info-overlay__list";

  // 상태 Badge
  const createStatusRow = (
    label: string,
    status: Equipment["status"],
  ): HTMLDivElement => {
    const row = document.createElement("div");
    row.className = "equipment-info-overlay__row";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");

    const badge = document.createElement("span");
    badge.className = `equipment-status-badge equipment-status-badge--${status}`;
    badge.textContent = getEquipmentStatusLabel(status);

    description.append(badge);
    row.append(term, description);

    return row;
  };

  list.append(
    createInfoRow("소속부서", equipment.company ?? "-"),
    createInfoRow("장비번호", equipment.id),
    createInfoRow("단말 ID", equipment.terminalId ?? "-"),
    createInfoRow("규격", equipment.specification ?? "-"),
    createStatusRow("상태", equipment.status),
    createInfoRow("가동률", `${equipment.operationRate}%`),
    createInfoRow("연료", `${equipment.fuelLevel}%`),
    createInfoRow("수신시간", equipment.lastUpdatedAt),
    createInfoRow("위치", equipment.location),
  );

  const tail = document.createElement("span");
  tail.className = "equipment-info-overlay__tail";
  tail.setAttribute("aria-hidden", "true");

  card.append(title, list, tail);
  wrapper.append(card);

  // 말풍선 내부 클릭이 지도 클릭으로 전달되는 것을 방지
  wrapper.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  wrapper.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  return wrapper;
};
