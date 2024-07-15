import styled from "@emotion/styled";
import { Calendar, CalendarProps, Tag } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { use$CALENDAR$Store } from "./use$CALENDAR$Store";

interface Props {
  onChange?: (date: Dayjs) => void;
}

function CalendarView({ onChange }: Props) {
  const listData = use$CALENDAR$Store((s) => s.listData);
  const listRequestValue = use$CALENDAR$Store((s) => s.listRequestValue);

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    const list = listData.filter((item) => dayjs(item.date).isSame(current, "date"));

    if (!list) return null;
    return (
      <DateDiv>
        {list.map((n) => {
          return (
            <Tag key={n.id} color={n.done ? "blue" : "red-inverse"}>
              {n.title}
            </Tag>
          );
        })}
      </DateDiv>
    );
  };

  useEffect(() => {}, [listRequestValue.baseMonth]);

  return (
    <Div>
      <Calendar
        headerRender={() => null}
        cellRender={cellRender}
        fullscreen
        value={dayjs(dayjs(listRequestValue.baseMonth).format("YYYY-MM") + "-01")}
        onChange={(date) => {
          onChange?.(date);
        }}
      />
    </Div>
  );
}

const Div = styled.div`
  padding: 10px 15px;
  flex: 1;
  border-radius: 4px;
  border: 1px solid ${(p) => p.theme.axf_border_color};
  background: ${(p) => p.theme.form_box_bg};
  box-shadow: ${(p) => p.theme.box_shadow_base};

  .ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date,
  .ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date-today {
    background: #fff;
  }
`;
const DateDiv = styled.div`
  text-align: center;
`;

export { CalendarView };
