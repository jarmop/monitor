export type Status = Record<string, string>;

export const possibleStates = [
  "R (running)",
  "I (idle)",
  "S (sleeping)",
  "D (disk sleep)",
] as const;

export type State = typeof possibleStates[number];
