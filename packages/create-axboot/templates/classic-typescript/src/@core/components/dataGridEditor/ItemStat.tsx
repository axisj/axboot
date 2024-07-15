import { AXFDGDataItemStatus } from "@axframe/datagrid";
import { Tag } from "antd";
import * as React from "react";

export const ITEM_STAT = {
  [AXFDGDataItemStatus.new]: "C",
  [AXFDGDataItemStatus.edit]: "U",
  [AXFDGDataItemStatus.remove]: "D",
};

export const DataGridStatusRender = ({ item }) => {
  if (item.status === undefined) return null;
  if (item.status === AXFDGDataItemStatus.new)
    return (
      <Tag color='processing' style={{ marginInlineEnd: 0 }}>
        C
      </Tag>
    );
  if (item.status === AXFDGDataItemStatus.edit)
    return (
      <Tag color='warning' style={{ marginInlineEnd: 0 }}>
        U
      </Tag>
    );
  if (item.status === AXFDGDataItemStatus.remove)
    return (
      <Tag color='error' style={{ marginInlineEnd: 0 }}>
        D
      </Tag>
    );
};
