/** Tappable citation chip; hover reveals the actual rule text (serif) and links to the source. Every analytical claim carries one. */
export interface ProvenanceCiteProps {
  /** e.g. "Cal. Const. art. III, § 3" */
  cite: string;
  href?: string;
  /** Source text excerpt shown in the hover card. */
  quote?: string;
  style?: React.CSSProperties;
}
export declare function ProvenanceCite(props: ProvenanceCiteProps): JSX.Element;
