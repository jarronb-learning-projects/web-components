# `@jarronb/site-mapper`

Site-mapper is a package used to generate a XML sitemap utilizing [puppeteer-core](https://www.npmjs.com/package/puppeteer-core)

## Example Usage

```javascript
const siteMapper = require("@jarronb/site-mapper");

const config = {
  // debug mode for indexer
  debug: false,
  url: {
    protocol: "http://",
    host: "localhost", // or www.sample.com
    port: "3000", // or can be null or ""
  },
  // launch options for puppeteer
  launchOptions: {
    headless: true,
    args: ["--start-maximized"],
  },
  // puppeteer page load event
  // https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-class-page
  page: {
    waitUnitl: "load",
  },
  siteMap: {
    outpath: "sitemap.xml",
  },
  urlDetails: {
    index: {
      priority: 1.0,
      changefreq: "always",
    },
    "/blog": {
      priority: 0.7,
    },
  },
};

const func = async () => {
  let s = new siteMapper(config);
  const indexed = await s.indexer();
  await s.fileWriter(indexed);
};

func();
```

### Read more [here](https://github.com/jarronb/site-mapper#readme)
