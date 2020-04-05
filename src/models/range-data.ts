export interface RangeData {
  data: RangeDefinition[];
  timeSeries: number[];
  chartingMetadata: ChartingMetadata;
}

export interface ChartingMetadata {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
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