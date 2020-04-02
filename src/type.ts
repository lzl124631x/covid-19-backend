export const PERCENTILEGROUPS = [
  {
    type: "beds",
    title: "Hospital beds needed",
    xAxisLabel: "Dates",
    yAxisLabel: "Number of beds",
    charts: [{
      name: "2.5 percentile",
      column: "hosp_need_2.5"
    },
    {
      name: "25 percentile",
      column: "hosp_need_25"
    },
    {
      name: "50 percentile",
      column: "hosp_need_50"
    },
    {
      name: "75 percentile",
      column: "hosp_need_75"
    },
    {
      name: "97.5 percentile",
      column: "hosp_need_97.5"
    }],
  },
  {
    type: "ventilators",
    title: "Ventilators needed",
    xAxisLabel: "Dates",
    yAxisLabel: "Number of ventilators",
    charts: [{
      name: "2.5 percentile",
      column: "vent_need_2.5"
    },
    {
      name: "25 percentile",
      column: "vent_need_25"
    },
    {
      name: "50 percentile",
      column: "vent_need_50"
    },
    {
      name: "75 percentile",
      column: "vent_need_75"
    },
    {
      name: "97.5 percentile",
      column: "vent_need_97.5"
    }],
  },
  {
    type: "icus",
    title: "ICU's needed",
    xAxisLabel: "Dates",
    yAxisLabel: "Number of icu's",
    charts: [{
      name: "2.5 percentile",
      column: "ICU_need_2.5"
    },
    {
      name: "25 percentile",
      column: "ICU_need_25"
    },
    {
      name: "50 percentile",
      column: "ICU_need_50"
    },
    {
      name: "75 percentile",
      column: "ICU_need_75"
    },
    {
      name: "97.5 percentile",
      column: "ICU_need_97.5"
    }],
  },
  {
    type: "deaths",
    title: "Deaths",
    xAxisLabel: "Dates",
    yAxisLabel: "Number of deaths",
    charts: [{
      name: "2.5 percentile",
      column: "death_2.5"
    },
    {
      name: "25 percentile",
      column: "death_25"
    },
    {
      name: "50 percentile",
      column: "death_50"
    },
    {
      name: "75 percentile",
      column: "death_75"
    },
    {
      name: "97.5 percentile",
      column: "death_97.5"
    }],
  }
];

export interface IChartSeriesMetadata {
  name: string;
  column: string;
}

export interface Entry {
  county: string;
  fips: string;
  Date: string;
  "hosp_need_2.5": string;
  hosp_need_25: string;
  hosp_need_50: string;
  hosp_need_75: string;
  "hosp_need_97.5": string;
  "ICU_need_2.5": string;
  ICU_need_25: string;
  ICU_need_50: string;
  ICU_need_75: string;
  "ICU_need_97.5": string;
  "vent_need_2.5": string;
  vent_need_25: string;
  vent_need_50: string;
  vent_need_75: string;
  "vent_need_97.5": string;
  "death_2.5": string;
  death_25: string;
  death_50: string;
  death_75: string;
  "death_97.5": string;
  [key: string]: string;
}

export type MapData = {
  data: MapDataEntry[];
  maxValue: number;
};

export type MapDataEntry = [string, MapStateEntry[]]; // [0] = date

export type MapStateEntry = [string, number]; // state, value
