import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize } from "@core/hooks/useContainerSize";
import styled from "@emotion/styled";
import { Tag } from "antd";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemUser } from "services";
import { useUserManagementStore } from "./useUserManagementStore";

interface DtoItem extends SystemUser {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = useUserManagementStore((s) => s.listColWidths);
  const listSortParams = useUserManagementStore((s) => s.listSortParams);
  const listData = useUserManagementStore((s) => s.listData);
  const listPage = useUserManagementStore((s) => s.listPage);
  const listSpinning = useUserManagementStore((s) => s.listSpinning);
  const setListColWidths = useUserManagementStore((s) => s.setListColWidths);
  const setListSortParams = useUserManagementStore((s) => s.setListSortParams);
  const changeListPage = useUserManagementStore((s) => s.changeListPage);
  const listSelectedRowKey = useUserManagementStore((s) => s.listSelectedRowKey);

  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListColWidths(columns.map((column) => column.width));
    },
    [setListColWidths],
  );

  const columns = React.useMemo(
    () =>
      (
        [
          { key: "userCd", label: t("아이디"), align: "left", width: 120 },
          { key: "userNm", label: t("이름"), align: "left", width: 150 },
          {
            key: "roleList",
            label: t("User Roles"),
            align: "left",
            width: 100,
            itemRender: (item) => {
              return item.values.roleList?.map((role, key) => <Tag key={key}>{role}</Tag>);
            },
          },
          {
            key: "lockYn",
            label: t("계정잠김여부"),
            align: "left",
            width: 100,
            itemRender: (item) => {
              return item.values.lockYn === "Y" ? "예" : "아니오";
            },
          },
          { key: "remark", label: t("비고"), align: "left", width: 300 },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listColWidths?.length > 0) {
          column.width = listColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [t, listColWidths],
  );

  return (
    <Container ref={containerRef}>
      <DataGrid<DtoItem>
        frozenColumnIndex={0}
        width={containerWidth}
        height={containerHeight}
        columns={columns}
        data={listData}
        spinning={listSpinning}
        onClick={onClick}
        page={{
          ...listPage,
          loading: false,
          onChange: async (currentPage, pageSize) => {
            await changeListPage(currentPage, pageSize);
          },
        }}
        // sort={{
        //   sortParams: listSortParams,
        //   onChange: setListSortParams,
        // }}
        onChangeColumns={handleColumnsChange}
        rowKey={"userCd"}
        selectedRowKey={listSelectedRowKey ?? ""}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };
