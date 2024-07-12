import React from "react";
import { IconDefaultProgram, IconGear, IconTemplate } from "./icon";

// eslint-disable-next-line react-refresh/only-export-components
export enum MenuIconType {
  Default,
  Example,
  Setting,
}

interface Props {
  role?: string;
  typeName: keyof typeof MenuIconType;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const menuIcons = Object.values(MenuIconType).filter(v => isNaN(Number(v)));

const Icon: Record<keyof typeof MenuIconType, any> = {
  Default: IconDefaultProgram,
  Example: IconTemplate,
  Setting: IconGear,
};

export function MenuIcon({ typeName, ...rest }: Props) {
  const className = "ant-menu-item-icon";
  if (typeName in Icon) {
    const IconComp = Icon[typeName ?? "Default"];
    return <IconComp {...{ className, ...rest }} />;
  }

  return <IconDefaultProgram {...{ className, ...rest }} />;
}

export default MenuIcon;
