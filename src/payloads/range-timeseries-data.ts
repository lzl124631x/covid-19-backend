export interface RangeData {
  data: RangeDefinition[];
  timeSeries: number[];
}

export interface RangeDefinition {
  upper: Bound;
  lower: Bound;
  average: Bound;
}


export interface Bound{
    id: string;
    value: number[];
}