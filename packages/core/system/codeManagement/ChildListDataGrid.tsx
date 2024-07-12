import { AXFDGColumn, AXFDGDataItemStatus, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@axboot/core/components/DataGrid";
import { useContainerSize } from "@axboot/core/hooks";
import { ExampleSubItem } from "@axboot/core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button } from "antd";
import {
  DataGridStatusRender,
  getConditionalInputEditor,
  getConditionalInputNumberEditor,
  getSelectEditor,
  InputEditor,
} from "@axboot/core/components/dataGridEditor";
import * as React from "react";
import { SystemCommonCode } from "../../../../src/services";
import { useCodeStore } from "../../../../src/stores";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { useBtnI18n, useI18n } from "../../../../src/hooks";
import { useCodeManagementStore } from "./useCodeManagementStore";

interface DtoItem extends SystemCommonCode {}

interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ChildListDataGrid({ onClick }: Props) {
  const childListColWidths = useCodeManagementStore(s => s.childListColWidths);
  const listSelectedRowKey = useCodeManagementStore(s => s.listSelectedRowKey);
  const childListSelectedRowKey = useCodeManagementStore(s => s.childListSelectedRowKey);
  const childListCheckedIndexes = useCodeManagementStore(s => s.childListCheckedIndexes);
  const childListData = useCodeManagementStore(s => s.childListData);
  const spinning = useCodeManagementStore(s => s.spinning);

  const setChildListColWidths = useCodeManagementStore(s => s.setChildListColWidths);
  const setChildListCheckedIndexes = useCodeManagementStore(s => s.setChildListCheckedIndexes);
  const addChildListData = useCodeManagementStore(s => s.addChildListData);
  const delChildListData = useCodeManagementStore(s => s.delChildListData);
  const setChildListData = useCodeManagementStore(s => s.setChildListData);
  const USE_YN = useCodeStore(s => s.USE_YN);

  const { t } = useI18n();
  const btnT = useBtnI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);
  const disabled = !listSelectedRowKey;

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<ExampleSubItem>[]) => {
      setChildListColWidths(columns.map(column => column.width));
    },
    [setChildListColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    if (!listSelectedRowKey) return;
    addChildListData([
      {
        grpCd: listSelectedRowKey,
        code: "",
        codeNm: "",
        codeEngNm: "",
        useYn: "Y",
      },
    ]);
  }, [addChildListData, listSelectedRowKey]);

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
            label: "",
            align: "left",
            width: 50,
            headerAlign: "center",
            itemRender: DataGridStatusRender,
          },
          {
            key: "code",
            label: t("코드"),
            align: "center",
            width: 80,
            itemRender: getConditionalInputEditor({
              maxLength: 50,
              isDisabled: item => {
                return item.status !== AXFDGDataItemStatus.new;
              },
            }),
            getClassName: item => (item.status === AXFDGDataItemStatus.new ? "datagrid-editable" : ""),
          },
          {
            key: "codeNm",
            label: t("코드명"),
            align: "left",
            width: 100,
            itemRender: InputEditor,
            getClassName: item => "datagrid-editable",
          },
          {
            key: ["multiLang", "en"],
            label: t("영문명"),
            align: "left",
            width: 100,
            itemRender: InputEditor,
            getClassName: item => "datagrid-editable",
          },
          {
            key: "cdLvl",
            label: t("레벨"),
            align: "right",
            width: 100,
            itemRender: getConditionalInputNumberEditor({
              maxLength: 10,
            }),
            getClassName: item => "datagrid-editable",
          },
          {
            key: "sort",
            label: t("정렬순서"),
            align: "right",
            width: 100,
            itemRender: getConditionalInputNumberEditor({
              maxLength: 10,
            }),
            getClassName: item => "datagrid-editable",
          },
          {
            key: "useYn",
            label: "Use YN",
            align: "center",
            width: 120,
            itemRender: getSelectEditor(USE_YN?.options ?? []),
            getClassName: item => "datagrid-editable",
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (childListColWidths?.length > 0) {
          column.width = childListColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [t, childListColWidths, USE_YN],
  );

  return (
    <>
      <Header>
        <div>{t("코드목록")}</div>
        <ButtonGroup compact>
          <Button disabled={disabled} onClick={handleAddSubItem}>
            {btnT("추가")}
          </Button>
          <Button disabled={disabled} onClick={handleDelSubItem}>
            {btnT("삭제")}
          </Button>
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
          rowKey={"code"}
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
