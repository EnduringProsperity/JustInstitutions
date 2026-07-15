/** Attribution confidence band C0–C3 as a signal-bar pill. Tooltip carries the band-locked phrase; there is deliberately no "proven" band. */
export interface ConfidencePillProps {
  /** 0 Gap · 1 Association · 2 Supported · 3 Strong */
  band: 0 | 1 | 2 | 3;
  /** false = compact "C2" only. */
  showName?: boolean;
  style?: React.CSSProperties;
}
export declare function ConfidencePill(props: ConfidencePillProps): JSX.Element;
