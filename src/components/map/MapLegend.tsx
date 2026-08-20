import {
  EQUIPMENT_SHAPE_MAP,
  EQUIPMENT_TYPE_LABEL_MAP,
  EQUIPMENT_TYPE_LIST,
  STATUS_COLOR_MAP,
  STATUS_LABEL_MAP,
  STATUS_LIST,
} from "./marker.constants";

export function MapLegend() {
  return (
    <aside className="map-legend">
      <section className="map-legend__section">
        <h3 className="map-legend__title">장비</h3>

        <ul className="map-legend__list">
          {EQUIPMENT_TYPE_LIST.map((type) => {
            const shape = EQUIPMENT_SHAPE_MAP[type];

            return (
              <li key={type} className="map-legend__item">
                <span
                  className={[
                    "map-legend__marker",
                    `map-legend__marker--${shape}`,
                  ].join(" ")}
                />

                <span>{EQUIPMENT_TYPE_LABEL_MAP[type]}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="map-legend__section">
        <h3 className="map-legend__title">상태</h3>

        <ul className="map-legend__list">
          {STATUS_LIST.map((status) => (
            <li key={status} className="map-legend__item">
              <span
                className="map-legend__status"
                style={
                  {
                    "--marker-color": STATUS_COLOR_MAP[status],
                  } as React.CSSProperties
                }
              />

              <span>{STATUS_LABEL_MAP[status]}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
