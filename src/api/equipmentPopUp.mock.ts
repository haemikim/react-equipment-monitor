import type {
  EquipmentIdHistory,
  EquipmentHistory,
  EquipmentIdStatus,
} from "@/pages/web/MainPage/types";

/* 장비별 가동 이력 */
const mockEquipmentHistory: EquipmentHistory[] = [
  {
    equipmentId: "EQ-001",
    histories: [
      {
        date: "2026-08-05",
        operationTime: "06시간 20분",
        idleTime: "01시간 15분",
        maintenanceTime: "00시간 00분",
        averageOperationRate: 82.4,
        fuelUsed: 18.3,
      },
      {
        date: "2026-08-04",
        operationTime: "05시간 48분",
        idleTime: "01시간 32분",
        maintenanceTime: "00시간 30분",
        averageOperationRate: 76.8,
        fuelUsed: 16.7,
      },
      {
        date: "2026-08-03",
        operationTime: "07시간 12분",
        idleTime: "00시간 48분",
        maintenanceTime: "00시간 00분",
        averageOperationRate: 91.5,
        fuelUsed: 21.6,
      },
      {
        date: "2026-08-02",
        operationTime: "03시간 45분",
        idleTime: "02시간 30분",
        maintenanceTime: "01시간 10분",
        averageOperationRate: 54.8,
        fuelUsed: 11.2,
      },
      {
        date: "2026-08-01",
        operationTime: "04시간 30분",
        idleTime: "01시간 25분",
        maintenanceTime: "00시간 20분",
        averageOperationRate: 64.3,
        fuelUsed: 13.7,
      },
    ],
  },

  {
    equipmentId: "EQ-002",
    histories: [
      {
        date: "2026-08-05",
        operationTime: "03시간 25분",
        idleTime: "02시간 10분",
        maintenanceTime: "01시간 00분",
        averageOperationRate: 48.5,
        fuelUsed: 10.4,
      },
      {
        date: "2026-08-04",
        operationTime: "04시간 10분",
        idleTime: "01시간 42분",
        maintenanceTime: "00시간 00분",
        averageOperationRate: 61.2,
        fuelUsed: 12.8,
      },
      {
        date: "2026-08-03",
        operationTime: "05시간 02분",
        idleTime: "01시간 18분",
        maintenanceTime: "00시간 20분",
        averageOperationRate: 70.6,
        fuelUsed: 14.5,
      },
      {
        date: "2026-08-02",
        operationTime: "02시간 48분",
        idleTime: "03시간 05분",
        maintenanceTime: "00시간 00분",
        averageOperationRate: 43.7,
        fuelUsed: 8.9,
      },
      {
        date: "2026-08-01",
        operationTime: "04시간 35분",
        idleTime: "01시간 50분",
        maintenanceTime: "00시간 30분",
        averageOperationRate: 66.1,
        fuelUsed: 13.2,
      },
    ],
  },

  {
    equipmentId: "EQ-003",
    histories: [
      {
        date: "2026-08-05",
        operationTime: "00시간 00분",
        idleTime: "00시간 35분",
        maintenanceTime: "06시간 20분",
        averageOperationRate: 0,
        fuelUsed: 2.1,
      },
      {
        date: "2026-08-04",
        operationTime: "02시간 40분",
        idleTime: "01시간 20분",
        maintenanceTime: "03시간 00분",
        averageOperationRate: 37.5,
        fuelUsed: 8.4,
      },
      {
        date: "2026-08-03",
        operationTime: "04시간 15분",
        idleTime: "01시간 05분",
        maintenanceTime: "01시간 30분",
        averageOperationRate: 58.2,
        fuelUsed: 12.6,
      },
    ],
  },

  {
    equipmentId: "EQ-004",
    histories: [
      {
        date: "2026-08-05",
        operationTime: "01시간 10분",
        idleTime: "02시간 20분",
        maintenanceTime: "03시간 30분",
        averageOperationRate: 22.8,
        fuelUsed: 5.7,
      },
      {
        date: "2026-08-04",
        operationTime: "03시간 30분",
        idleTime: "01시간 15분",
        maintenanceTime: "01시간 40분",
        averageOperationRate: 51.4,
        fuelUsed: 9.8,
      },
      {
        date: "2026-08-03",
        operationTime: "04시간 05분",
        idleTime: "00시간 55분",
        maintenanceTime: "01시간 00분",
        averageOperationRate: 63.7,
        fuelUsed: 11.5,
      },
    ],
  },

  {
    equipmentId: "EQ-005",
    histories: [
      {
        date: "2026-08-05",
        operationTime: "00시간 00분",
        idleTime: "00시간 00분",
        maintenanceTime: "00시간 00분",
        averageOperationRate: 0,
        fuelUsed: 0,
      },
      {
        date: "2026-08-04",
        operationTime: "01시간 25분",
        idleTime: "02시간 40분",
        maintenanceTime: "03시간 10분",
        averageOperationRate: 28.4,
        fuelUsed: 4.6,
      },
      {
        date: "2026-08-03",
        operationTime: "05시간 05분",
        idleTime: "01시간 10분",
        maintenanceTime: "00시간 30분",
        averageOperationRate: 72.1,
        fuelUsed: 15.1,
      },
    ],
  },
];

/* 장비 ID 팝업 > 가동현황 */
export const getEquipmentIdStatus = async (
  equipmentId: string,
): Promise<EquipmentIdStatus> => {
  const equipmentStatusData: Record<string, EquipmentIdStatus> = {
    "EQ-001": {
      equipmentId: "EQ-001",
      equipmentName: "지게차 01",
      status: "running",
      operationRate: 82,
      todayOperationTime: "06시간 20분",
      fuelLevel: 74,
      lastUpdatedAt: "2026-08-10 13:10",
      hourlyRates: [
        { time: "08-09", rate: 96 },
        { time: "09-10", rate: 45 },
        { time: "10-11", rate: 72 },
        { time: "11-12", rate: 28 },
        { time: "12-13", rate: 0 },
        { time: "13-14", rate: 64 },
        { time: "14-15", rate: 81 },
        { time: "15-16", rate: 52 },
      ],
    },

    "EQ-002": {
      equipmentId: "EQ-002",
      equipmentName: "지게차 02",
      status: "idle",
      operationRate: 25,
      todayOperationTime: "03시간 25분",
      fuelLevel: 55,
      lastUpdatedAt: "2026-08-10 13:08",
      hourlyRates: [
        { time: "08-09", rate: 35 },
        { time: "09-10", rate: 42 },
        { time: "10-11", rate: 28 },
        { time: "11-12", rate: 15 },
        { time: "12-13", rate: 0 },
        { time: "13-14", rate: 25 },
        { time: "14-15", rate: 18 },
        { time: "15-16", rate: 0 },
      ],
    },

    "EQ-003": {
      equipmentId: "EQ-003",
      equipmentName: "고소차 01",
      status: "maintenance",
      operationRate: 0,
      todayOperationTime: "00시간 00분",
      fuelLevel: 40,
      lastUpdatedAt: "2026-08-10 13:06",
      hourlyRates: [
        { time: "08-09", rate: 0 },
        { time: "09-10", rate: 0 },
        { time: "10-11", rate: 0 },
        { time: "11-12", rate: 0 },
        { time: "12-13", rate: 0 },
        { time: "13-14", rate: 0 },
        { time: "14-15", rate: 0 },
        { time: "15-16", rate: 0 },
      ],
    },

    "EQ-004": {
      equipmentId: "EQ-004",
      equipmentName: "고소차 02",
      status: "error",
      operationRate: 0,
      todayOperationTime: "00시간 00분",
      fuelLevel: 18,
      lastUpdatedAt: "2026-08-10 13:04",
      hourlyRates: [
        { time: "08-09", rate: 18 },
        { time: "09-10", rate: 32 },
        { time: "10-11", rate: 0 },
        { time: "11-12", rate: 0 },
        { time: "12-13", rate: 0 },
        { time: "13-14", rate: 0 },
        { time: "14-15", rate: 0 },
        { time: "15-16", rate: 0 },
      ],
    },

    "EQ-005": {
      equipmentId: "EQ-005",
      equipmentName: "지게차 03",
      status: "powerOff",
      operationRate: 0,
      todayOperationTime: "00시간 00분",
      fuelLevel: 63,
      lastUpdatedAt: "2026-08-10 13:02",
      hourlyRates: [
        { time: "08-09", rate: 0 },
        { time: "09-10", rate: 0 },
        { time: "10-11", rate: 0 },
        { time: "11-12", rate: 0 },
        { time: "12-13", rate: 0 },
        { time: "13-14", rate: 0 },
        { time: "14-15", rate: 0 },
        { time: "15-16", rate: 0 },
      ],
    },
  };

  return (
    equipmentStatusData[equipmentId] ?? {
      equipmentId,
      equipmentName: "-",
      status: "powerOff",
      operationRate: 0,
      todayOperationTime: "00시간 00분",
      fuelLevel: 0,
      lastUpdatedAt: "-",
      hourlyRates: [],
    }
  );
};

/* 장비 ID 팝업 > 히스토리 */
export const getEquipmentIdHistory = async (
  equipmentId: string,
  startDate: string,
  endDate: string,
): Promise<EquipmentIdHistory[]> => {
  const equipmentHistory = mockEquipmentHistory.find(
    (equipment) => equipment.equipmentId === equipmentId,
  );

  if (!equipmentHistory) {
    return [];
  }

  return equipmentHistory.histories
    .filter((history) => history.date >= startDate && history.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));
};
