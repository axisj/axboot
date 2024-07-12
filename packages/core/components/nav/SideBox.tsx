import { ClockCircleOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Timeline } from "antd";
import React, { useCallback } from "react";
import { IconArrowLeft, IconArrowRight } from "../../../../src/components/icon";
import { useAppStore } from "../../../../src/stores";
import { SMixinFlexRow } from "../../styles/emotion";

interface StyleProps {}

interface Props extends StyleProps {}

export function SideBox({}: Props) {
  const sideBoxOpened = useAppStore(s => s.sideBoxOpened);
  const setSideBoxOpened = useAppStore(s => s.setSideBoxOpened);

  const handleSetSideBoxOpened = useCallback(
    (opened: boolean) => {
      setSideBoxOpened(opened);
    },
    [setSideBoxOpened],
  );

  return (
    <Div>
      {sideBoxOpened && (
        <Timeline
          mode="left"
          items={[
            {
              children: "Create a services site 2015-09-01",
            },
            {
              children: "Solve initial network problems 2015-09-01",
              color: "green",
            },
            {
              dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
              children: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
            },
            {
              color: "red",
              children: "Network problems being solved 2015-09-01",
            },
            {
              children: "Create a services site 2015-09-01",
            },
            {
              dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
              children: "Technical testing 2015-09-01",
            },
          ]}
        />
      )}

      <Button
        size={"small"}
        className={"toggle-side-box"}
        icon={!sideBoxOpened ? <IconArrowLeft size={15} /> : <IconArrowRight size={15} style={{ marginLeft: 2 }} />}
        onClick={() => {
          handleSetSideBoxOpened(!sideBoxOpened);
        }}
        type={sideBoxOpened ? "default" : "primary"}
      />
    </Div>
  );
}

const Div = styled.div`
  flex: 1;
  padding: 24px 28px;

  .toggle-side-box {
    ${SMixinFlexRow("center", "center")};
    position: absolute;
    left: -16px;
    width: 16px;
    top: 35px;
    height: 26px;
    padding: 0;
    border-radius: 4px 0 0 4px;

    &.ant-btn-default {
      background: ${p => p.theme.header_background};
    }
  }
`;
