import { Entry } from "./type";
import { ChartData, ChartSeriesMetadata } from "./payloads/stackedchart";
import { RangeData, RangeDefinition } from "./payloads/range-timeseries-data";

export function forOwn<T>(
  obj: { [key: string]: T },
  iteratee: (val: T, key: string) => void
) {
  Object.keys(obj).forEach((key) => {
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

export function toSeries(
  charts: ChartSeriesMetadata[],
  rowsGroupedByDate: Map<string, Entry[]>
): ChartData[] {
  const output: ChartData[] = [];
  charts.forEach((chart) => {
    const data: number[] = Array.from(rowsGroupedByDate.values()).map((rows) =>
      rows.map((row) => parseInt(row[chart.column])).reduce((a, b) => a + b)
    );
    const seriesData: ChartData = {
      name: chart.name,
      data: data,
    };
    output.push(seriesData);
  });

  return output;
}

export function toRangeTimeSeriesData(
  key: string,
  config: any,
  rowsGroupedByDate: Map<number, Entry[]>
) {
  const timeSeries: number[] = [...rowsGroupedByDate.keys()];

  const output: RangeDefinition[] = [];
  (config.ranges as any[]).forEach((rangeConfig) => {
    const rangeDefintion: RangeDefinition = {
      lower: {
        id: rangeConfig.lower.id,
        value: [],
      },
      upper: {
        id: rangeConfig.upper.id,
        value: [],
      },
      average: {
        id: rangeConfig.average != null ? rangeConfig.average.id : null,
        value: [],
      },
    };
    const lowerColumn = rangeConfig.lower.columnName;
    const upperColumn = rangeConfig.upper.columnName;
    const averagecolumn =
      rangeConfig.average != null ? rangeConfig.average.columnName : null;

    const aggregate = (column: string) =>
      Array.from(rowsGroupedByDate.values()).map((rows) => {
        return rows.map((_) => parseInt(_[column])).reduce((a, b) => a + b);
      });
    rangeDefintion.lower.value = aggregate(lowerColumn);
    if (averagecolumn) {
      rangeDefintion.average.value = aggregate(averagecolumn);
    }
    rangeDefintion.upper.value = aggregate(upperColumn);
    output.push(rangeDefintion);
  });
  const rangeData: RangeData = {
    timeSeries,
    data: output,
  };
  return { ...rangeData, type: config.type, intervention: key.replace("data","") };
}
