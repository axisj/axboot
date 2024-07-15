import { mouseEventSubscribe } from "@core/utils";
import styled from "@emotion/styled";
import { MousePosition } from "@types";
import React from "react";

interface Props {
  containerRef?: React.RefObject<HTMLDivElement>;
  onResize?: (flexGlow: number) => void;
}

function ColResizer({ containerRef, onResize }: Props) {
  const handleMove = React.useCallback(() => {
    if (!containerRef?.current) {
      return;
    }

    const { left, width } = containerRef.current.getBoundingClientRect();

    mouseEventSubscribe((mousePosition: MousePosition) => {
      const dx = mousePosition.clientX - left;
      onResize?.((dx / width) * 100);
    });
  }, [containerRef, onResize]);

  return <Container onMouseDown={handleMove} />;
}

const Container = styled.div`
  //flex: none;
  position: relative;
  width: 1px;
  height: 100%;
  background: ${(p) => p.theme.border_color_base};
  z-index: ${(p) => p.theme.ui_drag_zindex};
  &:before {
    cursor: col-resize;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: -4px;
    height: 100%;
    width: 8px;
  }
`;

export { ColResizer };
