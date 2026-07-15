/** Primary action button. @startingPoint section="Core" subtitle="Primary / secondary / ghost / danger, 3 sizes" viewport="700x180" */
export interface ButtonProps {
  /** Visual style. Default "primary". One primary per view. */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** Default "md". "sm" for dense toolbars/tables. */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: any) => void;
}
export declare function Button(props: ButtonProps): JSX.Element;
