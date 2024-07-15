import * as React from "react";
import { ProgramFn } from "../@types";
import { UserService } from "../services";
import { ROUTES_LIST } from "../router";
import { matchPath, useLocation } from "react-router-dom";

export function useProgramFn() {
  const [programFn, setProgramFn] = React.useState<ProgramFn>();
  const location = useLocation();

  const init = React.useCallback(async () => {
    const currentRoute = ROUTES_LIST.find((r) => matchPath(r.path, location.pathname));
    if (!currentRoute) return;

    const data = await UserService.getProgramFn({ progCd: currentRoute.program_type, apiUrl: location.pathname });

    const programFn = data.ds.reduce((acc, cur) => {
      return { ...acc, [cur]: true };
    }, {});

    setProgramFn(programFn);
  }, [location.pathname]);

  React.useEffect(() => {
    (async () => {
      await init();
    })();
  }, [init]);

  return {
    programFn,
  };
}
