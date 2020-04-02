export const PERCENTILEGROUPS = [
    {
      type: "hosp_need",
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
      type: "vent_need",
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
      type: "ICU_need",
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
      type: "death",
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
  