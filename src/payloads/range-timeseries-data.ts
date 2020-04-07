export interface TimeSeriesData {
  contactData: ContactData[];
  timeSeries: number[];
  stateCode: string;
  type: string;
}

export interface ContactData {
  contact: string;
  percentileData: PercentileData[];
}

export interface PercentileData {
  percentile: string;
  data: number[];
}
