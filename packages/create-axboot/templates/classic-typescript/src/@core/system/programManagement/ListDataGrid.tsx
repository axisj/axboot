import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize } from "@core/hooks/useContainerSize";
import styled from "@emotion/styled";
import * as React from "react";
import { SystemProgram } from "services";
import { useBtnI18n, useI18n } from "hooks";
import { useProgramManagementStore } from "./useProgramManagementStore";

interface DtoItem extends SystemProgram {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = useProgramManagementStore((s) => s.listColWidths);
  const listSortParams = useProgramManagementStore((s) => s.listSortParams);
  const listData = useProgramManagementStore((s) => s.listData);
  const listPage = useProgramManagementStore((s) => s.listPage);
  const listSpinning = useProgramManagementStore((s) => s.listSpinning);
  const setListColWidths = useProgramManagementStore((s) => s.setListColWidths);
  const setListSortParams = useProgramManagementStore((s) => s.setListSortParams);
  const changeListPage = useProgramManagementStore((s) => s.changeListPage);
  const listSelectedRowKey = useProgramManagementStore((s) => s.listSelectedRowKey);

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
          { key: "progCd", label: t("프로그램코드"), align: "left", width: 150 },
          { key: "progNm", label: t("프로그램명"), align: "left", width: 300 },
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
        rowKey={"progCd"}
        selectedRowKey={listSelectedRowKey ?? ""}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };
