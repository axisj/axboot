import { Option } from "../@types";

export const collectOptionsValue = (options?: Option[], key?: string) => {
  const value = options
    ?.map((n) => {
      if (`${n.value}`.startsWith("{")) {
        try {
          const jsonValue = JSON.parse(`${n.value}`);
          return jsonValue[key ?? ""];
        } catch (e) {
          //
        }
      }
      return n.value;
    })
    .join(",");
  return value ? value : undefined;
};

export const collectOptionsLabel = (options?: Option[]) => {
  return options?.map((n) => n.label).join(",");
};

export const collectCds = (...cds) => {
  for (let i = 0; i < cds.length; i++) {
    if (cds[i]) {
      return cds[i];
    }
  }

  return "";
};
