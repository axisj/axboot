import { fileURLToPath } from "url";
export const recommendedTemplate = "classic";
// const typeScriptTemplateSuffix = "-typescript";
export const templatesDir = fileURLToPath(new URL("../templates", import.meta.url));
export const defaultPackageManager = "npm";
export const lockfileNames = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
    bun: "bun.lockb",
};
export const packageManagers = Object.keys(lockfileNames);
export const gitStrategies = ["deep", "shallow", "copy", "custom"];
