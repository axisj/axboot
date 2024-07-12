import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@axboot/core/components/DataGrid";
import { getSelectEditor, InputEditor } from "@axboot/core/components/dataGridEditor";
import { ExampleSubItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button } from "antd";
import { useBtnI18n, useContainerSize, useI18n } from "../../../../src/hooks";
import React from "react";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { ITEM_STAT } from "./Types";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";

interface DtoItem extends ExampleSubItem {}

interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGridC({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const listCColWidths = use$THREE_LIST$Store(s => s.listCColWidths);
  const setListCColWidths = use$THREE_LIST$Store(s => s.setListCColWidths);
  const listCSelectedRowKey = use$THREE_LIST$Store(s => s.listCSelectedRowKey);
  const listCCheckedIndexes = use$THREE_LIST$Store(s => s.listCCheckedIndexes);
  const setListCCheckedIndexes = use$THREE_LIST$Store(s => s.setListCCheckedIndexes);
  const listCData = use$THREE_LIST$Store(s => s.listCData);
  const spinning = use$THREE_LIST$Store(s => s.spinning);

  const addListCData = use$THREE_LIST$Store(s => s.addListCData);
  const delListCData = use$THREE_LIST$Store(s => s.delListCData);
  const setListCData = use$THREE_LIST$Store(s => s.setListCData);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListCColWidths(columns.map(column => column.width));
    },
    [setListCColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    addListCData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addListCData]);

  const handleDelSubItem = React.useCallback(() => {
    if (listCCheckedIndexes) delListCData(listCCheckedIndexes);
  }, [delListCData, listCCheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setListCData([...listCData]);
    },
    [listCData, setListCData],
  );

  const columns = React.useMemo(
    () =>
      (
        [
          {
            key: "_",
            label: "Status",
            align: "left",
            width: 80,
            itemRender: ({ item }) => {
              return item.status !== undefined ? ITEM_STAT[item.status] : "";
            },
          },
          { key: "code", label: "Code", align: "left", width: 80, itemRender: InputEditor },
          { key: "type", label: "Type", align: "left", width: 100, itemRender: InputEditor },
          {
            key: "useYn",
            label: "Use YN",
            align: "left",
            width: 120,
            itemRender: getSelectEditor([
              { value: "Y", label: "사용" },
              { value: "N", label: "사용안함" },
            ]),
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listCColWidths.length > 0) {
          column.width = listCColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [t, listCColWidths],
  );

  return (
    <>
      <Header>
        <div>{t("목록 C")}</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{btnT("추가")}</Button>
          <Button onClick={handleDelSubItem}>{btnT("삭제")}</Button>
        </ButtonGroup>
      </Header>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listCData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={listCSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: listCCheckedIndexes,
            onChange: (ids, selectedAll) => {
              setListCCheckedIndexes(ids);
            },
          }}
          editable
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const Header = styled(PageLayout.FrameHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { ListDataGridC };
