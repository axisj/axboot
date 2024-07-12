import fs from "fs-extra";
import _ from "lodash";
import path from "path";
import prompts from "prompts";
import shell from "shelljs";
import { logger } from "./logger.js";
import {
  CLIOptions,
  defaultPackageManager,
  GitStrategy,
  lockfileNames,
  PackageManager,
  packageManagers,
  recommendedTemplate,
  Template,
  templatesDir,
} from "./types.js";

export async function readTemplates(): Promise<Template[]> {
  const dirContents = fs.readdirSync(templatesDir);

  const templates = await Promise.all(
    dirContents
      .filter(d => !d.startsWith(".") && !d.startsWith("README") && d !== "shared")
      .map(async name => {
        return {
          name,
          path: path.join(templatesDir, name),
        };
      }),
  );

  // Classic should be first in list!
  return _.sortBy(templates, t => t.name !== recommendedTemplate);
}

export async function getAppName(reqName: string | undefined, rootDir: string): Promise<string> {
  async function validateAppName(appName: string) {
    if (!appName) {
      return "A Application name is required.";
    }
    const dest = path.resolve(rootDir, appName);
    if (await fs.pathExists(dest)) {
      return `Directory already exists at path=${dest}!`;
    }
    return true;
  }
  if (reqName) {
    const res = await validateAppName(reqName);
    if (typeof res === "string") {
      throw new Error(res);
    }
    return reqName;
  }
  const { appName } = (await prompts(
    {
      type: "text",
      name: "appName",
      message: "What should we name this application?",
      initial: "my-axboot-app",
      validate: validateAppName,
    },
    {
      onCancel() {
        logger.error("A appName name is required.");
        process.exit(1);
      },
    },
  )) as { appName: string };
  return appName;
}

export function isValidGitRepoUrl(gitRepoUrl: string): boolean {
  return ["https://", "git@"].some(item => gitRepoUrl.startsWith(item));
}

export async function getGitCommand(gitStrategy: GitStrategy): Promise<string> {
  switch (gitStrategy) {
    case "shallow":
    case "copy":
      return "git clone --recursive --depth 1";
    case "custom": {
      const { command } = (await prompts(
        {
          type: "text",
          name: "command",
          message:
            'Write your own git clone command. The repository URL and destination directory will be supplied. E.g. "git clone --depth 10"',
        },
        {
          onCancel() {
            logger.info`Falling back to code=${"git clone"}`;
          },
        },
      )) as { command?: string };
      return command ?? "git clone";
    }
    case "deep":
    default:
      return "git clone";
  }
}

export function escapeShellArg(s: string): string {
  let res = `'${s.replace(/'/g, "'\\''")}'`;
  res = res.replace(/^(?:'')+/g, "").replace(/\\'''/g, "\\'");
  return res;
}

export async function copyTemplate(
  template: Template,
  dest: string,
  language: "javascript" | "typescript",
): Promise<void> {
  await fs.copy(path.join(templatesDir, "shared"), dest);

  const sourcePath = template.path;

  await fs.copy(sourcePath, dest, {
    // Symlinks don't exist in published npm packages anymore, so this is only
    // to prevent errors during local testing
    filter: filePath => !fs.lstatSync(filePath).isSymbolicLink(),
  });
}

export async function updatePkg(pkgPath: string, obj: { [key: string]: unknown }) {
  const pkg = (await fs.readJSON(pkgPath)) as { [key: string]: unknown };
  const newPkg = Object.assign(pkg, obj);

  await fs.outputFile(pkgPath, `${JSON.stringify(newPkg, null, 2)}\n`);
}

async function findPackageManagerFromLockFile(rootDir: string): Promise<PackageManager | undefined> {
  for (const packageManager of packageManagers) {
    const lockFilePath = path.join(rootDir, lockfileNames[packageManager]);
    if (await fs.pathExists(lockFilePath)) {
      return packageManager;
    }
  }
  return undefined;
}

function findPackageManagerFromUserAgent(): PackageManager | undefined {
  return packageManagers.find(packageManager => process.env.npm_config_user_agent?.startsWith(packageManager));
}

async function askForPackageManagerChoice(): Promise<PackageManager> {
  const hasYarn = shell.exec("yarn --version", { silent: true }).code === 0;
  const hasPnpm = shell.exec("pnpm --version", { silent: true }).code === 0;
  const hasBun = shell.exec("bun --version", { silent: true }).code === 0;

  if (!hasYarn && !hasPnpm && !hasBun) {
    return "npm";
  }
  const choices = ["npm", hasYarn && "yarn", hasPnpm && "pnpm", hasBun && "bun"]
    .filter((p): p is string => Boolean(p))
    .map(p => ({ title: p, value: p }));

  return (
    (
      (await prompts(
        {
          type: "select",
          name: "packageManager",
          message: "Select a package manager...",
          choices,
        },
        {
          onCancel() {
            logger.info`Falling back to name=${defaultPackageManager}`;
          },
        },
      )) as { packageManager?: PackageManager }
    ).packageManager ?? defaultPackageManager
  );
}

export async function getPackageManager(
  dest: string,
  { packageManager, skipInstall }: CLIOptions,
): Promise<PackageManager> {
  if (packageManager && !packageManagers.includes(packageManager)) {
    throw new Error(`Invalid package manager choice ${packageManager}. Must be one of ${packageManagers.join(", ")}`);
  }

  return (
    // If dest already contains a lockfile (e.g. if using a local template), we
    // always use that instead
    (await findPackageManagerFromLockFile(dest)) ??
    packageManager ??
    (await findPackageManagerFromLockFile(".")) ??
    findPackageManagerFromUserAgent() ??
    // This only happens if the user has a global installation in PATH
    (skipInstall ? defaultPackageManager : askForPackageManagerChoice())
  );
}
