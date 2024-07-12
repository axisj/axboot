// noinspection TypeScriptValidateTypes

import chalk from "chalk";

type InterpolatableValue = string | number | (string | number)[];

const path = (msg: unknown): string => chalk.cyan.underline(`"${String(msg)}"`);
const url = (msg: unknown): string => chalk.cyan.underline(msg);
const name = (msg: unknown): string => chalk.blue.bold(msg);
const code = (msg: unknown): string => chalk.cyan(`\`${String(msg)}\``);
const subdue = (msg: unknown): string => chalk.gray(msg);
const num = (msg: unknown): string => chalk.yellow(msg);

function interpolate(msgs: TemplateStringsArray, ...values: InterpolatableValue[]): string {
  let res = "";
  values.forEach((value, idx) => {
    const flag = msgs[idx]!.match(/[a-z]+=$/);
    res += msgs[idx]!.replace(/[a-z]+=$/, "");
    const format = (() => {
      if (!flag) {
        return (a: string | number) => a;
      }
      switch (flag[0]) {
        case "path=":
          return path;
        case "url=":
          return url;
        case "number=":
          return num;
        case "name=":
          return name;
        case "subdue=":
          return subdue;
        case "code=":
          return code;
        default:
          throw new Error("Bad Docusaurus logging message. This is likely an internal bug, please report it.");
      }
    })();
    res += Array.isArray(value) ? `\n- ${value.map(v => format(v)).join("\n- ")}` : format(value);
  });
  res += msgs.slice(-1)[0];
  return res;
}

function stringify(msg: unknown): string {
  if (String(msg) === "[object Object]") {
    return JSON.stringify(msg);
  }
  if (msg instanceof Date) {
    return msg.toUTCString();
  }
  return String(msg);
}

function info(msg: unknown): void;
function info(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function info(msg: unknown, ...values: InterpolatableValue[]): void {
  console.info(
    `${chalk.cyan.bold("[INFO]")} ${
      values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}
function warn(msg: unknown): void;
function warn(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function warn(msg: unknown, ...values: InterpolatableValue[]): void {
  console.warn(
    chalk.yellow(
      `${chalk.bold("[WARNING]")} ${
        values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function error(msg: unknown): void;
function error(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function error(msg: unknown, ...values: InterpolatableValue[]): void {
  console.error(
    chalk.red(
      `${chalk.bold("[ERROR]")} ${
        values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)
      }`,
    ),
  );
}
function success(msg: unknown): void;
function success(msg: TemplateStringsArray, ...values: [InterpolatableValue, ...InterpolatableValue[]]): void;
function success(msg: unknown, ...values: InterpolatableValue[]): void {
  console.log(
    `${chalk.green.bold("[SUCCESS]")} ${
      values.length === 0 ? stringify(msg) : interpolate(msg as TemplateStringsArray, ...values)
    }`,
  );
}

export const logger = {
  red: (msg: string | number): string => chalk.red(msg),
  yellow: (msg: string | number): string => chalk.yellow(msg),
  green: (msg: string | number): string => chalk.green(msg),
  bold: (msg: string | number): string => chalk.bold(msg),
  dim: (msg: string | number): string => chalk.dim(msg),
  interpolate,
  info,
  warn,
  error,
  success,
};
