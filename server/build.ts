import log from "./log.ts";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

const importJSON = async (file: string) =>
  JSON.parse(decoder.decode(await Deno.readFile(file)));

const tsconfig = await importJSON(`${Deno.cwd()}/tsconfig.json`);

export const format = async (paths: string[]) => {
  return await Deno.run({
    cmd: ["deno", "fmt", ...paths],
    stdout: "piped",
  }).output();
};

let timeoutCooldown: number;
/**
 * @param {number} timeout - Time for cooldown to end in milliseconds
 * @default 2000
 */
const buildTimeout = async (timeout: number = 2000): Promise<never> =>
  new Promise((resolve) => {
    clearTimeout(timeoutCooldown);
    timeoutCooldown = setTimeout(() => {
      resolve();
    }, timeout);
  });

export const build = async (event?: Deno.FsEvent) => {
  await buildTimeout();
  if (event?.kind === "modify" || event?.kind === "create")
    await format(event.paths);

  log.info("Building...");
  console.time("Build Time");

  const main = `${Deno.cwd()}/src/main.ts`;
  const bundle = `${Deno.cwd()}/public/bundle.js`;

  // const [diagnostic, output] = await Deno.bundle(main);
  // if (diagnostic) log.warn(Deno.formatDiagnostics(diagnostic));

  Deno.writeFile(bundle, encoder.encode("// deno-fmt-ignore-file\n"));
  // Deno.writeFile(bundle, await output.stderrOutput()), { append: true });

  const output = await Deno.run({
    cmd: ["deno", "bundle", main, bundle],
    stderr: "piped"
  });

  console.group("");

  log.debug(decoder.decode(await output.stderrOutput()));

  console.groupEnd();
  log.info("Completed Build.");
  console.timeEnd("Build Time");

  return output;
};
await build();

for await (const event of Deno.watchFs(`${Deno.cwd()}/src`)) await build(event);
