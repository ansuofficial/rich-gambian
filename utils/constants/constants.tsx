export const GAMBIA_GDP = 159700000000;

export { SITE_URL } from "@/lib/seo";

export const SHARE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_SHARE !== "false";

export const COLORS = [
  "var(--gambia-red)",
  "var(--gambia-blue)",
  "var(--gambia-green)",
  "#F4A261",
  "#E76F51",
];

export const CHART_COLORS_LIGHT = [
  "#CE1126",
  "#0C1C8C",
  "#3A7728",
  "#F4A261",
  "#E76F51",
];

export const CHART_COLORS_DARK = [
  "#E63946",
  "#457B9D",
  "#2A9D8F",
  "#F4A261",
  "#E76F51",
];

export const RECEIPT_CAPTURE_COLORS = {
  background: "#FAFAF8",
  headerBg: "#0C1C8C",
  headerText: "#FFFFFF",
  bodyText: "#18181B",
  mutedText: "#71717A",
  accentRed: "#CE1126",
  accentGreen: "#3A7728",
  border: "#E4E4E7",
  progressTrack: "#E4E4E7",
  progressFill: "#CE1126",
} as const;