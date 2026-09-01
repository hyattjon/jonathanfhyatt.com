import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// World Bank US CPI — CORS-enabled, no API key required
const URL = 'https://api.worldbank.org/v2/country/US/indicator/FP.CPI.TOTL?format=json&mrv=15&per_page=15';
const SERIES_LABEL = 'U.S. Consumer Price Index (2010 = 100)';
const SOURCE_HREF = 'https://data.worldbank.org/indicator/FP.CPI.TOTL?locations=US';

function parseWorldBank(json) {
  if (!Array.isArray(json) || !Array.isArray(json[1])) return [];
  return json[1]
    .filter(d => d.value !== null)
    .map(d => ({ date: d.date, value: Math.round(d.value * 10) / 10 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__date">{label}</p>
      <p className="chart-tooltip__value">{payload[0].value}</p>
    </div>
  );
}

export default function FredChart() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(URL)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(json => {
        const parsed = parseWorldBank(json);
        if (!parsed.length) throw new Error();
        setData(parsed);
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'error') return null;

  return (
    <div className="home__chart">
      <div className="home__chart-header">
        <span className="home__chart-title">{SERIES_LABEL}</span>
        <a className="home__chart-source" href={SOURCE_HREF} target="_blank" rel="noreferrer">
          World Bank &rarr;
        </a>
      </div>

      {status === 'loading' ? (
        <div className="home__chart-skeleton" />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: 'var(--color-accent)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
