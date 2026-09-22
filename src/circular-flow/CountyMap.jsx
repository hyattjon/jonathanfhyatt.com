import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';

const VIEW_W = 960;
const VIEW_H = 600;
const PAD = 6;
const MARKER_RADIUS = 14;

// Project every county once. albersUsa places Alaska and Hawaii in insets under the lower 48.
// Also returns the projection itself, so callers can place non-county markers (e.g. the tax and
// rest-of-world "sinks", drawn as circles in the Gulf of Mexico) at real map coordinates.
function projectCounties(geo) {
  const projection = geoAlbersUsa().fitExtent([[PAD, PAD], [VIEW_W - PAD, VIEW_H - PAD]], geo);
  const path = geoPath(projection);
  return { paths: geo.features.map(feature => path(feature) || ''), projection };
}

// The 3,000+ county paths never re-render: colors are written straight onto the elements
// (see the layout effect below), so changing a round costs a loop, not a React render.
const CountyPaths = memo(function CountyPaths({ paths, pathRefs }) {
  return paths.map((d, i) => (
    d ? (
      <path
        key={i}
        ref={el => { pathRefs.current[i] = el; }}
        data-i={i}
        d={d}
        className="flow-map__county"
      />
    ) : null
  ));
});

// Sinks that aren't counties (income tax, spending sent abroad): drawn the same way a county is
// -- filled from the same color scale -- so they read as "just another place the money went",
// with a direct label since nothing else names them.
function Markers({ markers, projection, colorScale, amount }) {
  return markers.map(m => {
    const [x, y] = projection([m.lon, m.lat]);
    return (
      <g key={m.id} data-marker-id={m.id} transform={`translate(${x}, ${y})`}>
        <circle className="flow-map__marker" r={MARKER_RADIUS} fill={colorScale.color(m.value * amount)} />
        <text className="flow-map__marker-label" y={MARKER_RADIUS + 12}>{m.shortLabel}</text>
      </g>
    );
  });
}

// Selected / hovered county: a dark line over a white halo, legible on every color of the spectrum.
function Outline({ d, hover }) {
  return (
    <g className={`flow-map__outline${hover ? ' flow-map__outline--hover' : ''}`}>
      <path className="flow-map__halo" d={d} />
      <path className="flow-map__line" d={d} />
    </g>
  );
}

const indexOf = target => {
  const i = target?.dataset?.i;
  return i === undefined ? null : Number(i);
};
const markerIdOf = target => target?.dataset?.markerId ?? target?.parentElement?.dataset?.markerId ?? null;

// values: $1-scaled amount per county for the frame being shown; the color scale is in dollars.
// markers (optional): [{ id, lon, lat, value, shortLabel, title, rows }] -- non-county sinks drawn
// as circles at real map coordinates, colored and hoverable the same way counties are.
export default function CountyMap({ geo, values, amount, colorScale, selected = null, onSelect, describe, label, markers = [] }) {
  const { paths, projection } = useMemo(() => projectCounties(geo), [geo]);
  const pathRefs = useRef([]);
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null);

  useLayoutEffect(() => {
    const els = pathRefs.current;
    for (let i = 0; i < els.length; i++) {
      if (els[i]) els[i].style.fill = colorScale.color(values[i] * amount);
    }
  }, [values, amount, colorScale]);

  const onPointerMove = e => {
    const box = wrapRef.current.getBoundingClientRect();
    const at = { x: e.clientX - box.left, y: e.clientY - box.top, flip: e.clientX - box.left > box.width * 0.6 };
    const markerId = markerIdOf(e.target);
    if (markerId !== null) return setHover({ marker: markers.find(m => m.id === markerId), ...at });
    const i = indexOf(e.target);
    if (i === null) return setHover(null);
    setHover({ i, ...at });
  };

  const tip = hover && (hover.marker ?? describe(hover.i));

  return (
    <div className="flow-map" ref={wrapRef}>
      <svg
        className={`flow-map__svg${onSelect ? '' : ' flow-map__svg--static'}`}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={label}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
        onClick={onSelect ? e => { const i = indexOf(e.target); if (i !== null) onSelect(i); } : undefined}
      >
        <CountyPaths paths={paths} pathRefs={pathRefs} />
        {hover && hover.i !== undefined && hover.i !== selected && <Outline d={paths[hover.i]} hover />}
        {selected !== null && <Outline d={paths[selected]} />}
        <Markers markers={markers} projection={projection} colorScale={colorScale} amount={amount} />
      </svg>

      {tip && (
        <div
          className={`flow-map__tooltip${hover.flip ? ' flow-map__tooltip--flip' : ''}`}
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="flow-map__tooltip-title">{tip.title}</p>
          {tip.rows.map(([name, value]) => (
            <p key={name} className="flow-map__tooltip-row">
              <span>{name}</span>
              <span>{value}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
