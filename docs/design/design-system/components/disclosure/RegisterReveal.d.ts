/** The two-register pattern: plain-language lead, expert evidence one click below. Children = citations, confidence pills, rule text. */
export interface RegisterRevealProps {
  /** Plain-language summary — no jargon, ~58ch measure. */
  plain: string;
  /** Default "Show the evidence". */
  expandLabel?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function RegisterReveal(props: RegisterRevealProps): JSX.Element;
