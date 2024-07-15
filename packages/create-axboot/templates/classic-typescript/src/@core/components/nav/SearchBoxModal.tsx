import { useModalStore } from "@core/stores/useModalStore";
import styled from "@emotion/styled";
import { Button, Input, List, Modal } from "antd";
import { useBtnI18n, useI18n } from "hooks";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalLayout } from "styles/pageStyled";
import { useAntApp } from "@core/hooks";
import { SMixinFlexColumn, SMixinFlexRow } from "@core/styles/emotion";
import { dangerouslySetInnerHTML } from "@core/utils";
import { MenuItem, PROGRAM_TYPES, useAppMenu } from "router";
import { AppMenu } from "services";
import { alpha } from "@core/styles/colorUtil";
import { EmptyMsg } from "../../../components/common";
import { IconClose, IconListSearch } from "../../../components/icon";

export interface ModalRequest {
  query?: Record<string, any>;
}

export interface ModalResponse extends MenuItem {}

interface Props {
  open: boolean;
  onOk: (value: ModalResponse) => ModalResponse;
  onCancel: (reason?: any) => void;
  params: ModalRequest;
  afterClose: () => void;
}

function SearchBoxModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const { t, currentLanguage } = useI18n();
  const btnT = useBtnI18n();
  const { messageApi } = useAntApp();
  const { MENUS_LIST } = useAppMenu();

  const [filter, setFilter] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);

  const divRef = useRef<HTMLDivElement>(null);

  const filteredList = useMemo(() => {
    if (!filter) return [];
    return MENUS_LIST.filter((menu) => {
      return menu.progCd && menu.multiLang[currentLanguage].toLowerCase().includes(filter.toLowerCase());
    });
  }, [MENUS_LIST, currentLanguage, filter]);

  const handleSetFilter = useCallback((str?: string) => {
    setFilter(str ?? "");
    setFocusIndex(0);
  }, []);

  const handlemoveFocus = useCallback(
    (direction: "up" | "down") => {
      setFocusIndex((prev) => {
        if (direction === "up") {
          return prev === 0 ? filteredList.length - 1 : prev - 1;
        } else {
          return prev === filteredList.length - 1 ? 0 : prev + 1;
        }
      });
    },
    [filteredList.length],
  );

  const onClickMenu = useCallback(
    (menu?: AppMenu) => {
      if (!menu) return;
      onOk({
        key: menu.progCd ?? "",
        program_type: menu.progCd as PROGRAM_TYPES,
        labels: menu.multiLang,
        iconty: menu.iconTy,
      });
    },
    [onOk],
  );

  useEffect(() => {
    setTimeout(() => {
      if (open && divRef.current) {
        divRef.current.querySelector("input")?.focus();
      }
    }, 500);
  }, [open]);

  return (
    <Modal
      width={500}
      {...{ open, onCancel, onOk: onOk as any, afterClose }}
      transitionName={"slide-down"}
      centered={false}
      maskClosable={true}
      closable={false}
    >
      <Container>
        <Body ref={divRef}>
          <div className={"input-wrap"}>
            <Input
              variant={"borderless"}
              placeholder={t("search")}
              prefix={<IconListSearch size={20} />}
              value={filter}
              onChange={(e) => handleSetFilter(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onClickMenu(filteredList[focusIndex]);
                } else if (e.key === "ArrowUp") {
                  handlemoveFocus("up");
                } else if (e.key === "ArrowDown") {
                  handlemoveFocus("down");
                }
              }}
            />
            <Button
              type={"text"}
              icon={<IconClose size={20} />}
              onClick={() => {
                onCancel();
              }}
            />
          </div>
          <div className={"search-result"}>
            {filteredList.length ? (
              <List
                dataSource={filteredList}
                renderItem={(menu, idx) => (
                  <ListItem
                    onClick={() => {
                      onClickMenu(menu);
                    }}
                    className={focusIndex === idx ? "focused" : ""}
                  >
                    <span
                      {...dangerouslySetInnerHTML(
                        menu.multiLang[currentLanguage].replace(new RegExp(filter, "i"), (match) => `<u>${match}</u>`),
                      )}
                    />
                    {menu.parent_multiLang && <b>{menu.parent_multiLang[currentLanguage]}</b>}
                  </ListItem>
                )}
              />
            ) : (
              <div className={"msg-wrap"}>
                <EmptyMsg title={t("검색어를 입력하세요.")} />
              </div>
            )}
          </div>
        </Body>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)`
  min-height: 200px;
  ${SMixinFlexColumn("stretch", "stretch")};
  padding: 0;

  .input-wrap {
    flex: none;
    .ant-input {
      flex: 1;
    }
    ${SMixinFlexRow("stretch", "center")};

    padding: 10px;
    border-bottom: 1px solid ${(p) => p.theme.border_color_base};
  }
  .search-result {
    flex: 1;
    background: ${(p) => p.theme.body_background};
    border-radius: 0 0 6px 6px;
    position: relative;

    .msg-wrap {
      height: 150px;
      flex: 1;
      ${SMixinFlexRow("center", "center")};
    }
  }
`;
const ListItem = styled.div`
  padding: 12px 18px;
  border-bottom: 1px solid ${(p) => p.theme.border_color_base};
  ${SMixinFlexRow("space-between", "center")};
  color: ${(p) => p.theme.text_heading_color};
  cursor: pointer;

  &:hover {
    background: ${(p) => alpha(p.theme.warning_color, 0.1)};
  }
  &.focused {
    background: ${(p) => alpha(p.theme.warning_color, 0.3)};
  }

  u {
    text-decoration: underline;
    background: ${(p) => alpha(p.theme.warning_color, 0.3)};
    color: ${(p) => p.theme.text_display_color};
  }
`;

export async function openSearchBoxModal(params: ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <SearchBoxModal open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

export default SearchBoxModal;
