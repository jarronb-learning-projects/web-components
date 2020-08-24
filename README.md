# @jarronb/site-mapper [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)]

## Requirements

- Must have chrome or chromium

## Dependencies

- chrome-finder: "^1.0.7"
- puppeteer-core: "^5.2.1"

## Install

`npm i @jarronb/site-mapper`

## Usage

- need to define config

### Sample config

```javascript
const siteMapper = require("@jarronb/site-mapper");

const config = {
  // debug mode for indexer
  debug: false,
  url: {
    protocol: "http://",
    host: "localhost", // or www.sample.com
    port: "3000", // can be null or ""
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

## Config

### Url Details

- Is an object where the key equals the beginning of a path for example
- www.localhost.com/blog/ and www.localhost.com/blog/sample-post will be under the same conditions
