import { SMixinFlexRow } from "@core/styles/emotion";
import { dangerouslySetInnerHTML } from "@core/utils";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Dropdown, Space, Tooltip } from "antd";
import {
  IconArrowLogOut,
  IconLeftPane,
  IconListSearch,
  IconMoon,
  IconSearch,
  IconSun,
  IconUserCircle,
} from "components/icon";
import { useBtnI18n, useI18n, useLink } from "hooks";
import React, { useCallback } from "react";
import { User } from "services";
import { NavPosition, useAppStore, useUserStore } from "stores";
import { errorHandling } from "utils";
import { alpha } from "../../styles/colorUtil";
import { LangSelector } from "../../../components/LangSelector";
import { openSearchBoxModal } from "./SearchBoxModal";
import UserInfoDropdown from "./UserInfoDropdown";

interface StyleProps {
  sideMenuOpened?: boolean;
  navPosition?: keyof NavPosition;
}

interface Props extends StyleProps {
  me?: User;
  onSignOut?: () => Promise<void>;
}

export default function AppMenuBarTools({}: Props) {
  const { t } = useI18n();
  const btnT = useBtnI18n();
  const { linkByMenu } = useLink();
  const [signOutSpinning, setSignOutSpinning] = React.useState(false);

  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  const fullScreen = useAppStore((s) => s.fullScreen);
  const setFullScreen = useAppStore((s) => s.setFullScreen);
  const navPosition = useAppStore((s) => s.navPosition);
  const setNavPosition = useAppStore((s) => s.setNavPosition);
  const me = useUserStore((s) => s.me);
  const signOut = useUserStore((s) => s.signOut);
  const { userNm } = me ?? {};

  const handleClickSignOut = useCallback(async () => {
    setSignOutSpinning(true);
    try {
      await signOut();
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSignOutSpinning(false);
    }
  }, [setSignOutSpinning, signOut]);

  const handleChangeTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const openSearchBox = useCallback(async () => {
    try {
      const data = await openSearchBoxModal();
      linkByMenu(data);
    } catch (err) {
      await errorHandling(err);
    }
  }, [linkByMenu]);

  return (
    <Container navPosition={navPosition}>
      {navPosition === "left" && (
        <div className={"left"}>
          <Button className={"search-btn"} icon={<IconListSearch size={16} />} onMouseDown={openSearchBox}>
            SEARCH
          </Button>
        </div>
      )}
      <div className={"right"}>
        <Space size={6}>
          {navPosition === "top" && (
            <>
              <Tooltip title={t("메뉴 찾기")}>
                <Button
                  size={"small"}
                  type={"text"}
                  icon={<IconSearch size={16} />}
                  onClick={openSearchBox}
                  onFocus={(e) => e.currentTarget.blur()}
                />
              </Tooltip>
              <Tooltip title={t("레프트메뉴 레이아웃")}>
                <Button
                  size={"small"}
                  type={"text"}
                  icon={<IconLeftPane size={18} />}
                  onClick={() => setNavPosition("left")}
                />
              </Tooltip>
            </>
          )}

          <Button
            size={"small"}
            type={"text"}
            icon={theme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
            onClick={handleChangeTheme}
          />
          <LangSelector />
        </Space>

        <Dropdown dropdownRender={() => <UserInfoDropdown onSignOut={handleClickSignOut} />}>
          <Button
            size={"small"}
            type={"text"}
            icon={<IconUserCircle className={"user-avatar"} size={22} />}
            role={"user-info"}
          >
            <span {...dangerouslySetInnerHTML(t("loginUserNameLabel", { userNm }))} />
          </Button>
        </Dropdown>

        <Button role={"logout"} onClick={handleClickSignOut} icon={<IconArrowLogOut />} loading={signOutSpinning}>
          {btnT("로그아웃")}
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div<StyleProps>`
  ${SMixinFlexRow("space-between", "center")};
  gap: 12px;
  padding: 0 16px;
  flex: 1;
  overflow: hidden;
  position: relative;
  font-size: 12px;

  ${({ navPosition }) => {
    if (navPosition === "top") {
      return css`
        flex: none;
      `;
    }
  }}

  .left {
    ${SMixinFlexRow("center", "center")};
    gap: 14px;

    .search-btn {
      width: 200px;
      ${SMixinFlexRow("flex-start", "center")};
      gap: 5px;
      padding: 0 10px;
      color: ${(p) => p.theme.disabled_color};
      box-shadow: none;
    }
  }

  .right {
    ${SMixinFlexRow("center", "center")};
    gap: 12px;
  }

  [role="user-info"] {
    .user-avatar {
      color: ${(p) => p.theme.primary_color};
      margin-right: 4px;
    }
  }
  [role="logout"] {
    flex: none;
    ${SMixinFlexRow("center", "center")};
    transition: all 0.3s;
    background: ${(p) => alpha(p.theme.primary_color, 0.15)};
    border: 0 none;
    border-radius: 32px;
    color: ${(p) => p.theme.primary_color};
    font-weight: 700;

    &:hover {
      background: ${(p) => alpha(p.theme.primary_color, 0.3)} !important;
    }
  }
`;
