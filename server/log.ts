import * as log from "https://deno.land/std/log/mod.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: "｢{levelName}｣ {msg}", // ℹ
    }),
    // file: new log.handlers.FileHandler("WARNING", {
    //   filename: "./log.txt",
    //   // you can change format of output message using any keys in `LogRecord`
    //   formatter: "[{datetime} {levelName} ({level} {levelName})] {msg}",
    // }),
  },

  loggers: {
    // configure default logger available via short-hand methods above
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
    debug: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});

export default log;
