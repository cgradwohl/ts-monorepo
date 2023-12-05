import { isEven } from '@ts-monorepo/is-even';

export function isOdd(x: number): boolean {
  return !isEven(x);
}
