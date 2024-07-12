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
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";

interface DtoItem extends ExampleSubItem {}

interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ChildListDataGrid({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const childListColWidths = use$LIST_WITH_LIST$Store(s => s.childListColWidths);
  const childListSelectedRowKey = use$LIST_WITH_LIST$Store(s => s.childListSelectedRowKey);
  const childListCheckedIndexes = use$LIST_WITH_LIST$Store(s => s.childListCheckedIndexes);
  const childListData = use$LIST_WITH_LIST$Store(s => s.childListData);
  const spinning = use$LIST_WITH_LIST$Store(s => s.spinning);

  const setChildListColWidths = use$LIST_WITH_LIST$Store(s => s.setChildListColWidths);
  const setChildListCheckedIndexes = use$LIST_WITH_LIST$Store(s => s.setChildListCheckedIndexes);
  const addChildListData = use$LIST_WITH_LIST$Store(s => s.addChildListData);
  const delChildListData = use$LIST_WITH_LIST$Store(s => s.delChildListData);
  const setChildListData = use$LIST_WITH_LIST$Store(s => s.setChildListData);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<ExampleSubItem>[]) => {
      setChildListColWidths(columns.map(column => column.width));
    },
    [setChildListColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    addChildListData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addChildListData]);

  const handleDelSubItem = React.useCallback(() => {
    if (childListCheckedIndexes) delChildListData(childListCheckedIndexes);
  }, [delChildListData, childListCheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setChildListData([...childListData]);
    },
    [childListData, setChildListData],
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
        ] as AXFDGColumn<ExampleSubItem>[]
      ).map((column, colIndex) => {
        if (childListColWidths.length > 0) {
          column.width = childListColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [childListColWidths],
  );

  return (
    <>
      <Header>
        <div>{t("보조목록")}</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{btnT("추가")}</Button>
          <Button onClick={handleDelSubItem}>{btnT("삭제")}</Button>
        </ButtonGroup>
      </Header>
      <Container ref={containerRef}>
        <DataGrid<ExampleSubItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={childListData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={childListSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: childListCheckedIndexes,
            onChange: (ids, selectedAll) => {
              setChildListCheckedIndexes(ids);
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
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Header = styled(PageLayout.FrameHeader)``;

export { ChildListDataGrid };
