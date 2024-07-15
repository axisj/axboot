import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { IParam, SearchParams, SearchParamType } from "@core/components/search";
import { useExampleService } from "@core/hooks/useExampleService";
import styled from "@emotion/styled";
import { Button, Form, Space } from "antd";
import { useBtnI18n, useContainerSize, useI18n } from "hooks";
import * as React from "react";
import { ExampleItem, ExampleListRequest } from "services";
import { PageLayout } from "styles/pageStyled";

interface DtoItem extends ExampleItem {}

interface ListRequest extends ExampleListRequest {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
  onChangeCheckedRowKeys?: (checkedRowKeys: React.Key[]) => void;
  checkedRowKeys?: React.Key[];
}

export function ListDataSet({ onClick }: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();

  const [searchForm] = Form.useForm();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);
  const { list, page, spinning, getList } = useExampleService();
  const [listRequestValue, setListRequestValue] = React.useState<ListRequest>({});

  const params = React.useMemo(
    () =>
      [
        {
          placeholder: t("지역"),
          name: "select1",
          type: SearchParamType.SELECT,
          options: [
            { label: t("중구"), value: "중구" },
            { label: t("동구"), value: "동구" },
            { label: t("서구"), value: "서구" },
            { label: t("남구"), value: "남구" },
            { label: t("북구"), value: "북구" },
            { label: t("수성구"), value: "수성구" },
            { label: t("달서구"), value: "달서구" },
            { label: t("달성군"), value: "달성군" },
          ],
        },
        {
          placeholder: t("상담일자"),
          name: "timeRange",
          type: SearchParamType.DATE_RANGE,
        },
      ] as IParam[],
    [t],
  );

  const columns = React.useMemo(
    () =>
      [
        { key: "id", label: t("아이디"), align: "left", width: 150 },
        { key: "name", label: t("이름"), align: "left", width: 150 },
        { key: "addr", label: t("비고"), align: "left", width: 300 },
      ] as AXFDGColumn<DtoItem>[],
    [t],
  );

  const ds = React.useMemo(() => {
    return list.map((n) => ({
      values: n,
    }));
  }, [list]);

  const handleSearch = React.useCallback(
    async (pageNumber?: number) => {
      const listParams = {
        ...listRequestValue,
        pageNumber,
      };
      await getList(listParams);
    },
    [getList, listRequestValue],
  );

  return (
    <Frame>
      <SearchBar>
        <SearchParams
          form={searchForm}
          filterWidth={300}
          params={params}
          paramsValue={listRequestValue}
          onChangeParamsValue={(value) => setListRequestValue(value)}
          spinning={spinning}
          disableFilter
          extraButtons={() => (
            <Space>
              <Button onClick={() => handleSearch()}>{t("검색")}</Button>
            </Space>
          )}
        />
      </SearchBar>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={ds}
          spinning={spinning}
          onClick={onClick}
          page={{
            ...page,
            loading: false,
            onChange: async (currentPage) => {
              await handleSearch(currentPage);
            },
          }}
          rowKey={"id"}
          // rowChecked={{
          //   checkedRowKeys,
          //   onChange: (checkedIndexes, checkedRowKeys, checkedAll) => {
          //     // console.log("onChange rowSelection", checkedIndexes, checkedRowKeys, checkedAll);
          //     onChangeCheckedRowKeys(checkedRowKeys);
          //   },
          // }}
          // selectedRowKey={listSelectedRowKey ?? ""}
        />
      </Container>
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0;
  height: 400px;
  overflow: visible;
`;
const SearchBar = styled.div`
  margin-bottom: 16px;
`;
const Container = styled.div`
  flex: 1;
`;
