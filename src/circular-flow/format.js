// Dollar formatting for tooltips, stats and legend ticks.

export function formatDollars(v) {
  const a = Math.abs(v);
  if (a === 0) return '$0';
  // thresholds sit just under each power so rounding never prints "$1000.0K"
  if (a >= 999_950_000) return `$${(v / 1e9).toFixed(2)}B`;
  if (a >= 999_950) return `$${(v / 1e6).toFixed(2)}M`;
  if (a >= 1e4) return `$${(v / 1e3).toFixed(1)}K`;
  if (a >= 100) return `$${Math.round(v).toLocaleString('en-US')}`;
  if (a >= 1) return `$${v.toFixed(2)}`;
  if (a >= 0.01) return `$${v.toFixed(2)}`;
  return '<$0.01';
}

// Short label for a legend tick that sits on a power of ten.
export function formatTick(v) {
  if (v >= 1e9) return `$${v / 1e9}B`;
  if (v >= 1e6) return `$${v / 1e6}M`;
  if (v >= 1e3) return `$${v / 1e3}K`;
  if (v >= 1) return `$${v}`;
  return `$${v.toFixed(2)}`;
}

export function formatPercent(fraction) {
  const p = fraction * 100;
  if (p >= 10) return `${p.toFixed(0)}%`;
  if (p >= 1) return `${p.toFixed(1)}%`;
  if (p >= 0.01) return `${p.toFixed(2)}%`;
  return '<0.01%';
}
