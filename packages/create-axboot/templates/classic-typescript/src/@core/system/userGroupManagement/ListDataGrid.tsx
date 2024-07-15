import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize } from "@core/hooks/useContainerSize";
import styled from "@emotion/styled";
import * as React from "react";
import { SystemUserGroup } from "services";
import { useBtnI18n, useI18n } from "hooks";
import { useUserGroupManagementStore } from "./useUserGroupManagementStore";

interface DtoItem extends SystemUserGroup {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = useUserGroupManagementStore((s) => s.listColWidths);
  const listSortParams = useUserGroupManagementStore((s) => s.listSortParams);
  const listData = useUserGroupManagementStore((s) => s.listData);
  const listSpinning = useUserGroupManagementStore((s) => s.listSpinning);
  const setListColWidths = useUserGroupManagementStore((s) => s.setListColWidths);
  const setListSortParams = useUserGroupManagementStore((s) => s.setListSortParams);
  const listSelectedRowKey = useUserGroupManagementStore((s) => s.listSelectedRowKey);

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
          { key: "code", label: t("코드"), align: "left", width: 150 },
          { key: "codeNm", label: t("그룹명"), align: "left", width: 150 },
          { key: "codeEngNm", label: t("그룹명(영문)"), align: "left", width: 150 },
          {
            key: "useYn",
            label: t("사용여부"),
            align: "center",
            width: 80,
            itemRender: (item) => {
              return item.values.useYn === "Y" ? "사용" : "사용안함";
            },
          },
          {
            key: "data1",
            label: t("개인정보표시여부"),
            align: "center",
            width: 120,
            itemRender: (item) => {
              return item.values.data1 === "Y" ? "예" : "아니오";
            },
          },
          { key: "remark", label: t("비고"), align: "left", width: 200 },
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
        // sort={{
        //   sortParams: listSortParams,
        //   onChange: setListSortParams,
        // }}
        onChangeColumns={handleColumnsChange}
        rowKey={"code"}
        selectedRowKey={listSelectedRowKey ?? ""}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };
