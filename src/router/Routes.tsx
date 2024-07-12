import { getFlattedRoutes } from "@axboot/core/utils/store/getFlattedRoutes";
import React from "react";
import { example_router, getRoutes } from "@axboot/core/router/exampleRouter";
import { PROGRAM_TYPES } from "./@programTypes";

export interface RawRoute {
  key?: string;
  path: string;
  program_type?: PROGRAM_TYPES;
  icon?: React.ReactNode;
  children?: RawRoutes;
  hideTab?: boolean;
}

export type RawRoutes = Record<string, RawRoute>;

const routes = {
  SIGN_IN: {
    path: "sign-in",
    hideTab: true,
  },
  HOME: {
    path: "",
    hideTab: true,
  },
  SYSTEM: {
    path: "system",
    children: {
      CODE: {
        program_type: PROGRAM_TYPES.SYS_COMMON_CODE,
        path: "code",
      },

      AUTH: {
        path: "auth",
        children: {
          USER: {
            program_type: PROGRAM_TYPES.SYS_USER,
            path: "user",
          },
          USER_REQ: {
            program_type: PROGRAM_TYPES.SYS_USER_REQ,
            path: "user-req",
          },
          USER_GROUP: {
            program_type: PROGRAM_TYPES.SYS_USER_GROUP,
            path: "userGroup",
          },
          PROGRAM: {
            program_type: PROGRAM_TYPES.SYS_PROGRAM,
            path: "program",
          },
          PROGRAM_LOG: {
            program_type: PROGRAM_TYPES.SYS_PROGRAM_LOG,
            path: "programLog",
          },
          MENU: {
            program_type: PROGRAM_TYPES.SYS_MENU,
            path: "menu",
          },
        },
      },
    },
  },

  /* ##INSERT_ROUTE_POSITION## */
};

routes["EXAMPLES"] = {
  path: "examples",
  children: example_router,
};

export const ROUTES = getRoutes(routes, "/") as typeof routes;
export const ROUTES_LIST: RawRoute[] = getFlattedRoutes(ROUTES);
