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
  },
  {
    type: "vent_need",
    ranges: [
      {
        lower: {
          columnName: "vent_need_2.5",
          id: "2.5%",
        },
        upper: {
          columnName: "vent_need_97.5",
          id: "97.5%",
        },
        average: {
          columnName: "vent_need_50",
          id: "50%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
      {
        lower: {
          columnName: "vent_need_25",
          id: "25%",
        },
        upper: {
          columnName: "vent_need_75",
          id: "75%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
    ]
  },
  {
    type: "ICU_need",
    ranges: [
      {
        lower: {
          columnName: "ICU_need_2.5",
          id: "2.5%",
        },
        upper: {
          columnName: "ICU_need_97.5",
          id: "97.5%",
        },
        average: {
          columnName: "ICU_need_50",
          id: "50%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
      {
        lower: {
          columnName: "ICU_need_25",
          id: "25%",
        },
        upper: {
          columnName: "ICU_need_75",
          id: "75%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
    ]
  },
  {
    type: "death",
    ranges: [
      {
        lower: {
          columnName: "death_2.5",
          id: "2.5%",
        },
        upper: {
          columnName: "death_97.5",
          id: "97.5%",
        },
        average: {
          columnName: "death_50",
          id: "50%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
      {
        lower: {
          columnName: "death_25",
          id: "25%",
        },
        upper: {
          columnName: "death_75",
          id: "75%",
        },
        timeseries: {
          columnName: "Date",
        },
      },
    ]
  }
];
