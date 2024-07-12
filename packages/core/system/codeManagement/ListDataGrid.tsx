import * as React from "react";
import styled from "@emotion/styled";
import { DataGrid } from "@axboot/core/components/DataGrid";
import { useContainerSize } from "@axboot/core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import { useCodeManagementStore } from "./useCodeManagementStore";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { SystemCommonCode } from "../../../../src/services";

interface DtoItem extends SystemCommonCode {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const listColWidths = useCodeManagementStore(s => s.listColWidths);
  const listData = useCodeManagementStore(s => s.listData);
  const spinning = useCodeManagementStore(s => s.spinning);
  const setListColWidths = useCodeManagementStore(s => s.setListColWidths);
  const listSelectedRowKey = useCodeManagementStore(s => s.listSelectedRowKey);

  const { t } = useI18n();
  const btnT = useBtnI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListColWidths(columns.map(column => column.width));
    },
    [setListColWidths],
  );

  const columns = React.useMemo(
    () =>
      (
        [
          { key: "grpCd", label: t("그룹코드"), align: "left", width: 150 },
          { key: "grpCdNm", label: t("그룹코드명"), align: "left", width: 240 },
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
    <>
      <Header>
        <div>{t("코드그룹")}</div>
        <ButtonGroup compact></ButtonGroup>
      </Header>
      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          rowKey={"grpCd"}
          selectedRowKey={listSelectedRowKey ?? ""}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Header = styled(PageLayout.FrameHeader)``;

export { ListDataGrid };
