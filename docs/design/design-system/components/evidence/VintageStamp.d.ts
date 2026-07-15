/** Data vintage stamp — corpus version, "law as of", KPI year. Every view carries one; honesty is the brand. */
export interface VintageStampProps {
  /** e.g. "v41" */
  corpus?: string;
  /** ISO date, e.g. "2026-05-01" */
  asOf?: string;
  /** e.g. "2024" */
  kpiYear?: string;
  refreshHref?: string;
  style?: React.CSSProperties;
}
export declare function VintageStamp(props: VintageStampProps): JSX.Element;
