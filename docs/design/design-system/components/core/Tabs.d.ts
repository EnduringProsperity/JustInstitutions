/** Underline tabs — the three results views (Test Report / Vulnerability Explorer / Rollup) and the four KPI views. */
export interface TabsProps {
  tabs?: (string | { id: string; label: string; count?: number })[];
  active?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
