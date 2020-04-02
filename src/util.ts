import { Entry, IChartSeriesMetadata } from "./type";
import { ISeriesData } from "./stackedchart/IStackedChart";

export function forOwn<T>(
  obj: { [key: string]: T },
  iteratee: (val: T, key: string) => void
) {
  Object.keys(obj).forEach(key => {
    iteratee(obj[key], key);
  });
}

export function mapOwn<T>(
  obj: { [key: string]: T },
  iteratee: (val: T, key: string) => any
) {
  let arr: any[] = [];
  forOwn(obj, (val, key) => {
    arr.push(iteratee(val, key));
  });
  return arr;
}

export function ToSeries(charts: IChartSeriesMetadata[], rowsGroupedByDate: Map<string, Entry[]>): ISeriesData[] {
  const output: ISeriesData[] = [];
  charts.forEach(chart => {
    const data: number[] = Array.from(rowsGroupedByDate.values())
      .map(rows => rows.map(row => parseInt(row[chart.column])).reduce((a, b) => a + b));
    const seriesData: ISeriesData = {
      name: chart.name,
      data: data,
    }
    output.push(seriesData);
  })

  return output;
}
