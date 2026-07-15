/** Per-block sub-score row: label, colored bar, tabular score. */
export interface ScoreBarProps {
  label: string;
  score: number;
  /** Default 100. */
  max?: number;
  /** Small verdict summary under the number, e.g. "3·1·1·0". */
  counts?: string;
  style?: React.CSSProperties;
}
export declare function ScoreBar(props: ScoreBarProps): JSX.Element;
