/** Mandatory marker on AI-generated patch/legislation language (NFR-04). Dashed border = provisional. */
export interface AIMarkProps {
  /** Short "AI-drafted" form for tight rows. */
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function AIMark(props: AIMarkProps): JSX.Element;
