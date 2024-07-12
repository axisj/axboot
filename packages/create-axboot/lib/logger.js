// noinspection TypeScriptValidateTypes
import chalk from "chalk";
const path = (msg) => chalk.cyan.underline(`"${String(msg)}"`);
const url = (msg) => chalk.cyan.underline(msg);
const name = (msg) => chalk.blue.bold(msg);
const code = (msg) => chalk.cyan(`\`${String(msg)}\``);
const subdue = (msg) => chalk.gray(msg);
const num = (msg) => chalk.yellow(msg);
function interpolate(msgs, ...values) {
    let res = "";
    values.forEach((value, idx) => {
        const flag = msgs[idx].match(/[a-z]+=$/);
        res += msgs[idx].replace(/[a-z]+=$/, "");
        const format = (() => {
            if (!flag) {
                return (a) => a;
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
function stringify(msg) {
    if (String(msg) === "[object Object]") {
        return JSON.stringify(msg);
    }
    if (msg instanceof Date) {
        return msg.toUTCString();
    }
    return String(msg);
}
function info(msg, ...values) {
    console.info(`${chalk.cyan.bold("[INFO]")} ${values.length === 0 ? stringify(msg) : interpolate(msg, ...values)}`);
}
function warn(msg, ...values) {
    console.warn(chalk.yellow(`${chalk.bold("[WARNING]")} ${values.length === 0 ? stringify(msg) : interpolate(msg, ...values)}`));
}
function error(msg, ...values) {
    console.error(chalk.red(`${chalk.bold("[ERROR]")} ${values.length === 0 ? stringify(msg) : interpolate(msg, ...values)}`));
}
function success(msg, ...values) {
    console.log(`${chalk.green.bold("[SUCCESS]")} ${values.length === 0 ? stringify(msg) : interpolate(msg, ...values)}`);
}
export const logger = {
    red: (msg) => chalk.red(msg),
    yellow: (msg) => chalk.yellow(msg),
    green: (msg) => chalk.green(msg),
    bold: (msg) => chalk.bold(msg),
    dim: (msg) => chalk.dim(msg),
    interpolate,
    info,
    warn,
    error,
    success,
};
