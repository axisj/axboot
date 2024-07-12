import React from "react";
import {
  ButtonGroup,
  PageContentBox,
  PageContentBoxHeader,
  PageFrameBody,
  PageFrameColumn,
  PageFrameHeader,
  PageFrameRow,
  PageGroupTitle,
  PageHeader,
  PageLayoutContainer,
  PageSearchBar,
  PageTabBar,
  ToolBar,
} from "./PageLayoutStyled";

export interface PageLayoutProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  role?: string;
  stretch?: boolean;
}

export class PageLayout extends React.Component<PageLayoutProps> {
  public static Header = PageHeader;
  public static ContentBoxHeader = PageContentBoxHeader;
  public static ContentBox = PageContentBox;
  public static GroupTitle = PageGroupTitle;
  public static ButtonGroup = ButtonGroup;

  public static FrameHeader = PageFrameHeader;
  public static FrameBody = PageFrameBody;
  public static FrameRow = PageFrameRow;
  public static FrameColumn = PageFrameColumn;
  public static ToolBar = ToolBar;
  public static PageSearchBar = PageSearchBar;
  public static PageTabBar = PageTabBar;

  public render(): React.ReactElement {
    const { children, ...restProps } = this.props;
    return <PageLayoutContainer {...restProps}>{children}</PageLayoutContainer>;
  }
}
