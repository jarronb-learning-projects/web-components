const { puppeteerInit } = require("./puppeteerInit");
const { linkMapper, logger, filterMapper } = require("./utils/chalkLogger");

const siteMapperIndexer = async (config) => {
  // Init
  const queue = [];
  const visited = {};
  const addedToQueue = {};
  const configAddress = config.url.port
    ? `${config.url.protocol}${config.url.host}:${config.url.port}`
    : `${config.url.protocol}${config.url.host}`;

  let { browser, page } = await puppeteerInit(config);
  queue.push(configAddress);

  // https://stackoverflow.com/a/26766402
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const regrex = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

  /**
   * worker
   */
  const indexer = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Stop when queue is empty and close browser
        if (!queue.length) {
          browser.close();
          return await resolve(visited);
        }

        // get current address
        const currentLink = queue.shift();

        // set new page
        // wait load, domcontentloaded, networkidle0, networkidle2
        await page.goto(currentLink, config.page.waitUntil);

        const links = await page.evaluate(() => {
          return Array.from(document.links).reduce((acc, cur) => {
            acc.push(cur.href);
            return acc;
          }, []);
        });

        const filteredLinks = await links.filter((link) => {
          const parsedLink = regrex.exec(link)[4];
          const parsedHash = regrex.exec(link)[8];

          const targetHost = config.url.port
            ? `${config.url.host}:${config.url.port}`
            : `${config.url.host}`;

          let bool = (parsedLink) =>
            parsedLink === targetHost &&
            !parsedHash &&
            link !== currentLink &&
            link !== `${currentLink}/` &&
            link !== `${configAddress}/` &&
            !visited[link] &&
            !addedToQueue[link];

          if (config.debug) {
            logger(
              linkMapper({
                parsedLink,
                bool: bool(parsedLink),
                targetHost,
              })
            );

            parsedHash &&
              logger(
                filterMapper({
                  type: "hash",
                  filterItem: parsedHash,
                  targetHost,
                })
              );
          }

          return bool(parsedLink);
        });

        filteredLinks.forEach((link) => {
          if (!addedToQueue[link]) {
            queue.push(link);
            addedToQueue[link] = true;
          }
        });

        // added current page to visited
        const urlMapper = (link) => {
          let urlConfig;
          let priority;
          let changefreq;
          const url = link;
          let path = regrex.exec(url)[5];

          if (path) {
            path = `/${path.split("/")[1]}`;
            urlConfig = config.urlDetails[path];
          }

          if (path && urlConfig) {
            priority =
              config.urlDetails[path].priority !== undefined
                ? config.urlDetails[path].priority
                : undefined;

            changefreq =
              config.urlDetails[path].changefreq !== undefined
                ? config.urlDetails[path].changefreq
                : undefined;
          } else {
            if (!priority) priority = 0.5;
          }

          if (link === configAddress) {
            priority = config.urlDetails.index.priority;
            changefreq = config.urlDetails.index.changefreq;
          }

          return { url, priority, changefreq };
        };

        visited[currentLink] = urlMapper(currentLink);

        return resolve(indexer());
      } catch (e) {
        reject(e);
      }
    });
  };

  return await indexer();
};

module.exports = { siteMapperIndexer };
