import { IFilter } from "./MultiFilter";

export function getFiltersValues<T>(filters: IFilter[]): T {
  return filters.reduce((acc, cur) => {
    if (cur.condition === "IS_EMPTY" || cur.condition === "NOT_EMPTY") {
      cur.value = cur.condition;
    }
    if (!cur.value || (Array.isArray(cur.value) && cur.value.length === 0)) {
      return acc;
    }

    return {
      ...acc,
      [cur.name]: Array.isArray(cur.value) ? cur.value.filter(Boolean).join(",") : cur.value,
      [cur.name + "Cond"]: cur.condition,
    };
  }, {}) as T;
}
