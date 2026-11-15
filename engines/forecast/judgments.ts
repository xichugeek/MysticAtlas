/** MysticAtlas-authored symbolic judgments, not an ancient yes/no table or a factual model. */
export type Disposition =
  | 'favorable'
  | 'conditional'
  | 'delayed'
  | 'blocked'
  | 'stable'
  | 'unclear';
export const SYMBOLIC_JUDGMENTS: readonly { id: number; disposition: Disposition }[] = [
  { id: 1, disposition: 'favorable' },
  { id: 2, disposition: 'conditional' },
  { id: 3, disposition: 'delayed' },
  { id: 4, disposition: 'unclear' },
  { id: 5, disposition: 'delayed' },
  { id: 6, disposition: 'blocked' },
  { id: 7, disposition: 'conditional' },
  { id: 8, disposition: 'favorable' },
  { id: 9, disposition: 'delayed' },
  { id: 10, disposition: 'conditional' },
  { id: 11, disposition: 'favorable' },
  { id: 12, disposition: 'blocked' },
  { id: 13, disposition: 'favorable' },
  { id: 14, disposition: 'favorable' },
  { id: 15, disposition: 'favorable' },
  { id: 16, disposition: 'favorable' },
  { id: 17, disposition: 'conditional' },
  { id: 18, disposition: 'delayed' },
  { id: 19, disposition: 'favorable' },
  { id: 20, disposition: 'unclear' },
  { id: 21, disposition: 'conditional' },
  { id: 22, disposition: 'conditional' },
  { id: 23, disposition: 'blocked' },
  { id: 24, disposition: 'favorable' },
  { id: 25, disposition: 'conditional' },
  { id: 26, disposition: 'delayed' },
  { id: 27, disposition: 'conditional' },
  { id: 28, disposition: 'blocked' },
  { id: 29, disposition: 'blocked' },
  { id: 30, disposition: 'conditional' },
  { id: 31, disposition: 'favorable' },
  { id: 32, disposition: 'stable' },
  { id: 33, disposition: 'blocked' },
  { id: 34, disposition: 'conditional' },
  { id: 35, disposition: 'favorable' },
  { id: 36, disposition: 'blocked' },
  { id: 37, disposition: 'stable' },
  { id: 38, disposition: 'blocked' },
  { id: 39, disposition: 'blocked' },
  { id: 40, disposition: 'favorable' },
  { id: 41, disposition: 'conditional' },
  { id: 42, disposition: 'favorable' },
  { id: 43, disposition: 'conditional' },
  { id: 44, disposition: 'conditional' },
  { id: 45, disposition: 'favorable' },
  { id: 46, disposition: 'favorable' },
  { id: 47, disposition: 'blocked' },
  { id: 48, disposition: 'stable' },
  { id: 49, disposition: 'conditional' },
  { id: 50, disposition: 'favorable' },
  { id: 51, disposition: 'unclear' },
  { id: 52, disposition: 'stable' },
  { id: 53, disposition: 'delayed' },
  { id: 54, disposition: 'conditional' },
  { id: 55, disposition: 'favorable' },
  { id: 56, disposition: 'conditional' },
  { id: 57, disposition: 'delayed' },
  { id: 58, disposition: 'favorable' },
  { id: 59, disposition: 'favorable' },
  { id: 60, disposition: 'conditional' },
  { id: 61, disposition: 'favorable' },
  { id: 62, disposition: 'conditional' },
  { id: 63, disposition: 'stable' },
  { id: 64, disposition: 'delayed' },
];
export function dispositionOf(id: number): Disposition {
  const record = SYMBOLIC_JUDGMENTS.find((r) => r.id === id);
  if (!record) throw new RangeError('Unknown symbolic judgment');
  return record.disposition;
}
