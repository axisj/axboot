import styled from "@emotion/styled";
import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}

function IconAXBoot({ width = 24, height = 24, color, style }: IconProps) {
  return (
    <Container width={width} height={height} color={color} style={style}>
      <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M63.9232 72.02C60.5383 72.02 57.5515 70.2476 55.9586 67.0965L28.4805 12.741C26.2902 8.40831 28.0823 3.09092 32.4628 0.924581C36.8434 -1.24176 42.2195 0.530701 44.4098 4.86339L71.8879 59.2189C74.0782 63.5516 72.2861 68.869 67.9056 71.0353C66.7109 71.8231 65.3171 72.02 63.9232 72.02Z"
          fill="#3D5588"
        />
        <path
          d="M36.4462 72.02C33.0612 72.02 30.0745 70.2476 28.4815 67.0965L1.00346 12.741C-1.18682 8.40831 0.605229 3.09092 4.98579 0.924581C9.36635 -1.24176 14.7425 0.530701 16.9328 4.86339L44.4108 59.2189C46.6011 63.5516 44.8091 68.869 40.4285 71.0353C39.2338 71.8231 37.84 72.02 36.4462 72.02Z"
          fill="#D05559"
        />
        <path
          d="M63.9238 28.6933L71.6894 13.1351C73.8797 8.99931 72.685 3.68192 68.7026 1.31864C64.123 -1.43853 58.3486 0.333936 55.9592 4.86356C54.7645 7.42379 54.7645 10.3779 55.9592 12.7412L63.9238 28.6933Z"
          fill="#D05559"
        />
        <path
          d="M8.96774 43.2668L1.00308 58.8251C-0.988082 62.7639 0.0075005 67.8843 3.79071 70.4445C5.38364 71.4292 7.17569 72.0201 8.96774 72.0201C12.3527 72.0201 15.3395 70.2476 16.9324 67.0966C18.1271 64.5363 18.1271 61.5822 16.9324 59.022L8.96774 43.2668Z"
          fill="#3D5588"
        />
      </svg>
    </Container>
  );
}

const Container = styled.div<{ width: number; height: number; color?: string }>`
  display: inline-flex;
  svg {
    width: ${p => p.width}px;
    height: ${p => p.height}px;
  }
  [fill="black"] {
    fill: ${p => p.color ?? "currentColor"};
  }
`;

export { IconAXBoot };
