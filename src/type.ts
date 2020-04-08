export interface Entry {
  contact: string;
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
