export type EquipmentStatus =
  | "running"
  | "idle"
  | "powerOff"
  | "maintenance"
  | "batteryLow"
  | "error";

export type EquipmentType = "forklift" | "aerialLift";

export interface Equipment {
  id: string; // 장비 id
  name: string; // 장비 이름
  type: EquipmentType; // 장비 타입
  latitude: number; // 위도
  longitude: number; // 경도
  status: EquipmentStatus; // 상태
  operationRate: number; // 가동률
  fuelLevel: number; // 남은 연료 비율
  lastUpdatedAt: string; // 업데이트 시간
  location: string; // 위치

  // 팝업에 표시할 추가 정보
  company?: string;
  terminalId?: string;
  specification?: string;
}

/* 장비 ID 팝업 > 가동현황 */

export interface EquipmentHourlyRate {
  time: string;
  rate: number;
}

export interface EquipmentIdStatus {
  equipmentId: string;
  equipmentName: string;
  status: EquipmentStatus;
  operationRate: number;
  todayOperationTime: string;
  fuelLevel: number;
  lastUpdatedAt: string;
  hourlyRates: EquipmentHourlyRate[];
}

/* 장비 ID 팝업 > 히스토리 */

export interface EquipmentIdHistory {
  date: string;
  operationTime: string;
  idleTime: string;
  maintenanceTime: string;
  averageOperationRate: number;
  fuelUsed: number;
}

export interface EquipmentHistory {
  equipmentId: string;
  histories: EquipmentIdHistory[];
}

/* 가동률 팝업 > 가동일보 */

export interface DailySummary {
  fuelLevel: number;
  hydraulicOilTemperature: number;
  coolantTemperature: number;
  transmissionOilTemperature: number;
}

export interface OperationTimeSummary {
  category: string;
  today: string;
  sevenDayAverage: string;
  rate: number;
  color: string;
}

/* 가동률 팝업 > 가동시간 */

export interface OperationHistory {
  id: number;
  equipmentId: string;
  date: string;
  workTime: string;
  drivingTime: string;
  idleTime: string;
  operationRateA: number;
  operationRateB: number;
}
