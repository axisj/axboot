import fs from "fs-extra";
import path from "path";
import prompts, { Choice } from "prompts";
import { logger } from "./logger.js";
import { CLIOptions, gitStrategies, GitStrategy, recommendedTemplate, Template } from "./types.js";
import { isValidGitRepoUrl } from "./utils.js";

type Source =
  | {
      type: "template";
      template: Template;
      language: "javascript" | "typescript";
    }
  | {
      type: "git";
      url: string;
      strategy: GitStrategy;
    }
  | {
      type: "local";
      path: string;
    };

export async function getSource(
  reqTemplate: string | undefined,
  templates: Template[],
  cliOptions: CLIOptions,
): Promise<Source> {
  if (reqTemplate) {
    return getUserProvidedSource({ reqTemplate, templates, cliOptions });
  }

  const template = await askTemplateChoice({ templates, cliOptions });
  if (template === "Git repository") {
    return askGitRepositorySource({ cliOptions });
  }
  if (template === "Local template") {
    return askLocalSource();
  }
  return createTemplateSource({
    template,
    cliOptions,
  });
}

async function askGitRepositorySource({ cliOptions }: { cliOptions: CLIOptions }): Promise<Source> {
  const { gitRepoUrl } = (await prompts(
    {
      type: "text",
      name: "gitRepoUrl",
      validate: (url?: string) => {
        if (url && isValidGitRepoUrl(url)) {
          return true;
        }
        return logger.red("Invalid repository URL");
      },
      message: logger.interpolate`Enter a repository URL from GitHub, Bitbucket, GitLab, or any other public repo.
(e.g: url=${"https://github.com/ownerName/repoName.git"})`,
    },
    {
      onCancel() {
        logger.error("A git repo URL is required.");
        process.exit(1);
      },
    },
  )) as { gitRepoUrl: string };

  let strategy = cliOptions.gitStrategy;
  if (!strategy) {
    const ans = (await prompts(
      {
        type: "select",
        name: "strategy",
        message: "How should we clone this repo?",
        choices: [
          { title: "Deep clone: preserve full history", value: "deep" },
          { title: "Shallow clone: clone with --depth=1", value: "shallow" },
          {
            title: "Copy: do a shallow clone, but do not create a git repo",
            value: "copy",
          },
          {
            title: "Custom: enter your custom git clone command",
            value: "custom",
          },
        ],
      },
      {
        onCancel() {
          logger.info`Falling back to name=${"deep"}`;
        },
      },
    )) as { strategy?: GitStrategy };

    strategy = ans.strategy;
  }
  return {
    type: "git",
    url: gitRepoUrl,
    strategy: strategy ?? "deep",
  };
}

async function askLocalSource(): Promise<Source> {
  const { templateDir } = (await prompts(
    {
      type: "text",
      name: "templateDir",
      validate: async (dir?: string) => {
        if (dir) {
          const fullDir = path.resolve(dir);
          if (await fs.pathExists(fullDir)) {
            return true;
          }
          return logger.red(logger.interpolate`path=${fullDir} does not exist.`);
        }
        return logger.red("Please enter a valid path.");
      },
      message: "Enter a local folder path, relative to the current working directory.",
    },
    {
      onCancel() {
        logger.error("A file path is required.");
        process.exit(1);
      },
    },
  )) as { templateDir: string };
  return {
    type: "local",
    path: templateDir,
  };
}

function createTemplateChoices(templates: Template[]): Choice[] {
  function makeNameAndValueChoice(value: string | Template): Choice {
    if (typeof value === "string") {
      return { title: value, value };
    }
    const title = value.name === recommendedTemplate ? `${value.name} (recommended)` : value.name;
    return { title, value };
  }

  return [
    ...templates.map(template => makeNameAndValueChoice(template)),
    makeNameAndValueChoice("Git repository"),
    makeNameAndValueChoice("Local template"),
  ];
}

async function askTemplateChoice({ templates, cliOptions }: { templates: Template[]; cliOptions: CLIOptions }) {
  return cliOptions.gitStrategy
    ? "Git repository"
    : (
        (await prompts(
          {
            type: "select",
            name: "template",
            message: "Select a template below...",
            choices: createTemplateChoices(templates),
          },
          {
            onCancel() {
              logger.error("A choice is required.");
              process.exit(1);
            },
          },
        )) as { template: Template | "Git repository" | "Local template" }
      ).template;
}

async function createTemplateSource({
  template,
  cliOptions,
}: {
  template: Template;
  cliOptions: CLIOptions;
}): Promise<Source> {
  const language = "typescript";
  // if (language === "typescript" && !template.tsVariantPath) {
  //   logger.error`Template name=${template.name} doesn't provide a TypeScript variant.`;
  //   process.exit(1);
  // }
  return {
    type: "template",
    template,
    language,
  };
}

async function getTemplateSource({
  templateName,
  templates,
  cliOptions,
}: {
  templateName: string;
  templates: Template[];
  cliOptions: CLIOptions;
}): Promise<Source> {
  const template = templates.find(t => t.name === templateName);
  if (!template) {
    logger.error("Invalid template.");
    process.exit(1);
  }
  return createTemplateSource({ template, cliOptions });
}

// Get the template source explicitly requested by the user provided cli option
async function getUserProvidedSource({
  reqTemplate,
  templates,
  cliOptions,
}: {
  reqTemplate: string;
  templates: Template[];
  cliOptions: CLIOptions;
}): Promise<Source> {
  if (isValidGitRepoUrl(reqTemplate)) {
    if (cliOptions.gitStrategy && !gitStrategies.includes(cliOptions.gitStrategy)) {
      logger.error`Invalid git strategy: name=${
        cliOptions.gitStrategy
      }. Value must be one of ${gitStrategies.join(", ")}.`;
      process.exit(1);
    }
    return {
      type: "git",
      url: reqTemplate,
      strategy: cliOptions.gitStrategy ?? "deep",
    };
  }
  if (await fs.pathExists(path.resolve(reqTemplate))) {
    return {
      type: "local",
      path: path.resolve(reqTemplate),
    };
  }
  return getTemplateSource({
    templateName: reqTemplate,
    templates,
    cliOptions,
  });
}
