const { getProjectRoot } = require("../src/utils");
const findChrome = require("chrome-finder");
const { siteMapperIndexer } = require("./siteMapperIndexer");
const { siteMapperFileWriter } = require("./siteMapperFileWriter");

// https://www.v9digital.com/insights/sitemap-xml-why-changefreq-priority-are-important/

function SiteMapper(config) {
  this.config = config;
  this.indexed;
  this.config.launchOptions.executablePath = findChrome();
  this.config.projectRoot = getProjectRoot();
}

SiteMapper.prototype = {
  indexer: async function () {
    const indexed = siteMapperIndexer(this.config);
    this.indexed;
    return indexed;
  },
  fileWriter: async function (indexed) {
    await siteMapperFileWriter({ indexed, config: this.config });
  },
};

module.exports = {
  SiteMapper,
};
