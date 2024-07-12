import { fileURLToPath } from "url";

export const recommendedTemplate = "classic";
// const typeScriptTemplateSuffix = "-typescript";
export const templatesDir = fileURLToPath(new URL("../templates", import.meta.url));

export type Template = {
  name: string;
  path: string;
};

export const defaultPackageManager = "npm";

export const lockfileNames = {
  npm: "package-lock.json",
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
  bun: "bun.lockb",
};

export type PackageManager = keyof typeof lockfileNames;
export const packageManagers = Object.keys(lockfileNames) as PackageManager[];

export const gitStrategies = ["deep", "shallow", "copy", "custom"] as const;
export type GitStrategy = (typeof gitStrategies)[number];

export type CLIOptions = {
  packageManager?: PackageManager;
  skipInstall?: boolean;
  gitStrategy?: GitStrategy;
};
