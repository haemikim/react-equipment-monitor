import type {
  EquipmentStatus,
  EquipmentType,
  MarkerShape,
  Equipment,
} from "./marker.types";

/* 지도 마커 */

export const EQUIPMENT_SHAPE_MAP: Record<EquipmentType, MarkerShape> = {
  forklift: "circle",
  aerialLift: "square",
};

export const EQUIPMENT_TYPE_LABEL_MAP: Record<EquipmentType, string> = {
  forklift: "지게차",
  aerialLift: "고소차",
};

export const STATUS_COLOR_MAP: Record<EquipmentStatus, string> = {
  running: "#22c55e",
  idle: "#3b82f6",
  powerOff: "#111827",
  maintenance: "#facc15",
  batteryLow: "#9ca3af",
  error: "#ef4444",
};

export const STATUS_LABEL_MAP: Record<EquipmentStatus, string> = {
  running: "사용",
  idle: "미사용",
  powerOff: "전원 OFF",
  maintenance: "정비",
  batteryLow: "배터리 부족",
  error: "고장",
};

export const STATUS_LIST: EquipmentStatus[] = [
  "running",
  "idle",
  "powerOff",
  "maintenance",
  "batteryLow",
  "error",
];

/* 지도 마커 클릭 팝업 */

export const EQUIPMENT_TYPE_LIST: EquipmentType[] = ["forklift", "aerialLift"];

export const MARKER_COLORS: Record<EquipmentStatus, string> = {
  running: "#16a34a",
  idle: "#2563eb",
  powerOff: "#6b7280",
  maintenance: "#f59e0b",
  batteryLow: "#dc2626",
  error: "#ef4444",
};

export const getMarkerColor = (equipment: Equipment): string => {
  return MARKER_COLORS[equipment.status];
};

export const getEquipmentTypeLabel = (type: EquipmentType): string => {
  switch (type) {
    case "forklift":
      return "지게차";

    case "aerialLift":
      return "고소차";

    default:
      return type;
  }
};

export const getEquipmentStatusLabel = (status: EquipmentStatus): string => {
  switch (status) {
    case "running":
      return "가동";

    case "idle":
      return "대기";

    case "powerOff":
      return "전원 OFF";

    case "maintenance":
      return "정비";

    case "batteryLow":
      return "배터리 부족";

    case "error":
      return "고장";

    default:
      return status;
  }
};
