import dayjs from "dayjs";

export function convertDateToString(
  target: Record<string, any> = {},
  formatString: string = "YYYY-MM-DD",
  keys?: string[],
) {
  if (!target) return target;

  if (keys) {
    keys.forEach(key => {
      if (target[key] instanceof dayjs) {
        target[key] = target[key].format(formatString);
      } else if (target[key]) {
        target[key] = dayjs(target[key]).format(formatString);
      }
    });
  } else {
    Object.keys(target).forEach(key => {
      if (target[key] instanceof dayjs) {
        target[key] = target[key].format(formatString);
      }
    });
  }

  return target;
}
