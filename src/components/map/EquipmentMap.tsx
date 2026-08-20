import { useEffect, useRef } from "react";

import { createEquipmentMarker } from "./EquipmentMarker";
import { MapLegend } from "./MapLegend";
import "./map-marker.css";
import { createEquipmentInfoOverlay } from "./EquipmentInfoOverlay";

import type { Equipment } from "@/pages/web/MainPage/types";

interface EquipmentMapProps {
  equipments: Equipment[];
}

/**
 * 장비별 마커 인스턴스

 */
interface EquipmentMarkerEntry {
  marker: ReturnType<typeof createEquipmentMarker>;
}

/**
 * 장비 정보 팝업
 */
interface EquipmentInfoOverlay {
  overlay: kakao.maps.CustomOverlay;
  equipmentId: string;
}

export function EquipmentMap({ equipments }: EquipmentMapProps) {
  /**
   * 지도 DOM Container
   */
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Kakao Map 인스턴스
   *
   */
  const mapRef = useRef<kakao.maps.Map | null>(null);

  /**
   * 장비별 마커 관리
   */
  const markersRef = useRef<Map<string, EquipmentMarkerEntry>>(new Map());

  /**
   * 현재 활성화된 정보 팝업
   */
  const activeInfoOverlayRef = useRef<EquipmentInfoOverlay | null>(null);

  /**
   * 현재 선택된 장비 ID
   */
  const selectedEquipmentIdRef = useRef<string | null>(null);

  /**
   * Kakao Map 초기화
   */
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    if (!window.kakao?.maps) {
      console.error("카카오맵 SDK가 로드되지 않았습니다.");
      return;
    }

    const centerPosition = new kakao.maps.LatLng(35.5384, 129.3114);

    const map = new kakao.maps.Map(mapContainerRef.current, {
      center: centerPosition,
      level: 3,
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => {
        marker.destroy();
      });

      markersRef.current.clear();

      mapRef.current = null;
    };
  }, []);

  /**
   * 정보 팝업 닫기
   */
  const closeInfoOverlay = () => {
    activeInfoOverlayRef.current?.overlay.setMap(null);

    activeInfoOverlayRef.current = null;
    selectedEquipmentIdRef.current = null;
  };

  /**
   * 장비 마커 클릭 시 정보 팝업 표시
   */
  const handleMarkerClick = (clickedEquipment: Equipment) => {
    const selectedEquipmentId = selectedEquipmentIdRef.current;

    // 동일한 장비를 다시 클릭하면 팝업을 닫기
    if (selectedEquipmentId === clickedEquipment.id) {
      closeInfoOverlay();
      return;
    }

    closeInfoOverlay();

    const map = mapRef.current;

    if (!map) {
      return;
    }

    const content = createEquipmentInfoOverlay({
      equipment: clickedEquipment,
    });

    const infoOverlay = new kakao.maps.CustomOverlay({
      map,
      position: new kakao.maps.LatLng(
        clickedEquipment.latitude,
        clickedEquipment.longitude,
      ),
      content,
      xAnchor: 0.5,
      yAnchor: 1.08,
      zIndex: 20,
      clickable: true,
    });

    activeInfoOverlayRef.current = {
      overlay: infoOverlay,
      equipmentId: clickedEquipment.id,
    };

    selectedEquipmentIdRef.current = clickedEquipment.id;

    requestAnimationFrame(() => {
      const mapContainer = mapContainerRef.current;

      if (!mapContainer) {
        return;
      }

      const mapRect = mapContainer.getBoundingClientRect();

      const popupRect = content.getBoundingClientRect();

      const margin = 20;

      let moveX = 0;
      let moveY = 0;

      /**
       * 왼쪽 영역이 잘리는 경우
       */
      if (popupRect.left < mapRect.left + margin) {
        moveX = popupRect.left - (mapRect.left + margin);
      }

      /**
       * 오른쪽 영역이 잘리는 경우
       */
      if (popupRect.right > mapRect.right - margin) {
        moveX = popupRect.right - (mapRect.right - margin);
      }

      /**
       * 위쪽 영역이 잘리는 경우
       */
      if (popupRect.top < mapRect.top + margin) {
        moveY = popupRect.top - (mapRect.top + margin);
      }

      /**
       * 아래쪽 영역이 잘리는 경우
       */
      if (popupRect.bottom > mapRect.bottom - margin) {
        moveY = popupRect.bottom - (mapRect.bottom - margin);
      }

      if (moveX !== 0 || moveY !== 0) {
        map.panBy(moveX, moveY);
      }
    });
  };

  /**
   * equipments 변경에 따른 마커 동기화
   *
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const currentEquipmentIds = new Set(
      equipments.map((equipment) => equipment.id),
    );

    /**
     * 현재 API 데이터 기준으로 Marker 동기화
     */
    equipments.forEach((equipment) => {
      const existingEntry = markersRef.current.get(equipment.id);

      // 기존 장비
      if (existingEntry) {
        existingEntry.marker.update(equipment);

        return;
      }

      //신규 장비
      const marker = createEquipmentMarker({
        map,
        equipment,
        onClick: handleMarkerClick,
      });

      markersRef.current.set(equipment.id, {
        marker,
      });
    });

    /**
     * 데이터 없는 마커 제거
     */
    markersRef.current.forEach((entry, equipmentId) => {
      if (currentEquipmentIds.has(equipmentId)) {
        return;
      }

      if (selectedEquipmentIdRef.current === equipmentId) {
        closeInfoOverlay();
      }

      entry.marker.destroy();

      markersRef.current.delete(equipmentId);
    });
  }, [equipments]);

  /**
   * 지도 이벤트 및 문서 이벤트 등록
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    //지도 빈 공간 클릭
    const handleMapClick = () => {
      closeInfoOverlay();
    };

    kakao.maps.event.addListener(map, "click", handleMapClick);

    // 지도 외부 클릭
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const isMarkerClick = target.closest(".equipment-marker");

      const isInfoOverlayClick = target.closest(".equipment-info-overlay");

      if (isMarkerClick || isInfoOverlayClick) {
        return;
      }

      closeInfoOverlay();
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);

    /**
     * 이벤트 정리
     */
    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);

      document.removeEventListener("pointerdown", handleDocumentPointerDown);
    };
  }, []);

  return (
    <div className="equipment-map">
      <div ref={mapContainerRef} className="equipment-map__container" />

      <MapLegend />
    </div>
  );
}
