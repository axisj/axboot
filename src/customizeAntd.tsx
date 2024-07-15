import { fnFilterLabel } from "@core/utils";

import {
  Cascader,
  CascaderProps,
  Divider,
  DividerProps,
  Drawer,
  DrawerProps,
  Input,
  InputNumber,
  InputNumberProps,
  Modal,
  ModalProps,
  Select,
  SelectProps,
  Tooltip,
  TooltipProps,
} from "antd";
import { PasswordProps } from "antd/lib/input";
import { BaseOptionType } from "rc-cascader";
import React from "react";
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconClose } from "./components/icon";
import { useAppStore } from "./stores";
import theme, { themePalette } from "./styles/theme";

/*
 * Modal
 */
const _Modal = Modal as React.FC<ModalProps>;
_Modal.defaultProps ??= {};
const modalDefaultProps = _Modal.defaultProps;
if (modalDefaultProps) {
  modalDefaultProps.transitionName = "slide-down";
  modalDefaultProps.maskClosable = false;
  modalDefaultProps.centered = true;
  modalDefaultProps.closeIcon = <IconClose size={16} />;
  modalDefaultProps.styles = { body: { padding: 0 } };
  modalDefaultProps.className = "axframe-modal";
  modalDefaultProps.title = null;
  modalDefaultProps.footer = null;
  modalDefaultProps.closable = true;
  modalDefaultProps.destroyOnClose = true;
}

/*
 * Tooltip
 */
const _Tooltip = Tooltip as React.FC<TooltipProps>;
_Tooltip.defaultProps ??= {};
const tooltipDefaultProps = _Tooltip.defaultProps;
if (tooltipDefaultProps) {
  tooltipDefaultProps.color = themePalette[useAppStore.getState().theme].tooltip_bg;
  tooltipDefaultProps.mouseEnterDelay = 0;
  tooltipDefaultProps.mouseLeaveDelay = 0;
  tooltipDefaultProps.destroyTooltipOnHide = true;
}

/*
 * Cascader
 */
const _Cascader = Cascader as React.FC<CascaderProps<BaseOptionType>>;

_Cascader.defaultProps ??= {};
const cascaderDefaultProps = _Cascader.defaultProps;
if (cascaderDefaultProps) {
  cascaderDefaultProps.expandIcon = <IconArrowLeft />;
  cascaderDefaultProps.suffixIcon = <IconArrowRight />;
}

/*
 * Select
 */
const _Select = Select as React.FC<SelectProps>;

_Select.defaultProps ??= {};
const selectDefaultProps = _Select.defaultProps;
if (selectDefaultProps) {
  selectDefaultProps.suffixIcon = <IconArrowDown size={14} />;
  // selectDefaultProps.menuItemSelectedIcon = <QICheck fontSize={16} />;
  selectDefaultProps.filterOption = fnFilterLabel;
}

/*
 * Drawer
 */

const _Drawer = Drawer as React.FC<DrawerProps>;

_Drawer.defaultProps ??= {};
const drawerDefaultProps = _Drawer.defaultProps;
if (drawerDefaultProps) {
  drawerDefaultProps.closeIcon = <IconClose size={16} />;
}

/*
 * Input
 */
const _InputNumber = InputNumber as React.FC<InputNumberProps>;

_InputNumber.defaultProps ??= {};
const inputNumberDefaultProps = _InputNumber.defaultProps;

if (inputNumberDefaultProps) {
  inputNumberDefaultProps.upHandler = <IconArrowUp />;
  inputNumberDefaultProps.downHandler = <IconArrowDown />;
}

if (Input.defaultProps) {
  Input.defaultProps["onMouseUp"] = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
}

const _InputPassword = Input.Password as React.FC<PasswordProps>;

_InputPassword.defaultProps ??= {};
const inputPasswordDefaultProps = _InputPassword.defaultProps;

if (inputPasswordDefaultProps) {
  inputPasswordDefaultProps.autoComplete = "off";
}

const _Divider = Divider as React.FC<DividerProps>;
_Divider.defaultProps ??= {};
const dividerDefaultProps = _Divider.defaultProps;
if (dividerDefaultProps) {
  dividerDefaultProps.style = { margin: "24px 0" };
}
