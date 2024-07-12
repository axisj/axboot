import { ProgramConfig } from "@core/scripts/@types";

const programConfig: ProgramConfig = {
  pagesDir: "./src/pages",
  templateDir: "./src/@core/pages",
  programTypeFile: "./src/router/@programTypes.ts",
  pageRouteFile: "./src/router/PageRoute.tsx",
  routesFile: "./src/router/Routes.tsx",
  serviceMockUpDataFile: "./src/services/serviceMockUpData.ts",
  programs: [
    {
      code: "BIG_DATA_SAMPLE",
      name: ["DEMO", "bigDataSample"],
      type: "LIST_AND_MODAL",
      url: "/demo/bigDataSample",
    },
  ],
};

export default programConfig;
