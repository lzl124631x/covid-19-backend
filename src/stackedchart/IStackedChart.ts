export interface IStackedChart {
    title: string;
    categories: Array<string>;
    xAxisLabel: string;
    yAxisLabel: string;
    series: Array<ISeriesData>;
}

export interface ISeriesData {
    name: string;
    data: Array<number>;
}