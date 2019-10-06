import * as wcwidth2 from '@slimio/wcwidth';

export function wcwidth(str: string) {
  return wcwidth2(str);
}

export * from './types';
export * from './constants';
export * from './helpers/align-text';
export * from './helpers/has-ansi';
export * from './helpers/find-ansi-pairs';
export * from './helpers/repair-ansi';
export * from './helpers/split-ansi';
export * from './helpers/strip-ansi';
export * from './helpers/truncate-text';
export * from './helpers/wrap-text';
