import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { logger } from "./logger.js";
import { gitStrategies, recommendedTemplate } from "./types.js";
import { isValidGitRepoUrl } from "./utils.js";
export async function getSource(reqTemplate, templates, cliOptions) {
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
async function askGitRepositorySource({ cliOptions }) {
    const { gitRepoUrl } = (await prompts({
        type: "text",
        name: "gitRepoUrl",
        validate: (url) => {
            if (url && isValidGitRepoUrl(url)) {
                return true;
            }
            return logger.red("Invalid repository URL");
        },
        message: logger.interpolate `Enter a repository URL from GitHub, Bitbucket, GitLab, or any other public repo.
(e.g: url=${"https://github.com/ownerName/repoName.git"})`,
    }, {
        onCancel() {
            logger.error("A git repo URL is required.");
            process.exit(1);
        },
    }));
    let strategy = cliOptions.gitStrategy;
    if (!strategy) {
        const ans = (await prompts({
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
        }, {
            onCancel() {
                logger.info `Falling back to name=${"deep"}`;
            },
        }));
        strategy = ans.strategy;
    }
    return {
        type: "git",
        url: gitRepoUrl,
        strategy: strategy ?? "deep",
    };
}
async function askLocalSource() {
    const { templateDir } = (await prompts({
        type: "text",
        name: "templateDir",
        validate: async (dir) => {
            if (dir) {
                const fullDir = path.resolve(dir);
                if (await fs.pathExists(fullDir)) {
                    return true;
                }
                return logger.red(logger.interpolate `path=${fullDir} does not exist.`);
            }
            return logger.red("Please enter a valid path.");
        },
        message: "Enter a local folder path, relative to the current working directory.",
    }, {
        onCancel() {
            logger.error("A file path is required.");
            process.exit(1);
        },
    }));
    return {
        type: "local",
        path: templateDir,
    };
}
function createTemplateChoices(templates) {
    function makeNameAndValueChoice(value) {
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
async function askTemplateChoice({ templates, cliOptions }) {
    return cliOptions.gitStrategy
        ? "Git repository"
        : (await prompts({
            type: "select",
            name: "template",
            message: "Select a template below...",
            choices: createTemplateChoices(templates),
        }, {
            onCancel() {
                logger.error("A choice is required.");
                process.exit(1);
            },
        })).template;
}
async function createTemplateSource({ template, cliOptions, }) {
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
async function getTemplateSource({ templateName, templates, cliOptions, }) {
    const template = templates.find(t => t.name === templateName);
    if (!template) {
        logger.error("Invalid template.");
        process.exit(1);
    }
    return createTemplateSource({ template, cliOptions });
}
// Get the template source explicitly requested by the user provided cli option
async function getUserProvidedSource({ reqTemplate, templates, cliOptions, }) {
    if (isValidGitRepoUrl(reqTemplate)) {
        if (cliOptions.gitStrategy && !gitStrategies.includes(cliOptions.gitStrategy)) {
            logger.error `Invalid git strategy: name=${cliOptions.gitStrategy}. Value must be one of ${gitStrategies.join(", ")}.`;
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
