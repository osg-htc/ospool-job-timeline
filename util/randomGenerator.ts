/**
 * Mulberry32 seeded pseudo-random number generator.
 * @param seed - The initial seed value.
 * @returns A function that returns the next pseudo-random number in [0, 1).
 */
function randomGenerator(seed: number = 98492347) {
  return function () {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default randomGenerator;
