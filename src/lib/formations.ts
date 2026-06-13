export type FormationSlot = {
  label: string;
  x: number; // 0-100, left to right
  y: number; // 0-100, 0 = opponent goal, 100 = own goal
};

const LINE = (xs: number[], y: number, label: string): FormationSlot[] =>
  xs.map((x) => ({ label, x, y }));

export const FORMATIONS: Record<string, FormationSlot[]> = {
  "4-4-2": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([12, 37, 63, 88], 75, "DEF"),
    ...LINE([12, 37, 63, 88], 50, "MIL"),
    ...LINE([35, 65], 22, "ATT"),
  ],
  "4-3-3": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([12, 37, 63, 88], 75, "DEF"),
    ...LINE([25, 50, 75], 50, "MIL"),
    ...LINE([15, 50, 85], 22, "ATT"),
  ],
  "3-5-2": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([25, 50, 75], 75, "DEF"),
    ...LINE([8, 29, 50, 71, 92], 50, "MIL"),
    ...LINE([35, 65], 22, "ATT"),
  ],
  "4-2-3-1": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([12, 37, 63, 88], 78, "DEF"),
    ...LINE([35, 65], 58, "MDC"),
    ...LINE([15, 50, 85], 36, "MOC"),
    ...LINE([50], 14, "ATT"),
  ],
  "3-4-3": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([25, 50, 75], 78, "DEF"),
    ...LINE([10, 37, 63, 90], 52, "MIL"),
    ...LINE([15, 50, 85], 22, "ATT"),
  ],
  "5-3-2": [
    { label: "GB", x: 50, y: 92 },
    ...LINE([6, 27, 50, 73, 94], 75, "DEF"),
    ...LINE([25, 50, 75], 48, "MIL"),
    ...LINE([35, 65], 20, "ATT"),
  ],
};

export const FORMATION_NAMES = Object.keys(FORMATIONS);

export function getFormationSlots(formation: string): FormationSlot[] {
  return FORMATIONS[formation] ?? FORMATIONS["4-4-2"];
}

export const POSITION_OPTIONS = [
  "Gardien",
  "Défenseur central",
  "Latéral droit",
  "Latéral gauche",
  "Milieu défensif",
  "Milieu central",
  "Milieu offensif",
  "Ailier droit",
  "Ailier gauche",
  "Attaquant",
];
