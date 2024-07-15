import { SMixinFlexColumn, SMixinFlexRow } from "@axboot/core/styles";
import styled from "@emotion/styled";
import { Button, Tooltip, Tree } from "antd";
import { TreeProps } from "antd/lib/tree";
import { EmptyMsg } from "components/common";
import { IconAdd, IconEdit, IconSquareAdd, IconSquareDel } from "components/icon";
import { MenuIcon } from "components/MenuIcon";
import { omit } from "lodash";
import * as React from "react";
import { SystemMenu, SystemMenuGroup } from "services";
import { PageLayout } from "styles/pageStyled";
import { v4 as uuidv4 } from "uuid";
import { useBtnI18n, useI18n } from "../../../hooks";
import { openMenuNodeModal } from "./MenuNodeModal";
import { useMenuManagementStore } from "./useMenuManagementStore";

interface Props {}

function MenuDirectory({}: Props) {
  const { t, currentLanguage } = useI18n();
  const btnT = useBtnI18n();
  const saveRequestValue = useMenuManagementStore((s) => s.saveRequestValue);
  const setSaveRequestValue = useMenuManagementStore((s) => s.setSaveRequestValue);

  const treeData = React.useMemo(() => {
    if (saveRequestValue?.children) {
      const getChildren = (children: SystemMenu[], parentKey: string, level: number) => {
        return children.map((item, index) => {
          const key = parentKey ? parentKey + ":" + index : "" + index;
          const _children = getChildren(item.children, key, level + 1) ?? [];
          return {
            key,
            icon: item.iconTy,
            title: item.multiLang?.[currentLanguage],
            children: _children,
            isLeaf: _children.length === 0,
            level: level ?? 1,
            sort: index + 1,
            ...omit(item, ["multiLang", "children"]),
          };
        });
      };

      return getChildren(saveRequestValue.children, "", 1);
    }
    return [];
  }, [currentLanguage, saveRequestValue?.children]);

  const handleAddNode = React.useCallback(
    async (parentKey?: string) => {
      try {
        const { data } = await openMenuNodeModal({});
        const treeNode = {
          ...(data as SystemMenu),
          children: [] as SystemMenu[],
        };
        let requestValue: SystemMenuGroup = {
          menuGrpCd: "",
          multiLang: {
            en: "",
            ko: "",
          },
          children: [],
          userGroup: [],
        };
        requestValue = { ...saveRequestValue } as SystemMenuGroup;

        if (parentKey) {
          const keyPath = parentKey.split(/:/g);
          const item = keyPath.reduce((acc, cur) => {
            return acc.children[cur];
          }, requestValue);

          item.children.push({ ...treeNode, level: (item.level ?? 1) + 1, sort: item.children.length + 1 });
          setSaveRequestValue({ ...requestValue, children: [...requestValue.children] });
        } else {
          const tree = [...requestValue.children];

          tree.push({ ...treeNode, menuGrpCd: saveRequestValue?.menuGrpCd, level: 2, sort: tree.length + 1 });
          setSaveRequestValue({ ...requestValue, children: tree });
        }
      } catch (e) {
        //
      }
    },
    [saveRequestValue, setSaveRequestValue],
  );

  const handleEditNode = React.useCallback(
    async (key: string) => {
      if (!saveRequestValue) return;

      try {
        const keyPath = key.split(/:/g);
        const item = keyPath.reduce((acc, cur) => {
          return acc.children[cur];
        }, saveRequestValue) as SystemMenu;

        const { data } = await openMenuNodeModal({ item });

        item.multiLang = data.multiLang;
        item.progCd = data.progCd;
        item.iconTy = data.iconTy;

        console.log("item", item);

        setSaveRequestValue({ ...saveRequestValue, children: [...saveRequestValue.children] });
      } catch (e) {
        //
      }
    },
    [saveRequestValue, setSaveRequestValue],
  );

  const handleDelNode = React.useCallback(
    async (key: string) => {
      if (saveRequestValue) {
        const keyPath = key.split(/:/g);
        // const item = keyPath.reduce((acc, cur) => {
        //   return acc.children[cur];
        // }, saveRequestValue);
        const parentItem = keyPath.slice(0, keyPath.length - 1).reduce((acc, cur) => {
          return acc.children[cur];
        }, saveRequestValue);

        parentItem.children.splice(Number(keyPath[keyPath.length - 1]), 1);
        const tree = [...saveRequestValue.children];
        setSaveRequestValue({ ...saveRequestValue, children: tree } as SystemMenuGroup);
      }
    },
    [saveRequestValue, setSaveRequestValue],
  );

  const onDrop: TreeProps["onDrop"] = React.useCallback(
    (node) => {
      if (!saveRequestValue) return;

      const {
        dropPosition,
        dropToGap,
        node: { key: dropNodeKey },
        dragNode: { key: dragNodeKey },
      } = node;

      //dropToGap : 아이템 사이에 넣을지 여부
      // console.log(dropToGap, dropNodeKey, dragNodeKey);
      const dragKeyPath = dragNodeKey.split(/:/g);
      const dragParentKeyPath = dragKeyPath.slice(0, dragKeyPath.length - 1);
      const dropKeyPath = dropNodeKey.split(/:/g);
      const dropParentKeyPath = dropKeyPath.slice(0, dropKeyPath.length - 1);
      const itemFinder = (acc, cur) => {
        return acc.children[cur];
      };

      const dragItem = dragKeyPath.reduce(itemFinder, saveRequestValue);
      const dragParentItem = dragParentKeyPath.reduce(itemFinder, saveRequestValue);
      const dropItem = dropKeyPath.reduce(itemFinder, saveRequestValue);
      const dropParentItem = dropParentKeyPath.reduce(itemFinder, saveRequestValue);

      if (dropToGap) {
        const from = dragKeyPath[dragKeyPath.length - 1];
        const moveItem = dragParentItem.children[from];
        dropParentItem.children.splice(Math.max(dropPosition, 0), 0, { ...moveItem });

        dropParentItem.children.forEach((n, sort) => {
          n.sort = sort;
          n.level = Number(dropParentItem.level ?? 1) + 1;
        });

        const _key = (moveItem["_key"] = uuidv4());
        dragParentItem.children.splice(
          dragParentItem.children.findIndex((n) => n["_key"] === _key),
          1,
        );
        dragParentItem.children.forEach((n, sort) => {
          n.sort = sort;
          n.level = Number(dragParentItem.level ?? 1) + 1;
        });
      } else {
        dragItem.level = Number(dropItem.level ?? 1) + 1;
        dropItem.menuId = null;
        dropItem.parentId = null;
        dropItem.children.push(dragItem);
        dragParentItem.children.splice(Number(dragKeyPath[dragKeyPath.length - 1]), 1);
      }

      setSaveRequestValue({ ...saveRequestValue, children: [...saveRequestValue.children] });
    },
    [saveRequestValue, setSaveRequestValue],
  );

  return (
    <>
      <FormBoxHeader>
        {t("메뉴 디렉토리")}
        <ButtonGroup compact>
          <Button onClick={() => handleAddNode()} icon={<IconAdd />}>
            {btnT("추가")}
          </Button>
        </ButtonGroup>
      </FormBoxHeader>
      <TreeContainer>
        {treeData.length === 0 ? (
          <EmptyMsg disableImg title={""} msg={t("목록이 없습니다.")} />
        ) : (
          <Tree
            defaultExpandAll
            multiple
            className='draggable-tree'
            draggable
            blockNode
            // onDragEnter={onDragEnter}
            onDrop={onDrop}
            showLine
            titleRender={(nodeData) => {
              return (
                <TreeNode title={""}>
                  <>
                    <div role={"tools"}>
                      <Tooltip title='edit'>
                        <a
                          onClick={async (evt) => {
                            evt.stopPropagation();
                            await handleEditNode("" + nodeData.key);
                          }}
                        >
                          <IconEdit role={"btn"} />
                        </a>
                      </Tooltip>
                      <Tooltip title='add'>
                        <a
                          onClick={async (evt) => {
                            evt.stopPropagation();
                            await handleAddNode("" + nodeData.key);
                          }}
                        >
                          <IconSquareAdd role={"btn"} />
                        </a>
                      </Tooltip>
                      <Tooltip title='del'>
                        <a
                          onClick={async (evt) => {
                            evt.stopPropagation();
                            await handleDelNode("" + nodeData.key);
                          }}
                        >
                          <IconSquareDel role={"btn"} />
                        </a>
                      </Tooltip>
                    </div>
                    {nodeData.icon && <MenuIcon typeName={nodeData.icon as any} />} {nodeData.title}{" "}
                    {nodeData["progCd"] ? `(${nodeData["progCd"]})` : ``}
                  </>
                </TreeNode>
              );
            }}
            treeData={treeData}
          />
        )}
      </TreeContainer>
    </>
  );
}

const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const TreeContainer = styled.div`
  border: 1px solid ${(p) => p.theme.border_color_base};
  border-radius: ${(p) => p.theme.axfdg_border_radius};
  background: ${(p) => p.theme.form_box_bg};
  padding: 10px;
  min-height: 100px;

  ${SMixinFlexColumn("stretch", "stretch")};

  .ant-tree-draggable-icon {
    display: none;
  }
`;
const TreeNode = styled.div`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 5px;

  [role="tools"] {
    background: ${(p) => p.theme.item_active_bg};
    ${SMixinFlexRow("flex-start", "center")};
    //display: none;
    display: flex;
    gap: 3px;
    padding: 0 5px;
    border-radius: 5px;
    color: ${(p) => p.theme.text_heading_color};
  }

  &:hover [role="tools"] {
    //display: flex;
  }

  [role="btn"] {
    &:hover {
      color: ${(p) => p.theme.primary_color};
    }
  }
`;

export { MenuDirectory };
