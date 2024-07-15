import { AXFDGClickParams } from "@axframe/datagrid";
import { SearchParams } from "@core/components/search";
import { useAntApp } from "@core/hooks";
import styled from "@emotion/styled";
import { Button, Form } from "antd";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemUserGroupMember, SystemUserGroupService } from "services";
import { PageLayout } from "styles/pageStyled";
import { openMemberModal } from "./MemberModal";
import { SubListDataGrid } from "./SubListDataGrid";
import { useUserGroupManagementStore } from "./useUserGroupManagementStore";

interface Props {}

function SubListDataSet({}: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const [subSearchForm] = Form.useForm();

  const subListRequestValue = useUserGroupManagementStore((s) => s.subListRequestValue);
  const setSubListRequestValue = useUserGroupManagementStore((s) => s.setSubListRequestValue);
  const callSubListApi = useUserGroupManagementStore((s) => s.callSubListApi);
  const subListSpinning = useUserGroupManagementStore((s) => s.subListSpinning);
  const listSelectedRowKey = useUserGroupManagementStore((s) => s.listSelectedRowKey);
  const detail = useUserGroupManagementStore((s) => s.detail);

  const [checkedRowKeys, setCheckedRowKeys] = React.useState<React.Key[]>([]);

  const handleSearch = React.useCallback(async () => {
    await callSubListApi();
  }, [callSubListApi]);

  const onClickItem = React.useCallback((params: AXFDGClickParams<SystemUserGroupMember>) => {
    console.log(params);
    // setListSelectedRowKey(params.item.code);
  }, []);

  const openModal = React.useCallback(async () => {
    // console.log("listSelectedRowKey: " + listSelectedRowKey);
    try {
      const data = await openMemberModal({
        query: listSelectedRowKey,
      });
      console.log(data);

      await SystemUserGroupService.memberInsert(data.saveParams);
      messageApi.info(t("저장되었습니다."));
      await callSubListApi();
    } catch (err) {
      console.log(err);
    }
  }, [callSubListApi, listSelectedRowKey, messageApi, t]);

  const deleteMemberFromGroup = React.useCallback(async () => {
    try {
      const apiParam = {
        userCds: checkedRowKeys.map((k) => k.toString()),
        userRole: detail?.code,
        __status__: "D",
      };
      await SystemUserGroupService.memberDelete(apiParam);
      messageApi.info(t("삭제되었습니다."));
      await callSubListApi();
    } catch (err) {
      console.log(err);
    }
  }, [callSubListApi, checkedRowKeys, detail?.code, messageApi, t]);

  return (
    <Frame>
      <SearchParams
        form={subSearchForm}
        // params={params}
        paramsValue={subListRequestValue}
        onChangeParamsValue={(value) => setSubListRequestValue(value)}
        onSearch={handleSearch}
        spinning={subListSpinning}
        extraButtons={() => (
          <>
            <Button onClick={() => openModal()}>{btnT("추가")}</Button>
            <Button onClick={() => deleteMemberFromGroup()}>{t("삭제")}</Button>
          </>
        )}
        style={{ marginBottom: 10 }}
      />

      <SubListDataGrid
        onClick={onClickItem}
        onChangeCheckedRowKeys={(rowKeys) => setCheckedRowKeys(rowKeys)}
        checkedRowKeys={checkedRowKeys}
      />
    </Frame>
  );
}

const Frame = styled(PageLayout.FrameColumn)`
  padding: 0;
  overflow: visible;
`;

export { SubListDataSet };
