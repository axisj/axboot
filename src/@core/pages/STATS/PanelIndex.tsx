import React from "react";
import { PanelPg1 } from "./PanelPg1";
import { PanelPg2 } from "./PanelPg2";
import { PanelType } from "./use$STATS$Store";

interface Props {
  contentType: PanelType;
}

const PanelComp: Record<PanelType, any> = {
  ["pg1"]: PanelPg1,
  ["pg2"]: PanelPg2,
};

function PanelIndex({ contentType }: Props) {
  const Comp = PanelComp[contentType];
  return <Comp />;
}

export { PanelIndex };
