import { TabGroupMenuAction } from "@core/components/contextMenu";

import { useLink } from "@core/hooks/useLink";
import { usePageTabStore } from "@core/stores/usePageTabStore";
import { SMixinFlexRow } from "@core/styles/emotion";
import styled from "@emotion/styled";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { useI18n } from "hooks";
import { MenuInfo } from "rc-menu/lib/interface";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { ReactSortable } from "react-sortablejs";
import TabItem from "./TabItem";
import TabItemMore from "./TabItemMore";

interface Props {}

function TabGroup(props: Props) {
  const activeTabUuid = usePageTabStore((s) => s.activeTabUuid);
  const getActiveTabPage = usePageTabStore((s) => s.getActiveTabPage);
  const pages = usePageTabStore((s) => s.pages);
  const setPages = usePageTabStore((s) => s.setPages);
  const removeTab = usePageTabStore((s) => s.removeTab);
  const removeTabs = usePageTabStore((s) => s.removeTabs);

  const [contextTabUuid, setContextTabUuid] = React.useState("");

  const location = useLocation();
  const { t, currentLanguage } = useI18n();
  const { linkByTo } = useLink();

  const tabGroupMenu: MenuProps["items"] = React.useMemo(() => {
    return [
      {
        label: t("contextMenu.closeTag"),
        key: TabGroupMenuAction.CLOSE_TAB,
      },
      {
        label: t("contextMenu.closeOtherTabs"),
        key: TabGroupMenuAction.CLOSE_OTHER_TABS,
      },
      {
        label: t("contextMenu.closeTabsToRight"),
        key: TabGroupMenuAction.CLOSE_TABS_RIGHT,
      },
      {
        label: t("contextMenu.refresh"),
        key: TabGroupMenuAction.REFRESH,
      },
    ];
  }, [t]);

  const tabItemList = React.useMemo(() => {
    return [...pages].map(([k, v]) => ({ id: k, page: v }));
  }, [pages]);

  const handleRemoveTab = React.useCallback(
    (tabUuid: string) => {
      removeTab(tabUuid);
      const activePageInfo = getActiveTabPage();
      if (activePageInfo.page.path && activePageInfo.page.path !== location.pathname) {
        linkByTo(activePageInfo.page.path);
      }
    },
    [getActiveTabPage, linkByTo, location.pathname, removeTab],
  );

  const handleRemoveOtherTabs = React.useCallback(
    (tabUuid: string, removeType: "OTHERS" | "TO_RIGHT") => {
      const pagesValues = [...pages];

      if (removeType === "OTHERS") {
        const removeTabUuids = pagesValues.filter(([k, v]) => !v.isHome && k !== tabUuid).map(([k]) => k);
        removeTabs(removeTabUuids);
      } else {
        const tabIndex = pagesValues.findIndex(([k]) => k === tabUuid);
        const removeTabUuids = pagesValues
          .slice(tabIndex + 1)
          .filter(([k, v]) => !v.isHome && k !== tabUuid)
          .map(([k]) => k);

        removeTabs(removeTabUuids);
      }

      const activePageInfo = getActiveTabPage();
      if (activePageInfo.page.path && activePageInfo.page.path !== location.pathname) {
        linkByTo(activePageInfo.page.path);
      }
    },
    [getActiveTabPage, linkByTo, location.pathname, pages, removeTabs],
  );

  const onClickContextMenu = React.useCallback(
    (info: MenuInfo) => {
      switch (info.key) {
        case TabGroupMenuAction.CLOSE_TAB:
          handleRemoveTab(contextTabUuid);
          break;
        case TabGroupMenuAction.CLOSE_OTHER_TABS:
          handleRemoveOtherTabs(contextTabUuid, "OTHERS");
          break;
        case TabGroupMenuAction.CLOSE_TABS_RIGHT:
          handleRemoveOtherTabs(contextTabUuid, "TO_RIGHT");
          break;
        case TabGroupMenuAction.REFRESH:
          window.location.reload();
          break;
        default:
          break;
      }
    },
    [contextTabUuid, handleRemoveOtherTabs, handleRemoveTab],
  );

  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const handleWheelScroller = React.useCallback((evt: React.WheelEvent) => {
    if (scrollerRef.current) {
      scrollerRef.current.scroll({
        left: scrollerRef.current.scrollLeft + evt.deltaX + evt.deltaY,
      });
    }
  }, []);

  const handleContextMenu = React.useCallback((evt: React.MouseEvent<HTMLDivElement>, tabUuid: string) => {
    evt.preventDefault();
    setContextTabUuid(tabUuid);
  }, []);

  const handleClickTab = React.useCallback(
    (tabUuid: string, path?: string) => {
      if (!path) return;
      linkByTo(path);
    },
    [linkByTo],
  );

  // scroll to activeTab
  React.useEffect(() => {
    const refCurrent = scrollerRef.current;
    if (refCurrent) {
      const scrollMargin = 20;

      const activeTabEl = refCurrent.querySelector("[role='active-tab-item']");
      if (!activeTabEl) return;

      const scrollerScrollLeft = refCurrent.scrollLeft;
      const { left: scrollerLeft, right: scrollerRight } = refCurrent.getBoundingClientRect();
      const { left: activeTabLeft, right: activeTabRight } = activeTabEl.getBoundingClientRect();

      if (scrollerRight < activeTabRight) {
        refCurrent.scrollLeft = scrollerScrollLeft + activeTabRight - scrollerRight + scrollMargin;
      } else if (scrollerLeft > activeTabLeft) {
        refCurrent.scrollLeft = scrollerScrollLeft - Math.abs(scrollerLeft - activeTabLeft) - scrollMargin;
      }
    }
  }, [activeTabUuid]);

  React.useEffect(() => {
    // tabGroupMenu.current.language = currentLanguage;
  }, [currentLanguage]);

  return (
    <TabGroupContainer>
      <TabItemsGroup>
        <Dropdown trigger={["contextMenu"]} menu={{ items: tabGroupMenu, onClick: onClickContextMenu }}>
          <TabItemsScroller ref={scrollerRef} onWheel={handleWheelScroller} role={"tab-scroller"}>
            <ReactSortable
              animation={300}
              delayOnTouchOnly
              delay={30}
              list={tabItemList}
              setList={(newState) => {
                setPages?.(newState.map((tabItem) => [tabItem.id, tabItem.page]));
              }}
              onEnd={(evt) => {
                evt.item.click();
              }}
            >
              {tabItemList.map((tabItem, index) => (
                <TabItem
                  key={index}
                  tabUuid={tabItem.id}
                  tabInfo={tabItem.page}
                  onContextMenu={handleContextMenu}
                  onClickTab={handleClickTab}
                  onRemoveTab={handleRemoveTab}
                />
              ))}
            </ReactSortable>
          </TabItemsScroller>
        </Dropdown>
        <TabItemMore />
      </TabItemsGroup>
    </TabGroupContainer>
  );
}

const TabGroupContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const TabItemsGroup = styled.div`
  ${SMixinFlexRow("stretch", "center")};
  position: absolute;
  bottom: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const TabItemsScroller = styled.div`
  position: relative;
  flex: 1;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 4px 0 0 0;
  height: ${(p) => p.theme.tab_bar_height}px;
  background: ${(p) => p.theme.axf_page_frame_tab_bg};

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  > div {
    display: flex;
    column-gap: 4px;
    position: relative;
    background: ${(p) => p.theme.axf_page_frame_tab_bg};
    padding: 0 8px;
    width: max-content;
  }
`;

export default TabGroup;
