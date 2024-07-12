import { AXFDGPage } from "@axframe/datagrid";
import React, { useCallback, useEffect, useState } from "react";
import { errorHandling } from "../../../src/utils";
import { ExampleService } from "../../../src/services";
import { ExampleItem, ExampleListRequest } from "../services/example/ExampleRepositoryInterface";

export function useExampleService() {
  const [params, setParams] = useState<ExampleListRequest>({
    pageNumber: 1,
    pageSize: 100,
  });
  const [pageNo, setPageNo] = useState(1);
  const [list, setList] = React.useState<ExampleItem[]>([]);
  const [page, setPage] = React.useState<AXFDGPage>({
    currentPage: 1,
    totalPages: 0,
  });
  const [spinning, setSpinning] = useState(false);

  const callApiList = useCallback(async (listParams: ExampleListRequest) => {
    try {
      setSpinning(true);
      const data = await ExampleService.list(listParams);

      setList(data.ds);
      setPage({
        currentPage: data.page.pageNumber ?? 1,
        pageSize: data.page.pageSize ?? 0,
        totalPages: data.page.pageCount ?? 0,
        totalElements: data.page?.totalCount,
      });
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSpinning(false);
    }
  }, []);

  const getList = useCallback(
    async (request?: ExampleListRequest) => {
      const listParams = {
        ...params,
        ...request,
      };
      await callApiList(listParams);
      setPageNo(listParams.pageNumber ?? 1);
    },
    [callApiList, params],
  );

  useEffect(() => {
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
