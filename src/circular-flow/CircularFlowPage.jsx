import { useEffect, useMemo, useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import CountyMap from './CountyMap';
import Legend from './Legend';
import Overview from './Overview';
import Multiplier from './Multiplier';
import { loadCircularFlow } from './data';
import { ROUNDS, max, runFlow, sum, topIndices } from './model';
import { makeColorScale, readPalette } from './colorScale';
import { formatDollars, formatPercent, formatTick } from './format';

const DEFAULT_COUNTY = '17031'; // Cook County, IL
const DECADES = 4; // the color scale spans this many powers of ten below its top
const PRESETS = [100, 10_000, 1_000_000];
const SPEEDS = { Slow: 1400, Normal: 800, Fast: 350 };
const TOP_COUNT = 8;

function Intro() {
  return (
    <header className="flow-intro">
      <p className="section__label">Interactive</p>
      <h1 className="section__title">Where does local spending go?</h1>
      <p className="flow-intro__lead">
        Spend an amount in any U.S. county and follow it round by round. The spending becomes revenue
        for producers in the counties where residents shop, then household income in the counties where
        those producers&rsquo; workers live. After income tax, the rest is spent again, except for the
        small share that goes abroad and never comes back.
      </p>
      <details className="flow-notes">
        <summary>How it works, and what it leaves out</summary>
        <ul>
          <li>
            The model is built only from shares: for every county, the share of its residents&rsquo;
            spending that lands in each county (2025), and the share of the labor income earned in each
            county that goes to residents of each county, from commuting flows (2021). The dollar
            amount you choose only scales the result.
          </li>
          <li>
            There are two leaks. Income tax is taken at each county&rsquo;s average rate: federal income tax
            over adjusted gross income, plus state and local tax at the state level. Spending abroad uses
            each county&rsquo;s observed pattern of card spending sent to foreign merchants, scaled so the
            national total matches BEA&rsquo;s own benchmark for what U.S. residents spend abroad (about
            1.1% of domestic spending, 2022); the domestic shares are rescaled to make room for it, and it
            never returns. There is no saving and no profit outflow, so the total income one dollar
            generates (about 5.3 dollars for the median county) is an upper bound, not a forecast. Tax
            revenue is not spent again.
          </li>
          <li>
            Coverage is the 50 states and DC (3,142 counties; Kalawao County, HI has no workplace
            employment in the commuting data). Connecticut uses its eight pre-2022 counties, with tax
            rates mapped from the planning regions.
          </li>
        </ul>
      </details>
    </header>
  );
}

function Status({ load, retry }) {
  if (load.status === 'error') {
    return (
      <div className="flow-status" role="alert">
        <p>The county data could not be loaded ({load.error.message}).</p>
        <button className="flow-btn" onClick={retry}>Try again</button>
      </div>
    );
  }
  const pct = load.progress === null ? null : Math.round(load.progress * 100);
  return (
    <div className="flow-status" role="status">
      <p>Loading county data (about 15 MB, cached after the first visit){pct === null ? '…' : `… ${pct}%`}</p>
      <progress value={pct ?? undefined} max="100" />
    </div>
  );
}

function Explorer({ data }) {
  const { n, fips, names, tax, abroad, geo, M } = data;
  const palette = useMemo(() => readPalette(), []);
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const nameIndex = useMemo(() => new Map(names.map((name, i) => [name, i])), [names]);

  const [start, setStart] = useState(() => Math.max(0, fips.indexOf(DEFAULT_COUNTY)));
  const [query, setQuery] = useState(names[start]);
  const [amount, setAmount] = useState(1_000_000);
  const [amountText, setAmountText] = useState('1000000');
  const [useTax, setUseTax] = useState(true);
  const [view, setView] = useState('round');
  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(!reduceMotion);
  const [speed, setSpeed] = useState('Normal');

  const frames = useMemo(() => runFlow(M, n, tax, start, { useTax, abroad }), [M, n, tax, abroad, start, useTax]);

  // Playback stops by itself once the last round is reached.
  const isPlaying = playing && round < ROUNDS;
  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => setRound(r => Math.min(ROUNDS, r + 1)), SPEEDS[speed]);
    return () => clearInterval(id);
  }, [isPlaying, speed]);

  const choose = i => {
    setStart(i);
    setQuery(names[i]);
    setRound(0);
    setPlaying(!reduceMotion);
  };
  const onQuery = value => {
    setQuery(value);
    const i = nameIndex.get(value);
    if (i !== undefined && i !== start) choose(i);
  };
  const setAmountValue = text => {
    setAmountText(text);
    const value = Number(text);
    if (Number.isFinite(value) && value > 0) setAmount(value);
  };

  // The color scale is anchored to one frame so colors mean the same dollars in every round:
  // the first round's largest county (this-round view) or the final cumulative maximum.
  const top = useMemo(
    () => (view === 'round' ? max(frames[1].landed) : max(frames[ROUNDS].cumulative)),
    [frames, view],
  );
  const scale = useMemo(
    () => makeColorScale(palette, (top * amount) / 10 ** DECADES, top * amount),
    [palette, top, amount],
  );

  const frame = frames[round];
  const values = view === 'round' ? frame.landed : frame.cumulative;
  const place = names[start];
  const stateCode = fips[start].slice(0, 2);
  const stateName = place.split(', ').pop();

  const totalLanded = sum(values);
  let inState = 0;
  for (let j = 0; j < n; j++) if (fips[j].slice(0, 2) === stateCode) inState += values[j];
  const ownCounty = values[start];
  const rows = [
    [`${place}`, ownCounty],
    [`Rest of ${stateName}`, inState - ownCounty],
    ['Other states', totalLanded - inState],
  ];
  const leaders = topIndices(values, TOP_COUNT);

  const viewLabel = view === 'round' ? 'Household income landing this round' : 'Household income landed through this round';
  const heading = round === 0
    ? `${formatDollars(amount)} is spent in ${place}`
    : view === 'round'
      ? `Round ${round}: where the income lands`
      : `Through round ${round}: income landed so far`;

  const describe = i => ({
    title: names[i],
    rows: [
      [round === 0 ? 'Spending injected' : 'Income this round',
        `${formatDollars(frame.landed[i] * amount)} (${formatPercent(frame.landed[i])})`],
      ['Cumulative income', formatDollars(frame.cumulative[i] * amount)],
      ['Income tax rate', `${(tax[i] * 100).toFixed(1)}%`],
    ],
  });

  // Income tax and spending sent abroad are sinks, not counties -- drawn as two circles in the
  // Gulf of Mexico, colored by the same scale as every county, so they read as "just another
  // place the money went" rather than a separate chart. Follows the same this-round/cumulative
  // toggle as the county colors: taxedRound/abroadRound are round k alone, taxed/abroad cumulative.
  const taxValue = view === 'round' ? frame.taxedRound : frame.taxed;
  const abroadValue = view === 'round' ? frame.abroadRound : frame.abroad;
  const markers = [
    {
      id: 'tax', lon: -91.0, lat: 27.4, shortLabel: 'Tax', value: taxValue,
      title: 'Income tax', rows: [[view === 'round' ? 'Paid this round' : 'Paid through this round',
        `${formatDollars(taxValue * amount)} (${formatPercent(taxValue)})`]],
    },
    {
      id: 'abroad', lon: -87.8, lat: 26.9, shortLabel: 'Abroad', value: abroadValue,
      title: 'Rest of world', rows: [[view === 'round' ? 'Spent abroad this round' : 'Spent abroad through this round',
        `${formatDollars(abroadValue * amount)} (${formatPercent(abroadValue)})`]],
    },
  ];

  const togglePlay = () => {
    if (round >= ROUNDS) {
      setRound(0);
      setPlaying(true);
    } else setPlaying(!isPlaying);
  };
  const stepTo = r => {
    setPlaying(false);
    setRound(Math.max(0, Math.min(ROUNDS, r)));
  };

  return (
    <>
      <section className="flow-controls" aria-label="Controls">
        <div className="flow-field">
          <label htmlFor="flow-county">County</label>
          <input
            id="flow-county"
            list="flow-counties"
            value={query}
            onChange={e => onQuery(e.target.value)}
            onFocus={e => e.target.select()}
            autoComplete="off"
            spellCheck="false"
          />
          <datalist id="flow-counties">
            {names.map(name => <option key={name} value={name} />)}
          </datalist>
          <p className="flow-field__hint">Type a county, or click one on the map.</p>
        </div>

        <div className="flow-field">
          <label htmlFor="flow-amount">Amount spent ($)</label>
          <input
            id="flow-amount"
            type="number"
            min="1"
            step="any"
            inputMode="decimal"
            value={amountText}
            onChange={e => setAmountValue(e.target.value)}
          />
          <div className="flow-chips">
            {PRESETS.map(p => (
              <button
                key={p}
                type="button"
                className={`flow-chip${amount === p ? ' flow-chip--on' : ''}`}
                onClick={() => setAmountValue(String(p))}
              >
                {formatTick(p)}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="flow-field flow-field--group">
          <legend>Map shows</legend>
          {[['round', 'This round'], ['cumulative', 'Cumulative']].map(([value, text]) => (
            <label key={value} className="flow-radio">
              <input type="radio" name="flow-view" checked={view === value} onChange={() => setView(value)} />
              {text}
            </label>
          ))}
          <label className="flow-radio flow-radio--gap">
            <input type="checkbox" checked={useTax} onChange={e => setUseTax(e.target.checked)} />
            Income tax leak
          </label>
        </fieldset>
      </section>

      <div className="flow-layout">
        <div className="flow-stage">
          <h2 className="flow-stage__title" aria-live="polite">{heading}</h2>
          <CountyMap
            geo={geo}
            values={values}
            amount={amount}
            colorScale={scale}
            selected={start}
            onSelect={choose}
            describe={describe}
            markers={markers}
            label={`Map of U.S. counties shaded by ${viewLabel.toLowerCase()}, after ${formatDollars(amount)} is spent in ${place}. Two additional circles in the Gulf of Mexico show income tax paid and spending sent abroad.`}
          />
          <Legend
            scale={scale}
            caption={round === 0 ? 'Spending injected' : viewLabel}
            formatTick={formatTick}
            noneLabel={`Under ${formatDollars(scale.lo)}`}
          />

          <div className="flow-player">
            <button type="button" className="flow-btn" onClick={togglePlay}>
              {isPlaying ? 'Pause' : round >= ROUNDS ? 'Replay' : 'Play'}
            </button>
            <button type="button" className="flow-btn flow-btn--quiet" onClick={() => stepTo(round - 1)} disabled={round === 0}>
              Back
            </button>
            <button type="button" className="flow-btn flow-btn--quiet" onClick={() => stepTo(round + 1)} disabled={round === ROUNDS}>
              Next
            </button>
            <label className="flow-player__slider">
              <span>Round {round} of {ROUNDS}</span>
              <input
                type="range"
                min="0"
                max={ROUNDS}
                value={round}
                onChange={e => stepTo(Number(e.target.value))}
              />
            </label>
            <label className="flow-player__speed">
              <span>Speed</span>
              <select value={speed} onChange={e => setSpeed(e.target.value)}>
                {Object.keys(SPEEDS).map(name => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
        </div>

        <aside className="flow-side" aria-label="Round summary">
          <dl className="flow-stats">
            <div>
              <dt>Still being spent</dt>
              <dd>{formatDollars(frame.circulating * amount)}</dd>
            </div>
            <div>
              <dt>Paid as income tax</dt>
              <dd>{formatDollars(frame.taxed * amount)}</dd>
            </div>
            <div>
              <dt>Spent abroad</dt>
              <dd>{formatDollars(frame.abroad * amount)}</dd>
            </div>
          </dl>

          <h3 className="flow-side__title">{round === 0 ? 'Where it starts' : 'Where it lands'}</h3>
          <table className="flow-table">
            <tbody>
              {rows.map(([name, v]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{formatDollars(v * amount)}</td>
                  <td>{formatPercent(totalLanded ? v / totalLanded : 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="flow-side__title">Top {TOP_COUNT} counties</h3>
          <table className="flow-table">
            <tbody>
              {leaders.map(i => (
                <tr key={i}>
                  <th scope="row">
                    <button type="button" className="flow-link" onClick={() => choose(i)}>{names[i]}</button>
                  </th>
                  <td>{formatDollars(values[i] * amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
    </>
  );
}

export default function CircularFlowPage() {
  const [load, setLoad] = useState({ status: 'loading', progress: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadCircularFlow((received, total) => {
      if (!cancelled) setLoad({ status: 'loading', progress: total ? Math.min(1, received / total) : null });
    })
      .then(data => { if (!cancelled) setLoad({ status: 'ready', data }); })
      .catch(error => { if (!cancelled) setLoad({ status: 'error', error }); });
    return () => { cancelled = true; };
  }, [attempt]);

  const retry = () => {
    setLoad({ status: 'loading', progress: null });
    setAttempt(a => a + 1);
  };

  return (
    <>
      <Nav onHomePage={false} />
      <main className="page flow-page">
        <Intro />
        {load.status === 'ready' ? (
          <>
            <Explorer data={load.data} />
            <Overview data={load.data} />
            <Multiplier data={load.data} />
          </>
        ) : <Status load={load} retry={retry} />}
      </main>
      <Footer />
    </>
  );
}
