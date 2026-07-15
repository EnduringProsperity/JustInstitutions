/** Native select styled to the system. */
export interface SelectProps {
  options?: (string | { value: string; label: string })[];
  label?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
