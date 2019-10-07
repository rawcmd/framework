import { ANSI_CODES } from '../constants';

/**
 * Returns an array with opening and closing ANSI pairs that match the provided
 * `simbol` an `null` if the simbol does not match supported codes.
 * @param simbol Opening or closing ANSI character.
 */
export function findAnsiPairs(simbol: string) {
  const pairs = Object.values(ANSI_CODES).filter((pair) => pair.indexOf(simbol) !== -1);
  return pairs.length ? pairs : null;
}
