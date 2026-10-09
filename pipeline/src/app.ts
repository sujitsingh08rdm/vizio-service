import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { appBoilerplate } from "./util/boilerplate";
const log = console.log;

const validateService = (service: string) => {
  if (!service || service.length === 0) {
    throw new Error("Service name is required");
  }
  const regex = /^[a-zA-Z0-9-]+$/;
  const isValid = regex.test(service);
  if (!isValid) {
    throw new Error("Space or any Symbols not allowed, Please Try Again");
  }

  return service.toLowerCase();
};

const exitApp = (msg: string | null = null) => {
  const message = chalk.bgRedBright.black.bold(msg ? msg : " 👋  Good buy ! ");
  log(message);
  process.exit(0);
};

const makeFolder = (path: string) => {
  const isExist = fs.existsSync(path);
  if (isExist) {
    throw new Error(` ${path.split("\\").pop()} service already exists ! `);
  }
  fs.mkdirSync(path);
};

const copyFiles = (files: string[], inputPath: string, outputPath: string) => {
  files.forEach((file) => {
    fs.copyFileSync(
      path.join(`${inputPath}`, file),
      path.join(`${outputPath}`, file),
    );
  });
};

const createFiles = (files: string[], service: string, srcPath: string) => {
  files.forEach((file) => {
    const filename = `${service}${file}`;
    const filepath = path.join(srcPath, filename);
    fs.writeFileSync(filepath, "");
  });
};

const updateLastPort = (pipelinePath: string, newPort: number) => {
  const envFilePath = path.join(pipelinePath, ".env");
  const envData = fs.readFileSync(envFilePath, "utf-8");

  const updated = envData.replace(
    /LAST_PORT\s*=\s*\d+/,
    `LAST_PORT = ${newPort}`,
  );

  fs.writeFileSync(envFilePath, updated);
};

const createEnvForNewService = (
  pipelinePath: string,
  servicePath: string,
  newPort: number,
) => {
  const pipelineEnvPath = path.join(pipelinePath, ".env");
  const newEnvPath = path.join(servicePath, ".env");
  const envData = fs.readFileSync(pipelineEnvPath, "utf-8");
  const stringChangedAfterPort = envData.replace(
    /PORT\s*=\s*\d+/,
    `PORT = ${newPort}`,
  );

  const arr = stringChangedAfterPort.split("\n");
  const modifiedData = arr
    .map((item) => {
      if (item.startsWith("LAST_PORT")) {
        return null;
      }
      if (item.startsWith("SERVER")) {
        return `SERVER = http://localhost:${newPort}\r`;
      }
      return item;
    })
    .filter(Boolean);

  const finalData = modifiedData.join("\n");
  fs.writeFileSync(newEnvPath, finalData);
};

const app = async () => {
  try {
    const welcomeMessage = chalk.bgMagenta.whiteBright.bold(
      "\n--- ✨ Welcome Team! ✨ ---\n",
    );
    log(welcomeMessage);

    const { service } = await inquirer.prompt({
      type: "input",
      name: "service",
      message: chalk.blue("Enter Service Name || to exit App write :q\n"),
    });
    if (service === ":q") {
      exitApp();
    }

    if (service === "pipeline") {
      exitApp(" 🙅  Pipeline word is reserved, Please use different name. 🙅 ");
    }

    const serviceName = validateService(service);
    const appPath = __dirname;
    const rootPath = path.resolve(appPath, "../../");
    const pipelinePath = path.resolve(appPath, "../");
    const servicePath = path.join(rootPath, serviceName);
    const srcPath = path.join(servicePath, "src");
    const appFilePath = path.join(srcPath, "app.ts");

    const filesListForCopy = ["Dockerfile", "package.json", "tsconfig.json"];

    const filesListForCreate = [
      ".controller.ts",
      ".service.ts",
      ".interface.ts",
      ".enum.ts",
      ".middleware.ts",
      ".dto.ts",
      ".router.ts",
    ];

    // service folder
    makeFolder(servicePath);

    // src folder inside service
    makeFolder(srcPath);

    // change last port in pipeline
    const lastPort = parseInt(process.env.LAST_PORT!);
    const newPort = lastPort + 1;
    // creating app.ts
    fs.writeFileSync(
      appFilePath,
      appBoilerplate(serviceName, newPort).join("\n"),
      "utf-8",
    );

    updateLastPort(pipelinePath, newPort);

    // Create ENV for new service
    createEnvForNewService(pipelinePath, servicePath, newPort);

    // copy all required files for typescript
    copyFiles(filesListForCopy, pipelinePath, servicePath);

    // creating required files for start coding
    createFiles(filesListForCreate, serviceName, srcPath);
    log(
      chalk.bgYellow.black.bold(
        `\n SUCCESS - ${serviceName} created successfully!`,
      ),
    );
    exitApp();
  } catch (error) {
    if (error instanceof Error) {
      log(chalk.bgRed.white.bold(` ✖️  Error - ${error.message} `));
    }
    app();
  }
};

app();
