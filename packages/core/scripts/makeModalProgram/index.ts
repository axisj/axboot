import * as fs from "fs";
import * as path from "path";
import programConfig from "../../../makeModalProgramConfig";
import { getNameNDir } from "../getNameNDir";
import { camelCase, exist, mkdir } from "../utils";

function main() {
  const { modalsDir, templateDir, modals } = programConfig;

  modals.forEach(p => {
    const pName = p.name;

    const targetDir = path.join(modalsDir, pName);
    if (exist(targetDir)) {
      throw `There is a modal already created with the same name. "${targetDir}" Please remove the folder and try again.`;
    }

    mkdir(targetDir);
    console.log(targetDir, "was created successfully.");

    const fileNames = fs
      .readdirSync(path.join(templateDir, p.type), { withFileTypes: true, encoding: "utf-8" })
      .filter(p => p.isFile())
      .map(p => p.name);
    const Pascal_programName = camelCase(pName, { pascalCase: true });

    // 템플릿 파일로 프로그램 파일들 생성
    {
      fileNames.forEach(fn => {
        let data = fs.readFileSync(path.join(templateDir, p.type, fn), { encoding: "utf-8" });
        let pathToFile = path.join(targetDir, fn);

        const reMPType = new RegExp(`Modal\\$${p.type}\\$`, "g");
        const rePType = new RegExp(`\\$${p.type}\\$`, "g");
        const reUsePType = new RegExp(`use\\$${p.type}\\$`, "g");

        pathToFile = pathToFile.replace(reMPType, Pascal_programName + "Modal").replace(rePType, Pascal_programName);
        data = data
          .replace(reMPType, Pascal_programName + "Modal")
          .replace(reUsePType, "use" + Pascal_programName)
          .replace(rePType, Pascal_programName);
        // .replace('import { EXAMPLE_ROUTERS } from "@axboot/core/router/exampleRouter";', 'import { ROUTES } from "router";')
        // .replace(`EXAMPLE_ROUTERS.${p.type}.path`, `ROUTES.${programTypeName}.path`)
        // .replace("$example$", programTypeName);

        if (exist(pathToFile)) {
          throw "Failed to create file. The file already exists.";
        } else {
          console.log(pathToFile);
          fs.writeFileSync(pathToFile, data);
        }
      });
    }
  });
}

main();
