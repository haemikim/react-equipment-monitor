export type EquipmentType = "forklift" | "aerialLift";

export type EquipmentStatus =
  | "running"
  | "idle"
  | "powerOff"
  | "maintenance"
  | "batteryLow"
  | "error";

export type MarkerShape = "circle" | "square";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  latitude: number;
  longitude: number;
  status: EquipmentStatus;
  operationRate: number;
  fuelLevel: number;
  lastUpdatedAt: string;
  location: string;

  // 팝업에 표시할 추가 정보
  company?: string;
  terminalId?: string;
  specification?: string;
}

export interface EquipmentOverlay {
  overlay: kakao.maps.CustomOverlay;
  markerElement: HTMLButtonElement;
}
