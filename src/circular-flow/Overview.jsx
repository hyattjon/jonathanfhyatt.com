import { useMemo, useState } from 'react';
import CountyMap from './CountyMap';
import Legend from './Legend';
import { makeColorScale, readPalette } from './colorScale';
import { formatDollars, formatPercent, formatTick } from './format';
import { max, sum, topIndices } from './model';

const DECADES = 5; // the color scale spans this many powers of ten below its top
const TOP_COUNT = 10;
const BIG_COUNT = 100;

const MEASURES = {
  store: {
    label: 'Store counties: spending received',
    note: 'Where the spending lands: the counties whose businesses and workers are paid.',
    caption: 'Spending received by store counties, over all rounds',
  },
  income: {
    label: 'Households: income received',
    note: 'Where the spending ends up as household income, by county of residence.',
    caption: 'Household income received, over all rounds',
  },
};

// A static companion to the explorer: give every county the same amount to spend, run every
// round until it is taxed away, and add up what each county receives.
export default function Overview({ data }) {
  const { n, names, geo, totals } = data;
  const per = totals.per_county;
  const palette = useMemo(() => readPalette(), []);
  const [measure, setMeasure] = useState('store');

  const values = useMemo(() => Float64Array.from(totals[measure]), [totals, measure]);
  const top = max(values);
  const scale = useMemo(() => makeColorScale(palette, top / 10 ** DECADES, top), [palette, top]);
  const grand = sum(values);

  const leaders = topIndices(values, TOP_COUNT);
  const bigShare = useMemo(() => {
    const sorted = Array.from(values).sort((a, b) => b - a);
    return {
      top10: sum(sorted.slice(0, TOP_COUNT)) / grand,
      top100: sum(sorted.slice(0, BIG_COUNT)) / grand,
      below: sorted.filter(v => v < per).length,
    };
  }, [values, grand, per]);

  const describe = i => {
    const ratio = values[i] / per;
    return {
      title: names[i],
      rows: [
        ['Spending received by stores', formatDollars(totals.store[i])],
        ['Household income received', formatDollars(totals.income[i])],
        [`Versus the ${formatDollars(per)} it spends`, `${ratio.toFixed(ratio >= 10 ? 0 : 1)}×`],
      ],
    };
  };

  // Income tax and spending sent abroad are the other two places the handed-out money ends up
  // (besides continuing to circulate as store receipts / income) -- drawn as the same two Gulf of
  // Mexico circles as the explorer above, but as single fixed totals: this map has no rounds to
  // toggle between, it already sums every round for every starting county.
  const markers = [
    {
      id: 'tax', lon: -91.0, lat: 27.4, shortLabel: 'Tax', value: totals.tax_total,
      title: 'Income tax', rows: [['Paid, all starting counties, all rounds', formatDollars(totals.tax_total)]],
    },
    {
      id: 'abroad', lon: -87.8, lat: 26.9, shortLabel: 'Abroad', value: totals.abroad_total,
      title: 'Rest of world', rows: [['Spent abroad, all starting counties, all rounds', formatDollars(totals.abroad_total)]],
    },
  ];

  return (
    <section className="flow-overview" aria-labelledby="flow-overview-title">
      <header className="flow-intro">
        <p className="section__label">Every starting county</p>
        <h2 id="flow-overview-title" className="section__title">Which counties receive the most?</h2>
        <p className="flow-intro__lead">
          Give every county {formatDollars(per)} to spend and follow all of it, round after round, until
          it has all been taxed or spent abroad &mdash; {formatDollars(totals.tax_total)} and{' '}
          {formatDollars(totals.abroad_total)}, the two circles in the Gulf of Mexico. This map adds up
          what each county receives along the way, across all of those starting counties and all of the
          rounds: the {formatDollars(per * n)} handed out is received {formatDollars(grand)} worth of
          times in total, because the same money is received again each time it is spent.
        </p>
      </header>

      <fieldset className="flow-overview__toggle">
        <legend className="flow-overview__legend">Count dollars received by</legend>
        {Object.entries(MEASURES).map(([key, { label }]) => (
          <label key={key} className="flow-radio">
            <input type="radio" name="flow-measure" checked={measure === key} onChange={() => setMeasure(key)} />
            {label}
          </label>
        ))}
      </fieldset>
      <p className="flow-overview__note">{MEASURES[measure].note}</p>

      <div className="flow-layout">
        <div className="flow-stage">
          <CountyMap
            geo={geo}
            values={values}
            amount={1}
            colorScale={scale}
            describe={describe}
            markers={markers}
            label={`Map of U.S. counties shaded by ${MEASURES[measure].caption.toLowerCase()}, when every county is given ${formatDollars(per)} to spend. Two additional circles in the Gulf of Mexico show total income tax paid and total spending sent abroad.`}
          />
          <Legend
            scale={scale}
            caption={MEASURES[measure].caption}
            formatTick={formatTick}
            noneLabel={`Under ${formatDollars(scale.lo)}`}
          />
        </div>

        <aside className="flow-side" aria-label="Largest receivers">
          <dl className="flow-stats">
            <div>
              <dt>Top {TOP_COUNT} counties hold</dt>
              <dd>{formatPercent(bigShare.top10)}</dd>
            </div>
            <div>
              <dt>Top {BIG_COUNT} hold</dt>
              <dd>{formatPercent(bigShare.top100)}</dd>
            </div>
          </dl>
          <p className="flow-field__hint">
            {bigShare.below.toLocaleString('en-US')} of {n.toLocaleString('en-US')} counties receive less than
            the {formatDollars(per)} they spend.
          </p>

          <h3 className="flow-side__title">Top {TOP_COUNT} counties</h3>
          <table className="flow-table">
            <tbody>
              {leaders.map(i => (
                <tr key={i}>
                  <th scope="row">{names[i]}</th>
                  <td>{formatDollars(values[i])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
    </section>
  );
}
