import * as React from "react";
import styled from "@emotion/styled";
import { Button } from "antd";
import { useI18n } from "../../../../src/hooks";
import { useAppStore } from "../../../../src/stores";
import { useMenuManagementStore } from "./useMenuManagementStore";
import { PageLayout } from "../../../../src/styles/pageStyled";
import { SortableList } from "./SortableList";
import { SystemMenuGroup } from "../../../../src/services";

interface DtoItem extends SystemMenuGroup {}

interface Props {}

function ListDataSet({}: Props) {
  const { t } = useI18n();

  const callAppMenu = useAppStore(s => s.callAppMenu);
  const setListSelectedItem = useMenuManagementStore(s => s.setListSelectedItem);
  const flexGrow = useMenuManagementStore(s => s.flexGrow);
  const menuGroupList = useMenuManagementStore(s => s.listData);
  const callSaveOrderApi = useMenuManagementStore(s => s.callSaveOrderApi);
  const [sortItemList, setSortItemList] = React.useState<{ id: string; item: DtoItem }[]>([]);

  const onClickItem = React.useCallback(
    (item: DtoItem) => {
      setListSelectedItem(item);
    },
    [setListSelectedItem],
  );

  const handleSaveOrder = React.useCallback(async () => {
    await callSaveOrderApi(
      sortItemList.map(s => ({
        grpCd: "MENU_GROUP",
        code: s.item.menuGrpCd,
      })),
    );
    await callAppMenu();
  }, [callSaveOrderApi, sortItemList, callAppMenu]);

  React.useEffect(() => {
    setSortItemList(
      menuGroupList.map(mg => ({
        id: mg.menuGrpCd,
        item: mg,
      })),
    );
  }, [menuGroupList]);

  return (
    <>
      <Header>
        {t("메뉴그룹")}

        <ButtonGroup compact>
          <Button size={"small"} onClick={handleSaveOrder}>
            {t("순서저장")}
          </Button>
        </ButtonGroup>
      </Header>
      <SortableList onClick={onClickItem} sortItemList={sortItemList} setSortItemList={setSortItemList} />
    </>
  );
}

const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Header = styled(PageLayout.FrameHeader)``;

export { ListDataSet };
