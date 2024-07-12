import * as fs from "fs-extra";
import * as less from "less";
import * as path from "path";
import { themePalette } from "../../../src/styles/theme";

const srcPath = "../../../src/styles/theme.ts";
const srcTheme = path.resolve(__dirname, srcPath);

function compileLESS(from, to) {
  from = path.join(__dirname, from);
  to = path.join(__dirname, to);
  fs.readFile(from, function (err, data) {
    if (err) return;
    less.render(
      data.toString(),
      { compress: true, paths: [path.join(__dirname, "../../../src/styles/less")], javascriptEnabled: true },
      function (e, output) {
        if (e) console.error(e);
        if (!e) {
          fs.writeFile(to, output?.css ?? "");
        }
      },
    );
  });
}

const buildLessVar = () => {
  delete require.cache[srcTheme];

  Object.keys(themePalette).forEach(palette => {
    const themeValue = themePalette[palette];

    fs.writeFileSync(
      path.resolve(__dirname, `../../../src/styles/palette/theme-${palette}.less`),
      Object.keys(themeValue)
        .map(k => {
          if (k === "token" || k === "component") {
            return "";
          }

          if (typeof themeValue[k] !== "string" || !themeValue[k].includes("#")) {
            return `@${k.replace(/_/g, "-")}: ${themeValue[k]};`;
          }

          return `@${k.replace(/_/g, "-")}: ${themeValue[k].toLowerCase()};`;
        })
        .join("\r\n") + "\r\n",
    );
    compileLESS(`../../../src/styles/less/app-${palette}.less`, `../../../public/app-${palette}.css`);
  });

  console.log("compiled css file");
};

// build less vars
buildLessVar();
