// Continuous legend for a color scale: the spectrum, tick labels, and (when the scale has a floor)
// the gray swatch for counties under it. `noneLabel` is omitted for scales without a floor.
export default function Legend({ scale, caption, formatTick, noneLabel }) {
  return (
    <div className="flow-legend">
      <p className="flow-legend__caption">{caption}</p>
      <div className="flow-legend__row">
        {noneLabel && (
          <span className="flow-legend__none">
            <span className="flow-legend__swatch" />
            {noneLabel}
          </span>
        )}
        <div className="flow-legend__scale">
          <div
            className="flow-legend__ramp"
            style={{ background: `linear-gradient(to right, ${scale.gradient(32).join(', ')})` }}
          />
          <div className="flow-legend__ticks" aria-hidden="true">
            {scale.ticks.map(v => (
              <span key={v} className="flow-legend__tick" style={{ left: `${scale.position(v) * 100}%` }}>
                {formatTick(v)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
