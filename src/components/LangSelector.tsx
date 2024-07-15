import { Button, Dropdown } from "antd";
import { MenuProps } from "antd/lib/menu";
import React from "react";
import { useAppStore } from "stores";
import { useI18n } from "../hooks";
import { IconLanguage } from "./icon";

interface Props {
  hideLabel?: boolean;
}

const LanguageLabel = {
  en: "English",
  ko: "한국어",
};

function LangSelector({ hideLabel }: Props) {
  const { i18n } = useI18n();
  const currentLanguage = useAppStore((s) => s.currentLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const onClickMenu: MenuProps["onClick"] = React.useCallback(
    (info) => {
      setLanguage(info.key);
      i18n.changeLanguage(info.key);
    },
    [i18n, setLanguage],
  );

  return (
    <Dropdown
      menu={{
        onClick: onClickMenu,
        items: [
          { key: "en", label: LanguageLabel.en },
          { key: "ko", label: LanguageLabel.ko },
        ],
      }}
      trigger={["click"]}
    >
      <Button size={"small"} type={"text"} icon={<IconLanguage size={20} />} role={"lang-selector"}>
        {!hideLabel && LanguageLabel[currentLanguage]}
      </Button>
    </Dropdown>
  );
}

export { LangSelector };
