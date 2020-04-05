export const RANGEDATA_GROUPS_CONFIGURATION = [
  {
    type: "hosp_need",
    ranges: [
      {
        lower: {
          columnName: "hosp_need_2.5",
          id: "2.5%",
        },
        upper: {
          columnName: "hosp_need_97.5",
          id: "97.5%",
        },
        average: {
          columnName: "hosp_need_50",
          id: "50%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
      {
        lower: {
          columnName: "hosp_need_25",
          id: "25%",
        },
        upper: {
          columnName: "hosp_need_75",
          id: "75%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
    ],
    chartingMetadata: {
      title: "Hospital beds needed",
      xAxisLabel: "Dates",
      yAxisLabel: "Number of beds (logarithmic scale)",
    },
  },
];
