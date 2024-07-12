import fs from "fs-extra";
import _ from "lodash";
import path from "path";
import shell from "shelljs";
import supportsColor from "supports-color";
import { logger } from "./logger.js";
import { getSource } from "./source.js";
import { CLIOptions } from "./types.js";
import {
  copyTemplate,
  escapeShellArg,
  getGitCommand,
  getPackageManager,
  getAppName,
  readTemplates,
  updatePkg,
} from "./utils.js";

export default async function init(
  rootDir: string,
  reqName?: string,
  reqTemplate?: string,
  cliOptions: CLIOptions = {},
): Promise<void> {
  const templates = await readTemplates();
  const appName = await getAppName(reqName, rootDir);
  const dest = path.resolve(rootDir, appName);
  const source = await getSource(reqTemplate, templates, cliOptions);

  logger.info("Creating new AXBoot project...");

  if (source.type === "git") {
    const gitCommand = await getGitCommand(source.strategy);
    const gitCloneCommand = `${gitCommand} ${escapeShellArg(source.url)} ${escapeShellArg(dest)}`;
    if (shell.exec(gitCloneCommand).code !== 0) {
      logger.error`Cloning Git template failed!`;
      process.exit(1);
    }
    if (source.strategy === "copy") {
      await fs.remove(path.join(dest, ".git"));
    }
  } else if (source.type === "template") {
    try {
      await copyTemplate(source.template, dest, source.language);
    } catch (err) {
      logger.error`Copying AXBoot template name=${source.template.name} failed!`;
      throw err;
    }
  } else {
    try {
      await fs.copy(source.path, dest);
    } catch (err) {
      logger.error`Copying local template path=${source.path} failed!`;
      throw err;
    }
  }

  // Update package.json info.
  try {
    await updatePkg(path.join(dest, "package.json"), {
      name: _.kebabCase(appName),
      version: "0.0.0",
      private: true,
    });
  } catch (err) {
    logger.error("Failed to update package.json.");
    throw err;
  }

  // We need to rename the gitignore file to .gitignore
  if (!(await fs.pathExists(path.join(dest, ".gitignore"))) && (await fs.pathExists(path.join(dest, "gitignore")))) {
    await fs.move(path.join(dest, "gitignore"), path.join(dest, ".gitignore"));
  }
  if (await fs.pathExists(path.join(dest, "gitignore"))) {
    await fs.remove(path.join(dest, "gitignore"));
  }

  // Display the most elegant way to cd.
  const cdpath = path.relative(".", dest);
  const pkgManager = await getPackageManager(dest, cliOptions);
  if (!cliOptions.skipInstall) {
    shell.cd(dest);
    logger.info`Installing dependencies with name=${pkgManager}...`;
    if (
      shell.exec(
        pkgManager === "yarn" ? "yarn" : pkgManager === "bun" ? "bun install" : `${pkgManager} install --color always`,
        {
          env: {
            ...process.env,
            // Force coloring the output, since the command is invoked by
            // shelljs, which is not an interactive shell
            ...(supportsColor.stdout ? { FORCE_COLOR: "1" } : {}),
          },
        },
      ).code !== 0
    ) {
      logger.error("Dependency installation failed.");
      logger.info`The App directory has already been created, and you can retry by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} install`}`;
      process.exit(0);
    }
  }

  const useNpm = pkgManager === "npm";
  const useBun = pkgManager === "bun";
  const useRunCommand = useNpm || useBun;
  logger.success`Created name=${cdpath}.`;
  logger.info`Inside that directory, you can run several commands:

  code=${`${pkgManager} ${useRunCommand ? "run " : ""}dev`}
    Starts the development server.

  code=${`${pkgManager} ${useRunCommand ? "run " : ""}build`}
    Bundles your website into static files for production.

We recommend that you begin by typing:

  code=${`cd ${cdpath}`}
  code=${`${pkgManager} ${useRunCommand ? "run " : ""}dev`}

If you have questions, feedback, or need help, please visit our website: url=${`https://axboot.dev`}
`;
}
