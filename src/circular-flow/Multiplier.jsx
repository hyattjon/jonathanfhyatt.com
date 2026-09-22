import { useMemo } from 'react';
import CountyMap from './CountyMap';
import Legend from './Legend';
import { makeLinearScale, readPalette } from './colorScale';
import { formatPercent } from './format';
import { topIndices } from './model';

const LIST_COUNT = 8;
const times = v => `${v.toFixed(1)}×`;

// Static map of the income multiplier by *starting* county: the total household income generated,
// once every round is counted, per dollar given to consumers who live there. (The section above
// maps where dollars end up; this one maps where they start.)
export default function Multiplier({ data }) {
  const { names, geo, tax, totals } = data;
  const palette = useMemo(() => readPalette(), []);
  const values = useMemo(() => Float64Array.from(totals.multiplier), [totals]);

  const summary = useMemo(() => {
    const sorted = Array.from(values).sort((a, b) => a - b);
    const at = q => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
    return { min: sorted[0], max: sorted[sorted.length - 1], median: at(0.5), p5: at(0.05), p95: at(0.95) };
  }, [values]);
  const scale = useMemo(() => makeLinearScale(palette, summary.min, summary.max), [palette, summary]);

  const highest = topIndices(values, LIST_COUNT);
  const lowest = topIndices(Float64Array.from(values, v => -v), LIST_COUNT);

  const describe = i => ({
    title: names[i],
    rows: [
      ['Multiplier', `${values[i].toFixed(2)}×`],
      ['Avg tax rate where its income lands', formatPercent(totals.avg_tax_landing[i])],
      ['Lost abroad, all rounds', formatPercent(totals.abroad_lost[i])],
      ['Its own tax rate', formatPercent(tax[i])],
    ],
  });

  const list = indices => (
    <table className="flow-table">
      <tbody>
        {indices.map(i => (
          <tr key={i}>
            <th scope="row">{names[i]}</th>
            <td>{values[i].toFixed(2)}×</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className="flow-overview" aria-labelledby="flow-multiplier-title">
      <header className="flow-intro">
        <p className="section__label">Where a dollar starts</p>
        <h2 id="flow-multiplier-title" className="section__title">What is the multiplier?</h2>
        <p className="flow-intro__lead">
          Give one dollar to the consumers who live in a county. Once every round is counted, how much
          household income has it generated? That total is the county&rsquo;s multiplier. Every dollar
          is eventually taxed or spent abroad, so the multiplier is the share that is not lost abroad
          divided by the average tax rate where its income lands: counties whose spending lands in
          low-tax places score higher. This is a different question from the map above, which shows
          where dollars end up, not where they start.
        </p>
      </header>

      <div className="flow-layout">
        <div className="flow-stage">
          <CountyMap
            geo={geo}
            values={values}
            amount={1}
            colorScale={scale}
            describe={describe}
            label="Map of U.S. counties shaded by the income multiplier of a dollar given to consumers who live there."
          />
          <Legend scale={scale} caption="Multiplier: total income generated per $1 given" formatTick={times} />
        </div>

        <aside className="flow-side" aria-label="Multiplier summary">
          <dl className="flow-stats">
            <div>
              <dt>Median county</dt>
              <dd>{summary.median.toFixed(2)}×</dd>
            </div>
            <div>
              <dt>Range</dt>
              <dd>{summary.min.toFixed(1)}–{summary.max.toFixed(1)}×</dd>
            </div>
          </dl>
          <p className="flow-field__hint">
            Nine in ten counties fall between {summary.p5.toFixed(2)}× and {summary.p95.toFixed(2)}×, since
            most counties are taxed at broadly similar rates and lose little to spending abroad; the lowest
            multipliers belong to the handful of counties whose spending abroad is unusually large. With no
            saving or profit outflow, these are upper bounds, not forecasts.
          </p>

          <h3 className="flow-side__title">Highest multipliers</h3>
          {list(highest)}
          <h3 className="flow-side__title">Lowest multipliers</h3>
          {list(lowest)}
        </aside>
      </div>
    </section>
  );
}
