const chalk = require("chalk");

const loggerConstants = {
  events: {
    pageLoaded: "Page Loaded",
    error: "Error",
    navigating: "Going to",
  },
};

const logger = (arg) => {
  let logMessage;
  let title = `${arg.title}:` || "";
  const msg = arg.msg || "";
  const color = arg.color || null;

  if (color) title = `${chalk[color](title)} `;

  if (typeof arg === "object") {
    logMessage = title + msg;
  }

  if (arg.length) {
    let words = arg.map((word) => {
      let title = word.title ? `${word.title}:` : "";
      let msg = word.msg ? word.msg : "";
      let color = word.color ? word.color : null;

      if (color && title) title = `${chalk[color](title)}`;
      if (!title && color && msg) msg = `${chalk[color](msg)}`;
      return title + msg;
    });

    logMessage = words.join(" ");
  }

  console.log(logMessage);
};

const linkMapper = ({ parsedLink, bool, targetHost }) => {
  return [
    {
      color: "yellow",
      title: "Is host a match",
    },
    {
      msg: String(parsedLink),
    },
    {
      color: bool ? "green" : "red",
      msg: String(bool),
    },
    {
      msg: String(targetHost),
    },
  ];
};

const filterMapper = ({ type, filterItem, targetHost }) => {
  return [
    {
      color: "blue",
      title: `Filtering out ${type}`,
    },
    {
      color: "red",
      msg: String(filterItem),
    },
    {
      msg: String(targetHost),
    },
  ];
};

module.exports = { logger, loggerConstants, linkMapper, filterMapper };
