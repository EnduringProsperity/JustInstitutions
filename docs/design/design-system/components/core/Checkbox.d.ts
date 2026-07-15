/** Checkbox with label and optional description line — used for test-block and intent multi-selects. */
export interface CheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
