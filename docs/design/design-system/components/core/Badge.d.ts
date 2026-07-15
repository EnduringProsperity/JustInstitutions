/** Small tinted label. Verdict tones exist here for counts/filters; for an actual test verdict use VerdictBadge. */
export interface BadgeProps {
  tone?: "neutral" | "accent" | "pass" | "partial" | "gap" | "fail";
  /** Mono type for IDs/data values. */
  mono?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
