export interface Formdef {
    name: string;
    addresses: Formtype[];
}

export interface Formtype {
  value: any;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
}   