import { SMixinEllipsis, SMixinFlexRow } from "@axboot/core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Dropdown, Popover } from "antd";
import { IconMoreVertical } from "../../../../src/components/icon";
import React from "react";
import { User } from "../../../../src/services";
import { useAppStore, useUserStore } from "../../../../src/stores";
import { errorHandling } from "../../../../src/utils";
import UserAvatar from "./UserAvatar";
import UserInfoDropdown from "./UserInfoDropdown";

interface StyleProps {
  sideMenuOpened?: boolean;
}

interface Props extends StyleProps {
  me?: User;
  onSignOut?: () => Promise<void>;
}

function UserInfo({}: Props) {
  const sideMenuOpened = useAppStore(s => s.sideMenuOpened);
  const me = useUserStore(s => s.me);
  const signOut = useUserStore(s => s.signOut);

  const { userNm, email } = me ?? {};

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut();
    } catch (err) {
      await errorHandling(err);
    }
  }, [signOut]);

  return (
    <UserInfoContainer sideMenuOpened={sideMenuOpened}>
      <UserInfoBox sideMenuOpened={sideMenuOpened}>
        {sideMenuOpened ? (
          <>
            <UserAvatar size={"medium"} userName={userNm} role="avatar" />
            <UserCard>
              <span role="name">{userNm}</span>
              <span role="email">{email}</span>
            </UserCard>
            <Dropdown dropdownRender={() => <UserInfoDropdown onSignOut={handleSignOut} />} trigger={["click"]}>
              <DownDownHandle>
                <IconMoreVertical />
              </DownDownHandle>
            </Dropdown>
          </>
        ) : (
          <>
            <Popover
              content={<UserInfoDropdown onSignOut={handleSignOut} asPopover />}
              placement={"rightTop"}
              align={{ targetOffset: [0, 8] }}
            >
              <div>
                <UserAvatar size={"small"} userName={userNm} role="avatar" />
              </div>
            </Popover>
          </>
        )}
      </UserInfoBox>
    </UserInfoContainer>
  );
}

const UserInfoContainer = styled.div<StyleProps>`
  flex: none;
  [role="avatar"] {
    flex: none;
  }

  ${({ sideMenuOpened }) => {
    if (sideMenuOpened) {
      return css`
        padding: 28px 28px 0 28px;
      `;
    }
    return css`
      padding: 20px 0;
    `;
  }}
`;
const UserInfoBox = styled.div<StyleProps>`
  ${SMixinFlexRow("stretch", "center")};
  overflow: hidden;
  column-gap: 15px;
  ${({ sideMenuOpened, theme }) => {
    if (sideMenuOpened) {
      return css`
        ${SMixinFlexRow("stretch", "center")};
        border-bottom: 1px solid ${theme.axf_border_color};
        padding-bottom: 32px;
      `;
    }
    return css`
      ${SMixinFlexRow("center", "center")};
      [role="avatar"] {
        cursor: pointer;
      }
    `;
  }}
`;
const UserCard = styled.div`
  flex: 1;
  font-weight: bold;
  line-height: 1.3;
  overflow: hidden;
  ${SMixinEllipsis()}
  [role="name"] {
    display: block;
    color: ${p => p.theme.text_heading_color};
    font-size: 13px;
    margin-bottom: 2px;
  }
  [role="email"] {
    font-size: 11px;
    color: ${p => p.theme.text_sub_body_color};
  }
`;
const DownDownHandle = styled.div`
  ${SMixinFlexRow("center", "center")};
  cursor: pointer;
  flex: none;
  font-size: 20px;
  color: ${p => p.theme.primary_color};
`;

export default UserInfo;
