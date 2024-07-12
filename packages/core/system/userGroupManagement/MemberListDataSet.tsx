import * as React from "react";
import styled from "@emotion/styled";
import { SearchParams } from "@axboot/core/components/search";
import { Form } from "antd";

import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { SystemUser, SystemUserGroupMember, GetSystemUsersRequest } from "../../../../src/services";
import { useBtnI18n, useContainerSize, useI18n, useSystemUserService } from "../../../../src/hooks";
import { DataGrid } from "@axboot/core/components/DataGrid";

interface Props {
  onClick: AXFDGProps<SystemUserGroupMember>["onClick"];
  onChangeCheckedRowKeys: (checkedRowKeys: React.Key[]) => void;
  checkedRowKeys: React.Key[];
}

interface ListRequest extends GetSystemUsersRequest {}

function ListDataSet({ onClick, onChangeCheckedRowKeys, checkedRowKeys }: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const [searchForm] = Form.useForm();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const { list, page, spinning, getList } = useSystemUserService();
  const [listRequestValue, setListRequestValue] = React.useState<ListRequest>({});
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const columns = React.useMemo(
    () =>
      [
        { key: "userCd", label: t("아이디"), align: "left", width: 150 },
        { key: "userNm", label: t("이름"), align: "left", width: 150 },
        { key: "remark", label: t("비고"), align: "left", width: 300 },
      ] as AXFDGColumn<SystemUser>[],
    [t],
  );

  const ds = React.useMemo(() => {
    return list.map(n => ({
      values: n,
    }));
  }, [list]);

  // const [listSpinning, setListSpinning] = React.useState(false);

  const handleSearch = React.useCallback(
    async (params?) => {
      const listParams = {
        ...listRequestValue,
        ...params,
      };
      await getList(listParams);
      // await callListApi();
    },
    [getList, listRequestValue],
  );

  const changeListPage = React.useCallback(
    async (pageNumber, pageSize) => {
      console.log(pageNumber, pageSize);
      const params = {
        pageNumber,
        pageSize,
      };

      await handleSearch(params);
    },
    [handleSearch],
  );

  return (
    <Frame>
      <SearchBar>
        <SearchParams
          form={searchForm}
          filterWidth={300}
          // params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={value => setListRequestValue(value)}
          onSearch={handleSearch}
          spinning={spinning}
        />
      </SearchBar>

      <Container ref={containerRef}>
        <DataGrid<SystemUser>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={ds}
          // spinning={listSpinning}
          onClick={onClick}
          page={{
            currentPage: page.pageNumber ?? 1,
            pageSize: page.pageSize ?? 0,
            totalPages: page.endPageNo ?? 0,
            totalElements: page.totalCount,
            loading: false,
            onChange: async (currentPage, pageSize) => {
              await changeListPage(currentPage, pageSize);
            },
          }}
          // sort={{
          //   sortParams: listSortParams,
          //   onChange: setListSortParams,
          // }}
          rowKey={"userCd"}
          rowChecked={{
            checkedRowKeys,
            onChange: (checkedIndexes, checkedRowKeys, checkedAll) => {
              // console.log("onChange rowSelection", checkedIndexes, checkedRowKeys, checkedAll);
              onChangeCheckedRowKeys(checkedRowKeys);
            },
          }}
          // selectedRowKey={listSelectedRowKey ?? ""}
        />
      </Container>
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0;
  height: 400px;
`;
const SearchBar = styled.div`
  margin-bottom: 16px;
`;
const Container = styled.div`
  flex: 1;
`;
export { ListDataSet };
