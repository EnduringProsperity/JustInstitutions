/** Text input with optional label + hint. */
export interface InputProps {
  label?: string;
  /** Muted helper line under the field. */
  hint?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
