const fs = require("fs");
const os = require("os");
const { logger } = require("./utils/chalkLogger");

const { EOL } = os;
const date = new Date().toISOString();

const siteMapperFileWriter = ({ indexed, config }) => {
  const DIR = config.projectRoot;
  const { outpath } = config.siteMap;
  const absOutpath = `${DIR}/${outpath}`;

  const xmlFile = fs.createWriteStream(absOutpath);
  dataToXml({ indexed, xmlFile });
};

const dataToXml = ({ indexed, xmlFile }) => {
  if (!indexed) return;

  xmlFile.on("error", function (err) {
    /* error handling */
  });

  // Top of xml
  xmlFile.write(templates.xml.top);

  // Begin urlset
  xmlFile.write(templates.xml.urlSetBegin);

  // Write urls
  for (const [_, value] of Object.entries(indexed)) {
    const { url, priority, changefreq } = value;

    // console.log(url, priority, changefreq);

    xmlFile.write(templates.xml.url({ url, priority, changefreq }));
  }

  // End urlset
  xmlFile.write(templates.xml.urlSetEnd);
  xmlFile.end();

  // log done
  logger({ color: "blue", msg: "Done", title: "Parsing" });
};

const tabs = (num) => "\t".repeat(num);
const line = (text, numOfTabs = 0) => tabs(numOfTabs) + text + EOL;
const singleTabbedLine = (text) => line(text, 1);
const threeTabbedLine = (text) => line(text, 3);

const templates = {
  xml: {
    top: line('<?xml version="1.0" encoding="UTF-8"?>'),
    urlSetBegin:
      line("<urlset") +
      threeTabbedLine('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') +
      threeTabbedLine('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"') +
      threeTabbedLine(
        'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9'
      ) +
      line('http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">', 6) +
      EOL +
      EOL,
    url: ({ url, priority, changefreq }) =>
      line("<url>") +
      singleTabbedLine(`<loc>${url}</loc>`) +
      singleTabbedLine(`<lastmod>${date}</lastmod>`) +
      ((priority && singleTabbedLine(`<priority>${priority}</priority>`)) ||
        "") +
      ((changefreq &&
        singleTabbedLine(`<changefreq>${changefreq}</changefreq>`)) ||
        "") +
      line("</url>"),
    urlSetEnd: EOL + EOL + line("</urlset>"),
  },
};
module.exports = { siteMapperFileWriter };
