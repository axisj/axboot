import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import pkg from "../../../package.json";
import { SMixinFlexColumn, SMixinFlexRow } from "../../@core/styles/emotion";
import { mediaMin } from "../../styles/mediaQueries";

interface Props {}

export function Visual({}: Props) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum(Math.ceil(Math.random() * 5));
  }, []);

  return (
    <Div>
      <div className={`visual bg0${num}`}>
        <p>Pioneering a dot at a time.</p>
        <div className={"typo"}>
          <span role={"version"}>
            <b>AXB</b>oot {pkg.version}
          </span>
          <span role={"copyright"}>2023 AXISJ Inc.</span>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  flex: 1;
  padding: 24px 24px 24px 0;

  display: none;

  ${mediaMin.md} {
    display: block;
  }

  .visual {
    transition: all 0.3s ease-in;
    transform: translate(36px);
    display: block;
    height: 100%;
    border-radius: 24px;
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.15);

    ${SMixinFlexColumn("flex-end", "center")};
    padding: 24px;

    &.bg00 {
      background: linear-gradient(45deg, #0f93ff, #feb47b);
      background-size: cover;
      color: ${(p) => p.theme.white_color};
    }
    &.bg01 {
      background: url("/images/signin-bg01.jpeg") no-repeat;
      background-size: cover;
      color: ${(p) => p.theme.white_color};
    }
    &.bg02 {
      background: url("/images/signin-bg02.jpeg") no-repeat;
      background-size: cover;
      color: ${(p) => p.theme.text_display_color};
    }
    &.bg03 {
      background: url("/images/signin-bg03.jpeg") no-repeat;
      background-size: cover;
      color: ${(p) => p.theme.white_color};
    }
    &.bg04 {
      background: url("/images/signin-bg04.jpeg") no-repeat;
      background-size: cover;
      color: ${(p) => p.theme.white_color};
    }
    &.bg05 {
      background: url("/images/signin-bg05.jpeg") no-repeat;
      background-size: cover;
      color: ${(p) => p.theme.white_color};
    }

    p {
      font-style: italic;
      font-size: 14px;
    }

    .typo {
      ${SMixinFlexRow("flex-end", "center")};
      gap: 12px;
      font-size: 11px;
      text-align: right;
      line-height: 1.5;

      b {
        font-weight: 800;
      }
    }
  }
`;
