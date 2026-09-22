import { interpolateHcl, piecewise } from 'd3-interpolate';

const RAMP_TOKENS = ['--heat-1', '--heat-2', '--heat-3', '--heat-4'];
const LUT_SIZE = 256;

// The spectrum and the gray for "nothing here" are design tokens (variables.css), read once.
export function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const token = name => style.getPropertyValue(name).trim();
  return { ramp: RAMP_TOKENS.map(token), none: token('--color-data-none') };
}

function buildLut(ramp) {
  // Blend in HCL, not RGB: light blue -> yellow in RGB passes through a muddy gray-beige that
  // would read as the "none" gray; in HCL it goes through a clean teal-green.
  const interpolate = piecewise(interpolateHcl, ramp);
  return Array.from({ length: LUT_SIZE }, (_, k) => interpolate(k / (LUT_SIZE - 1)));
}

const lutColor = (lut, t) => lut[Math.max(0, Math.min(LUT_SIZE - 1, Math.round(t * (LUT_SIZE - 1))))];

// evenly spaced colors along the whole spectrum, for drawing the legend bar
const gradientOf = lut => steps =>
  Array.from({ length: steps }, (_, k) => lut[Math.round((k / (steps - 1)) * (LUT_SIZE - 1))]);

function powersOfTen(lo, hi) {
  const ticks = [];
  for (let e = Math.ceil(Math.log10(lo)); 10 ** e <= hi; e++) ticks.push(10 ** e);
  return ticks;
}

// Round tick values (1, 2 or 5 times a power of ten) covering roughly four steps across the range.
function niceTicks(lo, hi) {
  const raw = (hi - lo) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map(f => f * mag).filter(s => s <= raw).pop();
  const ticks = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) ticks.push(Number(v.toFixed(10)));
  return ticks;
}

// Log color scale: lo..hi map evenly onto the spectrum (dark blue = little, red = a lot). Anything
// below `lo` (including exactly zero) takes the gray, so counties with no spending stand out.
// Money spreads over several orders of magnitude, so a linear scale would leave nearly every
// county at the bottom of the spectrum.
export function makeColorScale({ ramp, none }, lo, hi) {
  const lut = buildLut(ramp);
  const a = Math.log10(lo);
  const span = Math.log10(hi) - a;
  const position = v => (Math.log10(v) - a) / span;

  return {
    lo,
    hi,
    ticks: powersOfTen(lo, hi),
    color: v => (v >= lo ? lutColor(lut, position(v)) : none),
    position,
    gradient: gradientOf(lut),
  };
}

// Linear color scale for a quantity that varies over a narrow range (the multiplier).
export function makeLinearScale({ ramp }, lo, hi) {
  const lut = buildLut(ramp);
  const position = v => (v - lo) / (hi - lo);

  return {
    lo,
    hi,
    ticks: niceTicks(lo, hi),
    color: v => lutColor(lut, position(v)),
    position,
    gradient: gradientOf(lut),
  };
}
