/** Test verdict chip — pass / partial / gap / fail. Gap carries a diamond dot (it means "nothing governs this", not "the rule failed"). */
export interface VerdictBadgeProps {
  verdict: "pass" | "partial" | "gap" | "fail";
  /** Solid fill for dark/exec surfaces. */
  solid?: boolean;
  style?: React.CSSProperties;
}
export declare function VerdictBadge(props: VerdictBadgeProps): JSX.Element;
