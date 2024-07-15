import { SystemUser, SystemUserService } from "../services";
import React from "react";
import { DataGridPageResponse } from "../@types";
import { errorHandling } from "../utils";

export function useSystemUserService() {
  const [list, setList] = React.useState<SystemUser[]>([]);
  const [page, setPage] = React.useState<DataGridPageResponse>({
    pageCount: 0,
    totalCount: 0,
    pageNumber: 0,
    pageSize: 0,
  });
  const [spinning, setSpinning] = React.useState(false);

  const getList = React.useCallback(async (params?: Record<string, any>) => {
    setSpinning(true);
    const listParams = {
      pageSize: params?.pageSize ?? 100,
      pageNumber: params?.pageNumber ?? 0,
      filter: params?.filter,
      ...params,
    };
    try {
      const data = await SystemUserService.getSystemUsers(listParams);
      setList(data.ds);
      setPage(data.page);
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
  }, [getList]);

  return {
    list,
    page,
    spinning,
    getList,
  };
}
