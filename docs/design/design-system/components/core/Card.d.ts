/** Surface card with optional header (title + mono meta). dark=true for executive scorecard panels. */
export interface CardProps {
  title?: string;
  /** Mono metadata in the header right slot (e.g. "corpus v41"). */
  meta?: string;
  /** false to let content (tables, heat maps) run edge-to-edge. */
  pad?: boolean;
  /** Ink-dark executive panel. */
  dark?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
