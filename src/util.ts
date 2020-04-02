import { Entry } from "./type";
import { ChartData, ChartSeriesMetadata } from "./models/stackedchart";

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

export function toSeries(charts: ChartSeriesMetadata[], rowsGroupedByDate: Map<string, Entry[]>): ChartData[] {
  const output: ChartData[] = [];
  charts.forEach(chart => {
    const data: number[] = Array.from(rowsGroupedByDate.values())
      .map(rows => rows.map(row => parseInt(row[chart.column])).reduce((a, b) => a + b));
    const seriesData: ChartData = {
      name: chart.name,
      data: data,
    }
    output.push(seriesData);
  })

  return output;
}
