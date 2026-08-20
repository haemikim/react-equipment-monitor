import { EQUIPMENT_SHAPE_MAP, STATUS_COLOR_MAP } from "./marker.constants";

import type { Equipment } from "@/pages/web/MainPage/types";

interface CreateEquipmentMarkerParams {
  map: kakao.maps.Map;
  equipment: Equipment;
  onClick?: (equipment: Equipment) => void;
}

/**
 * 장비 마커 인스턴스
 */
export interface EquipmentMarkerInstance {
  overlay: kakao.maps.CustomOverlay;
  markerElement: HTMLButtonElement;

  /**
   * 기존 마커를 업데이트
   */
  update: (equipment: Equipment) => void;

  destroy: () => void;
}

/**
 * 장비 마커 생성
 */
export function createEquipmentMarker({
  map,
  equipment,
  onClick,
}: CreateEquipmentMarkerParams): EquipmentMarkerInstance {
  const markerElement = document.createElement("button");

  markerElement.type = "button";
  let currentEquipment = equipment;

  /**
   * 마커 클릭 이벤트
   */
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();

    onClick?.(currentEquipment);
  };

  markerElement.addEventListener("click", handleClick);

  /**
   * 장비 데이터 변경에 따른 마커 업데이트
   *
   *
   * 변경되는 항목
   * - 장비 타입 → 마커 모양
   * - 장비 상태 → 마커 색상
   * - 장비명 → 접근성 텍스트 / title
   * - 장비 ID → data attribute
   * - 위도 / 경도 → CustomOverlay 위치
   */
  const update = (nextEquipment: Equipment) => {
    currentEquipment = nextEquipment;

    const shape = EQUIPMENT_SHAPE_MAP[nextEquipment.type];
    const color = STATUS_COLOR_MAP[nextEquipment.status];

    /**
     * 장비 타입에 따른 마커 모양 변경
     */
    markerElement.className = `equipment-marker equipment-marker--${shape}`;

    /**
     * 장비 상태에 따른 마커 색상 변경
     */
    markerElement.style.backgroundColor = color;

    /**
     * 장비 식별자 업데이트
     */
    markerElement.dataset.equipmentId = nextEquipment.id;

    /**
     * 접근성 및 마우스 hover 정보 업데이트
     */
    markerElement.setAttribute("aria-label", `${nextEquipment.name} 마커`);

    markerElement.title = nextEquipment.name;

    /**
     * 장비 위치 변경
     */
    overlay.setPosition(
      new kakao.maps.LatLng(nextEquipment.latitude, nextEquipment.longitude),
    );
  };

  const overlay = new kakao.maps.CustomOverlay({
    map,
    position: new kakao.maps.LatLng(equipment.latitude, equipment.longitude),
    content: markerElement,
    xAnchor: 0.5,
    yAnchor: 0.5,
    zIndex: 3,
    clickable: true,
  });

  update(equipment);

  /**
   * 마커 제거 및 이벤트 정리
   */
  const destroy = () => {
    markerElement.removeEventListener("click", handleClick);
    overlay.setMap(null);
  };

  return {
    overlay,
    markerElement,
    update,
    destroy,
  };
}
