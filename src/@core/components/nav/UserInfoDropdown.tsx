import { IconText, LabelText } from "@core/components/common";
import { SMixinFlexColumn } from "@core/styles/emotion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useUserStore } from "stores";
import { useI18n } from "../../../hooks";
import { errorHandling } from "../../../utils";
import { IconArrowLogOut, IconEdit } from "../../../components/icon";
import { openChangePasswordModal } from "./ChangePasswordModal";

interface StyleProps {
  asPopover?: boolean;
}

interface Props extends StyleProps {
  onSignOut?: () => Promise<void>;
}

function UserInfoDropdown({ asPopover }: Props) {
  const { t } = useI18n();
  const signOut = useUserStore((s) => s.signOut);
  const me = useUserStore((s) => s.me);
  const [signOutSpinning, setSignOutSpinning] = React.useState(false);

  const { userNm, email } = me ?? {};

  const handleClickSignOut = React.useCallback(async () => {
    setSignOutSpinning(true);
    try {
      await signOut();
    } catch (err) {
      await errorHandling(err);
    } finally {
      setSignOutSpinning(false);
    }
  }, [setSignOutSpinning, signOut]);

  const handleChangePassword = React.useCallback(async () => {
    try {
      await openChangePasswordModal({});
      await signOut();
    } catch (err) {
      await errorHandling(err);
    }
  }, [signOut]);

  return (
    <UserInfoDropdownContainer asPopover={asPopover}>
      <LabelText role={"info"} label='User Name'>
        {userNm}
      </LabelText>
      <LabelText role={"info"} label='E-Mail'>
        {email}
      </LabelText>
      <CustomDivider />
      <CustomMenus>
        <IconText icon={<IconEdit />} iconSize={15} onClick={handleChangePassword} block>
          {t("로그인 비밀번호 변경")}
        </IconText>
      </CustomMenus>
      <CustomDivider />
      <CustomMenus>
        <IconText icon={<IconArrowLogOut />} iconSize={15} onClick={handleClickSignOut} block loading={signOutSpinning}>
          {t("로그아웃")}
        </IconText>
      </CustomMenus>
    </UserInfoDropdownContainer>
  );
}

const UserInfoDropdownContainer = styled.div<StyleProps>`
  ${SMixinFlexColumn("stretch", "stretch")};
  border-radius: 5px;
  padding: 10px 0;
  gap: 10px;
  border: 1px solid ${(p) => p.theme.border_color_base};

  ${({ asPopover, theme }) => {
    if (asPopover) {
      return css``;
    }
    return css`
      background: ${theme.popover_background};
      box-shadow: ${theme.box_shadow_layout};
    `;
  }}
  font-size: 12px;

  [role="info"] {
    padding: 0 20px;
  }
`;

const CustomDivider = styled.div`
  height: 1px;
  width: 100%;
  clear: both;
  background: ${(p) => p.theme.axf_border_color};
`;

const CustomMenus = styled.div`
  padding: 0 20px;
  font-weight: bold;
`;

export default UserInfoDropdown;
