const fs = require("fs/promises");

(async () => {
  await processEnvFiles();

  await processCollectionFiles();
})();

async function processEnvFiles() {
  const envList = await readFiles("./input/environments");

  if (!envList || !envList.length)
    return console.log(
      "WARNING :: No env files found in ./input/environments folder"
    );

  const vsCodeSettingsData = {
    "rest-client.environmentVariables": {
      $shared: {},
    },
  };

  envList.forEach((env) => {
    env = JSON.parse(env);

    const envFileName = generateSafeName(env.name);
    vsCodeSettingsData["rest-client.environmentVariables"][envFileName] = {};

    env.data.forEach((variable) => {
      vsCodeSettingsData["rest-client.environmentVariables"][envFileName][
        variable.name
      ] = variable.value;
    });
  });

  fs.writeFile(
    "./output/settings.json",
    JSON.stringify(vsCodeSettingsData, null, 2)
  );
}

async function processCollectionFiles() {
  const collectionList = await readFiles("./input/collections");

  if (!collectionList || !collectionList.length)
    return console.log(
      "WARNING :: No collection files found in ./input/collections folder"
    );

  await fs.mkdir("./output/rest-client");

  collectionList.forEach((collection) => {
    collection = JSON.parse(collection);

    const collectionFileName = generateSafeName(collection.colName) + ".http";

    let requestText = "";

    collection.requests.forEach((request) => {
      requestText += `### ${request.name}`;
      requestText += "\n";
      requestText += request.method + " " + request.url;
      requestText += "\n";

      if (request.headers && request.headers.length) {
        request.headers.forEach((header) => {
          if (header.isDisabled) return;
          requestText += header.name + " " + header.value;
          requestText += "\n";
        });
      }

      if (request.body) {
        requestText += "\n";
        if (request.body.type == "json") {
          try {
            requestText += JSON.stringify(
              JSON.parse(request.body.raw),
              null,
              2
            );
          } catch (error) {
            requestText = +request.body.raw;
          }
        }
        requestText += "\n";
      }

      requestText += "\n\n";
    });
    fs.writeFile(`./output/rest-client/${collectionFileName}`, requestText);
  });
}

async function readFiles(path) {
  const filePaths = await fs.readdir(path);

  if (!filePaths || !filePaths.length) return [];

  const fileContentList = [];

  for await (const filePath of filePaths) {
    let fileContent;
    try {
      fileContent = await fs.readFile(path + "/" + filePath, {
        encoding: "utf-8",
      });
    } catch (error) {
      fileContent = null;
    }
    if (fileContent) fileContentList.push(fileContent);
  }

  return fileContentList;
}

function generateSafeName(name) {
  if (!name) name = Math.floor(Math.random() * 10000).toString();
  return name
    .toLowerCase()
    .replace(/\W/gi, "-")
    .replace(/-{2,}/gi, "-")
    .replace(/-+$/gi, "");
}
