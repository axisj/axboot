#!/usr/bin/env node
// @ts-check

import path from "path";
import { createRequire } from "module";
import semver from "semver";
import { program } from "commander";

// console.log("create-axboot 1");

const packageJson = /** @type {import("../package.json")} */ (createRequire(import.meta.url)("../package.json"));

// console.log("create-axboot 2", packageJson);

const requiredVersion = packageJson.engines.node;

// console.log("create-axboot 3", process.version, requiredVersion, semver.satisfies(process.version, requiredVersion));

if (!semver.satisfies(process.version, requiredVersion)) {
  console.error("Minimum Node.js version not met :(");
  console.info`You are using Node.js number=${process.version}, Requirement: Node.js number=${requiredVersion}.`;
  process.exit(1);
}

program.version(packageJson.version);

// console.log("create-axboot 4", packageJson.version);

try {
  // noinspection JSAnnotator
  program
    .arguments("[siteName] [template] [rootDir]")
    .option(
      "-p, --package-manager <manager>",
      "The package manager used to install dependencies. One of yarn, npm, pnpm, and bun.",
    )
    .option("-s, --skip-install", "Do not run package manager immediately after scaffolding")
    .option("-t, --typescript", "Use the TypeScript template variant")
    .option("-j, --javascript", "Use the JavaScript template variant")
    .option(
      "-g, --git-strategy <strategy>",
      `Only used if the template is a git repository.
\`deep\`: preserve full history
\`shallow\`: clone with --depth=1
\`copy\`: do a shallow clone, but do not create a git repo
\`custom\`: enter your custom git clone command. We will prompt you for it.`,
    )
    .description("Initialize website.")
    .action((siteName, template, rootDir, options) => {
      console.log("create-axboot 5", siteName, template, rootDir, options);
      import("../lib/index.js").then(({ default: init }) =>
        init(path.resolve(rootDir ?? "."), siteName, template, options),
      );
    });
} catch (e) {
  console.error(e);
}

program.parse(process.argv);

if (!process.argv.slice(1).length) {
  program.outputHelp();
}

process.on("unhandledRejection", err => {
  // logger.error(err);
  console.error(err);
  process.exit(1);
});
