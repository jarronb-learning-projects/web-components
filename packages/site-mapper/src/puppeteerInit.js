const puppeteer = require("puppeteer-core");
const { logger, loggerConstants } = require("./utils/chalkLogger");

function puppeteerInit(config) {
  const url = config.url.port
    ? `${config.url.protocol}${config.url.host}:${config.url.port}`
    : `${config.url.protocol}${config.url.host}`;

  return new Promise(async (resolve, reject) => {
    try {
      // set some options (set headless to false so we can see
      // this automated browsing experience)

      const browser = await puppeteer.launch(config.launchOptions);

      const page = await browser.newPage(url);

      // set viewport and user agent (just in case for nice viewing)
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
      );

      // go to the target web
      await logger({
        color: "blue",
        title: loggerConstants.events.pageLoaded,
        msg: await url,
      });

      await page.goto(url, { waitUntil: "networkidle0" });

      await logger({
        color: "blue",
        title: "Browser version",
        msg: await browser.version(),
      });

      return resolve({ browser, page });
    } catch (e) {
      return reject(e);
    }
  });
}

module.exports = { puppeteerInit };
