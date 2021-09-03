var csv = require("csvtojson");
var csvFilePath = "./test.csv";
var puppeteer = require("puppeteer");

/** Main function*/
(async () => {
  var chromiumExecutablePath = puppeteer.executablePath();
  if (typeof process.pkg !== "undefined") {
    chromiumExecutablePath = puppeteer
      .executablePath()
      .replace(
        /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
        path.join(path.dirname(process.execPath), "chromium")
      );
  }

  console.log("abriendo navegador!");

  browser = await puppeteer.launch({
    headless: true,
    executablePath: chromiumExecutablePath,
    args: ["--use-fake-ui-for-media-stream"],
    slowMo: 0,
  });

  page = (await browser.pages())[0];

  var table = await getJsonFromCsv();

  console.log("data extraida de csv");

  var uploading = await uploadData(table);

  console.log("data enviada!");

})();

/** Function to open Google API */

async function uploadData(data) {

  var googleAPI =
    "https://script.google.com/macros/s/AKfycbybzlj9p5suHb7MIsoyO-1lQKKplftzQU1_gUGLe5SQjLNtCz1gSxpOyRT2D4YBToQWaA/exec";

  console.log("entrando a API");

  var myJSON = JSON.stringify(data);

  await page.goto(googleAPI, { waitUntil: "networkidle0" });

  var posting = await page.evaluate(
    async ({myJSON, googleAPI}) => {
      await fetch(googleAPI, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Contect-Type": "application/json",
        },
        body: myJSON,
      });
    },
    { myJSON, googleAPI }
  );
}

/** Function to get the JSON from csv*/
async function getJsonFromCsv() {
  return await csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      return jsonObj;
    });
}
