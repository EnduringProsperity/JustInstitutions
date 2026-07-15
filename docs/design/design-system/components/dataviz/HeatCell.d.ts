/** One cell of a block×layer (or jurisdiction×block) heat map. level 1 sound → 5 critical. */
export interface HeatCellProps {
  /** 1–5 on the --heat ramp. */
  level: 1 | 2 | 3 | 4 | 5;
  /** Tooltip text. */
  label?: string;
  /** Optional score rendered inside. */
  value?: string | number;
  size?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function HeatCell(props: HeatCellProps): JSX.Element;
