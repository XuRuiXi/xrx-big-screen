export interface DataConfig {
  label: string;
  value: number;
  extra?: number;
  tooltip?: string;
}

export interface ItemConfig {
  name: string;
  value: number;
  percent: string;
  tooltip?: string;
  itemStyle?: Record<string, any>; // eslint-disable-line
}
