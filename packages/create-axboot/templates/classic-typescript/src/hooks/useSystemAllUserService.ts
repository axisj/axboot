import React from "react";
import { GetSystemUsersRequest, SystemUser, SystemUserService } from "../services";
import { errorHandling } from "../utils";

export function useSystemUserService(params: GetSystemUsersRequest) {
  const [list, setList] = React.useState<SystemUser[]>([]);
  const [spinning, setSpinning] = React.useState(false);

  const getList = React.useCallback(async () => {
    setSpinning(true);
    try {
      const data = await SystemUserService.getSystemUsers(params);
      setList(data.ds);
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, [params]);

  React.useEffect(() => {
    (async () => {
      await getList();
    })();
  }, [getList, params]);

  return {
    list,
    spinning,
    getList,
  };
}
