// Share-only county circular flow (browser port of models/simple_circular_flow in usa-dea-jhyatt).
//
// Money is injected as *spending* in one county. Each round:
//   0. a share a_c of county c's spending goes abroad and never returns (a sink); the rest is
//      spent domestically
//   1. domestic spending -> producers (spending shares) -> household income by county of
//      residence (income shares); the composed county-to-county matrix is M, every row sums to 1
//   2. income landing in county c is taxed at tau_c
//   3. the untaxed remainder is spent again
// Everything is per $1; the UI scales by the chosen amount, since the model is linear.

export const ROUNDS = 30;

// Decode the 12-bit log-quantized matrix into a dense Float32Array (row = county where the
// money is spent, column = county where it lands). Rows are renormalized to sum to exactly 1,
// so every round conserves the injected amount. Assumes a little-endian platform.
export function buildMatrix(buffer, n, { lo, hi, levels }) {
  const q = new Uint16Array(buffer);
  if (q.length !== n * n) throw new Error(`matrix has ${q.length} entries, expected ${n * n}`);

  const lut = new Float32Array(levels + 2);
  for (let k = 1; k <= levels + 1; k++) lut[k] = 10 ** (lo + ((k - 1) / levels) * (hi - lo));

  const M = new Float32Array(n * n);
  for (let i = 0; i < n; i++) {
    const row = i * n;
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const v = lut[q[row + j]];
      M[row + j] = v;
      sum += v;
    }
    const inv = 1 / sum;
    for (let j = 0; j < n; j++) M[row + j] *= inv;
  }
  return M;
}

// Follow $1 of spending injected in county `start`. frames[k] describes round k:
//   landed          household income landing in each county in round k (round 0: the injection itself)
//   cumulative      income landed through round k
//   circulating     $ still being spent after round k
//   taxed / abroad         cumulative income tax paid / spending sent abroad, through round k
//   taxedRound / abroadRound   the same two, for round k alone (both 0 at round 0)
// circulating + taxed + abroad = 1 in every round. `abroad[i]` is the share of county i's
// spending that goes abroad (omit for none).
export function runFlow(M, n, tax, start, { useTax = true, rounds = ROUNDS, abroad = null } = {}) {
  let x = new Float64Array(n);
  x[start] = 1;
  const injected = Float64Array.from(x);
  const cumulative = new Float64Array(n);
  const frames = [{
    landed: injected, cumulative: Float64Array.from(cumulative), circulating: 1,
    taxed: 0, abroad: 0, taxedRound: 0, abroadRound: 0,
  }];
  let taxedTotal = 0;
  let abroadTotal = 0;

  for (let k = 1; k <= rounds; k++) {
    const y = new Float64Array(n);
    let abroadRound = 0;
    for (let i = 0; i < n; i++) {
      const xi = x[i];
      if (xi < 1e-13) continue; // negligible mass; keeps the sparse first rounds cheap
      const lost = abroad ? xi * abroad[i] : 0;
      abroadRound += lost;
      const domestic = xi - lost;
      const row = i * n;
      for (let j = 0; j < n; j++) y[j] += domestic * M[row + j];
    }
    abroadTotal += abroadRound;
    const next = new Float64Array(n);
    let circulating = 0;
    let taxedRound = 0;
    for (let j = 0; j < n; j++) {
      const t = useTax ? y[j] * tax[j] : 0;
      taxedRound += t;
      next[j] = y[j] - t;
      circulating += next[j];
      cumulative[j] += y[j];
    }
    taxedTotal += taxedRound;
    x = next;
    frames.push({
      landed: y, cumulative: Float64Array.from(cumulative), circulating,
      taxed: taxedTotal, abroad: abroadTotal, taxedRound, abroadRound,
    });
  }
  return frames;
}

export function sum(values) {
  let s = 0;
  for (let i = 0; i < values.length; i++) s += values[i];
  return s;
}

export function max(values) {
  let m = 0;
  for (let i = 0; i < values.length; i++) if (values[i] > m) m = values[i];
  return m;
}

// Indices of the `count` largest values, descending.
export function topIndices(values, count) {
  const top = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (top.length === count && v <= values[top[count - 1]]) continue;
    let p = top.length < count ? top.length : count - 1;
    if (top.length < count) top.push(i);
    else top[p] = i;
    while (p > 0 && values[top[p]] > values[top[p - 1]]) {
      [top[p], top[p - 1]] = [top[p - 1], top[p]];
      p--;
    }
  }
  return top;
}
