import { buildMatrix } from './model';

const DATA_URL = `${import.meta.env.BASE_URL}circular-flow/data/`;

// Fetch a file with byte-level progress. flow.bin.gz is a raw gzip file; some servers add a
// Content-Encoding header (the browser then already inflated it), others do not, so check
// the gzip magic bytes rather than assuming.
async function fetchBytes(name, onProgress) {
  const res = await fetch(DATA_URL + name);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress?.(received, total);
  }
  const blob = new Blob(chunks);
  const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  if (head[0] === 0x1f && head[1] === 0x8b) {
    return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  }
  return blob.arrayBuffer();
}

export async function loadCircularFlow(onProgress) {
  const [meta, geo, totals, buffer] = await Promise.all([
    fetch(`${DATA_URL}meta.json`).then(r => r.json()),
    fetch(`${DATA_URL}counties.json`).then(r => r.json()),
    fetch(`${DATA_URL}totals.json`).then(r => r.json()),
    fetchBytes('flow.bin.gz', onProgress),
  ]);
  const M = buildMatrix(buffer, meta.n, meta.quant);
  if (geo.features.length !== meta.n || geo.features.some((f, i) => f.id !== meta.fips[i])) {
    throw new Error('county boundaries and matrix are out of order');
  }
  if (meta.abroad.length !== meta.n || totals.store.length !== meta.n || totals.income.length !== meta.n) {
    throw new Error('county totals do not match the county list');
  }
  return { n: meta.n, fips: meta.fips, names: meta.names, tax: meta.tax, abroad: meta.abroad, geo, totals, M };
}
