import { openPromptDialog } from "@core/components/dialogs/PromptDialog";
import styled from "@emotion/styled";
import { Button, Checkbox, Popconfirm } from "antd";
import { IconAdd, IconClose } from "components/icon";
import { useBtnI18n, useI18n } from "hooks";
import * as React from "react";
import { SystemProgramFn } from "services";
import { PageLayout } from "styles/pageStyled";
import { useProgramManagementStore } from "./useProgramManagementStore";

interface Props {
  userGroup: Record<string, string[]>;
  functions: SystemProgramFn[];
}

function UserGroupPermissions({ userGroup, functions }: Props) {
  const { t } = useI18n("system");
  const btnT = useBtnI18n();
  const saveRequestValue = useProgramManagementStore((s) => s.saveRequestValue);
  const setSaveRequestValue = useProgramManagementStore((s) => s.setSaveRequestValue);
  const userGroupListData = useProgramManagementStore((s) => s.userGroupListData);

  const handleAddFunction = React.useCallback(async () => {
    try {
      const { data } = await openPromptDialog({
        title: "함수명을 입력해주세요",
        label: "함수명",
        placeHolder: "function name",
        keyName: "label",
        dialogWidth: 400,
      });

      const fns = [...functions];

      fns.push({
        key: `fn${`${functions.length + 1}`.padStart(2, "0")}`,
        label: data.label,
      });

      setSaveRequestValue({ ...saveRequestValue, functions: fns });
    } catch (err) {
      console.log(err);
    }
  }, [functions, setSaveRequestValue, saveRequestValue]);

  const handleRemoveFunction = React.useCallback(
    (key: string) => {
      const fns = functions.filter((fn) => fn.key !== key);
      setSaveRequestValue({ ...saveRequestValue, functions: fns });
    },
    [functions, setSaveRequestValue, saveRequestValue],
  );

  const handleCheckedFunction = React.useCallback(
    (userGroupKey: string, key: string, checked: boolean) => {
      const groups = { ...userGroup };
      if (checked) {
        if (!groups[userGroupKey].includes(key)) {
          groups[userGroupKey].push(key);
        }
      } else {
        groups[userGroupKey] = groups[userGroupKey].filter((fnKey) => fnKey !== key);
      }

      setSaveRequestValue({ ...saveRequestValue, userGroup: groups });
    },
    [userGroup, setSaveRequestValue, saveRequestValue],
  );

  return (
    <>
      <FormBoxHeader>
        {t("사용자 그룹 권한 설정")}
        <ButtonGroup compact>
          <Button onClick={handleAddFunction} icon={<IconAdd />}>
            {btnT("추가")}
          </Button>
        </ButtonGroup>
      </FormBoxHeader>
      <Container>
        <table>
          <thead>
            <tr>
              <th style={{ width: 150 }}>UserGroup</th>
              {functions.map((fn) => (
                <th key={fn.key} style={{ minWidth: 70 }}>
                  {fn.label}
                  <br />({fn.key})
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {Object.entries(userGroup).map(([userGroupKey, userGroupPermission]) => (
              <tr key={userGroupKey}>
                <td>{userGroupListData.find((ug) => ug.code === userGroupKey)?.codeNm}</td>
                {functions.map((fn) => (
                  <td key={fn.key}>
                    <Checkbox
                      checked={userGroupPermission.includes(fn.key)}
                      onChange={(e) => handleCheckedFunction(userGroupKey, fn.key, e.target.checked)}
                    />
                  </td>
                ))}
                <td />
              </tr>
            ))}
            <tr>
              <td>&nbsp;</td>
              {functions.map((fn) => (
                <td key={fn.key} style={{ padding: 0 }}>
                  <Popconfirm title={t("정말 삭제 하시겠습니까?")} onConfirm={() => handleRemoveFunction(fn.key)}>
                    <Button size={"small"} type={"link"} icon={<IconClose />}>
                      {btnT("삭제")}
                    </Button>
                  </Popconfirm>
                </td>
              ))}
              <td />
            </tr>
          </tbody>
        </table>
      </Container>
    </>
  );
}

const Container = styled.div`
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border-radius: 4px;
    border-style: hidden;
    box-shadow: 0 0 0 1px ${(p) => p.theme.border_color_base};
    background: ${(p) => p.theme.component_background};
  }

  th,
  td {
    white-space: nowrap;
    border: 1px solid ${(p) => p.theme.border_color_base};
    text-align: center;
    padding: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { UserGroupPermissions };
