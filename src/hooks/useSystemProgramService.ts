import { SystemProgram, SystemProgramService } from "../services";
import React from "react";
import { errorHandling } from "../utils";

export function useSystemProgramService() {
  const [list, setList] = React.useState<SystemProgram[]>([]);
  const [spinning, setSpinning] = React.useState(false);

  const getList = React.useCallback(async () => {
    setSpinning(true);
    try {
      const data = await SystemProgramService.getSystemProgram({
        pageSize: 9999,
      });
      setList(data.ds);
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      await getList();
    })();
  }, []);

  return {
    list,
    spinning,
    getList,
  };
}
