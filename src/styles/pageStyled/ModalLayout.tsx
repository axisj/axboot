import React from "react";
import { ModalBody, ModalFooter, ModalHeader, ModalLayoutContainer, ModalLayoutProps } from "./ModalLayoutStyled";

export class ModalLayout extends React.Component<ModalLayoutProps> {
  public static Header = ModalHeader;
  public static Body = ModalBody;
  public static Footer = ModalFooter;

  public render(): React.ReactElement {
    const { children, ...restProps } = this.props;
    return <ModalLayoutContainer {...restProps}>{children}</ModalLayoutContainer>;
  }
}
