import { Loading } from "@core/components/common";
import { SMixinFlexColumn, SMixinFlexRow } from "@axboot/core/styles";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconGripVertical } from "components/icon";
import { MenuIcon } from "components/MenuIcon";
import { useI18n } from "hooks";
import * as React from "react";
import { ReactSortable } from "react-sortablejs";
import { SystemMenuGroup } from "services";
import { useMenuManagementStore } from "./useMenuManagementStore";

interface Props {
  onClick: (param: any) => void;
  sortItemList: { id: string; item: SystemMenuGroup }[];
  setSortItemList: (list: any) => void;
}

function SortableList({ onClick, sortItemList, setSortItemList }: Props) {
  const { currentLanguage } = useI18n();
  const listSpinning = useMenuManagementStore((s) => s.listSpinning);
  const listSelectedRowKey = useMenuManagementStore((s) => s.listSelectedRowKey);

  return (
    <Container>
      <ReactSortable
        animation={300}
        delayOnTouchOnly
        delay={30}
        direction={"vertical"}
        list={sortItemList}
        setList={setSortItemList}
        handle={"[role='handle']"}
      >
        {sortItemList.map((item, index) => (
          <MenuGroup key={index} onClick={() => onClick(item.item)} active={item.id === listSelectedRowKey}>
            <IconGripVertical role={"handle"} size={20} />
            {item.item.iconTy && <MenuIcon role={"menu-icon"} typeName={item.item.iconTy} size={24} />}
            <div role={"body"}>
              <span role={"code"}>{item.item.menuGrpCd}</span>
              <span role={"name"}>{item.item.multiLang[currentLanguage]}</span>
            </div>
          </MenuGroup>
        ))}
        <Loading active={listSpinning} />
      </ReactSortable>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  border: 1px solid ${(p) => p.theme.border_color_base};
  border-radius: ${(p) => p.theme.axfdg_border_radius};
  background: ${(p) => p.theme.form_box_bg};

  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  > div {
    ${SMixinFlexColumn("flex-start", "stretch")};
    display: flex;
    gap: 10px;
    padding: 10px;
  }
`;

const MenuGroup = styled.div<{ active?: boolean }>`
  border: 1px solid ${(p) => p.theme.border_color_base};
  border-radius: 5px;
  padding: 5px;

  ${SMixinFlexRow("stretch", "center")};
  gap: 5px;
  cursor: pointer;

  ${({ active, theme }) => {
    if (active) {
      return css`
        background: ${theme.item_active_bg};
      `;
    }
    return css`
      &:hover {
        background: ${theme.item_hover_bg};
      }
    `;
  }}

  [role="handle"] {
    margin: 0 5px;
    cursor: move;
  }
  [role="menu-icon"] {
    margin-right: 7px;
  }
  [role="body"] {
    ${SMixinFlexColumn("flex-start", "stretch")};
    padding: 5px 0;
    gap: 3px;
  }
  [role="code"] {
    color: ${(p) => p.theme.text_heading_color};
  }
  [role="name"] {
  }
`;

export { SortableList };
