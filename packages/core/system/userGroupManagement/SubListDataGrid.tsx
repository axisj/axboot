import * as React from "react";
import styled from "@emotion/styled";
import { DataGrid } from "@axboot/core/components/DataGrid";
import { useContainerSize } from "@axboot/core/hooks/useContainerSize";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import { useUserGroupManagementStore } from "./useUserGroupManagementStore";
import { SystemUserGroupMember } from "../../../../src/services";

interface Props {
  onClick: AXFDGProps<SystemUserGroupMember>["onClick"];
  onChangeCheckedRowKeys: (checkedRowKeys: React.Key[]) => void;
  checkedRowKeys: React.Key[];
}

function SubListDataGrid({ onClick, onChangeCheckedRowKeys, checkedRowKeys }: Props) {
  // const listColWidths = useUserGroupManagementStore((s) => s.listColWidths);
  const listSortParams = useUserGroupManagementStore(s => s.listSortParams);
  const setListSortParams = useUserGroupManagementStore(s => s.setListSortParams);
  const subListData = useUserGroupManagementStore(s => s.subListData);
  const subListPage = useUserGroupManagementStore(s => s.subListPage);
  const subListSpinning = useUserGroupManagementStore(s => s.subListSpinning);
  const changeSubListPage = useUserGroupManagementStore(s => s.changeSubListPage);
  const listSelectedRowKey = useUserGroupManagementStore(s => s.listSelectedRowKey);

  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const columns = React.useMemo(
    () =>
      [
        { key: "userCd", label: t("아이디"), align: "left", width: 150 },
        { key: "userNm", label: t("이름"), align: "left", width: 150 },
        { key: "remark", label: t("비고"), align: "left", width: 300 },
      ] as AXFDGColumn<SystemUserGroupMember>[],
    [t],
  );

  return (
    <Container ref={containerRef}>
      <DataGrid<SystemUserGroupMember>
        // frozenColumnIndex={0}
        width={containerWidth}
        height={containerHeight}
        columns={columns}
        data={subListData}
        spinning={subListSpinning}
        onClick={onClick}
        page={{
          ...subListPage,
          loading: false,
          onChange: async (currentPage, pageSize) => {
            await changeSubListPage(currentPage, pageSize);
          },
        }}
        // sort={{
        //   sortParams: listSortParams,
        //   onChange: setListSortParams,
        // }}
        rowKey={"userCd"}
        selectedRowKey={listSelectedRowKey ?? ""}
        rowChecked={{
          checkedRowKeys,
          onChange: (checkedIndexes, checkedRowKeys, checkedAll) => {
            // console.log("onChange rowSelection", checkedIndexes, checkedRowKeys, checkedAll);
            onChangeCheckedRowKeys(checkedRowKeys);
          },
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { SubListDataGrid };
