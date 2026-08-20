import type { ColumnDef } from "@tanstack/react-table";
import { SearchableHeader } from "@/components/common/SearchableHeader";
import type { Equipment } from "./types";

import {
  getEquipmentStatusLabel,
  getEquipmentTypeLabel,
} from "@/components/map/marker.constants";
import "@/components/map/map-marker.css";

interface CreateColumnsProps {
  onEquipmentClick: (equipmentId: string) => void;
  onOperationRateClick: (equipmentId: string) => void;
}

export function createColumns({
  onEquipmentClick,
  onOperationRateClick,
}: CreateColumnsProps): ColumnDef<Equipment>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <SearchableHeader column={column} title="장비 ID" />
      ),
      cell: ({ row }) => {
        const equipmentId = row.original.id;

        return (
          <button
            type="button"
            onClick={() => onEquipmentClick(equipmentId)}
            className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {equipmentId}
          </button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SearchableHeader column={column} title="장비 이름" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "type",
      header: "장비 타입",
      cell: ({ row }) => (
        <div>{getEquipmentTypeLabel(row.getValue("type"))}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "장비 상태",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`
          inline-flex items-center rounded-full
          px-2.5 py-1
          text-xs font-semibold
          equipment-status-badge--${[status]}
        `}
          >
            {getEquipmentStatusLabel(status)}
          </span>
        );
      },
    },
    {
      accessorKey: "lastUpdatedAt",
      header: "사용 시간",
      cell: ({ row }) => <div>{row.getValue("lastUpdatedAt")}</div>,
    },
    {
      accessorKey: "location",
      header: "위치",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "operationRate",
      header: "가동률",
      cell: ({ row }) => {
        const equipment = row.original;

        return (
          <button
            type="button"
            onClick={() => onOperationRateClick(equipment.id)}
            className="font-mediu underline hover:text-border cursor-pointer"
          >
            {equipment.operationRate}%
          </button>
        );
      },
    },
  ];
}
