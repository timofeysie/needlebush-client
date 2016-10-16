export interface NestedProfile {
    name: string;
    inputs: NestedInput[];
}

export interface NestedInput {
  value: any;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
}