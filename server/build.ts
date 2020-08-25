import log from "./log.ts";

// const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

// const importJSON = async (file: string) =>
//   JSON.parse(decoder.decode(await Deno.readFile(file)));

// const tsconfig = await importJSON(`${Deno.cwd()}/tsconfig.json`);

export const lint = async (paths: string[]) => {
  const output = await Deno.run({
    cmd: [..."deno lint --unstable".split(" "), ...paths],
    stdout: "piped",
  }).output();

  if (Object.keys(output).length) log.warning(output);
};


let building = false;
export const build = async (event?: Deno.FsEvent) => {
  building = true;
  if (event?.kind === "modify" || event?.kind === "create") await lint(event.paths);

  log.info("Building...");
  console.time("Build Time");

  const main = `${Deno.cwd()}/src/main.ts`;
  const bundle = `${Deno.cwd()}/public/bundle.js`;

  // const [diagnostic, output] = await Deno.bundle(main);
  // if (diagnostic) log.warn(Deno.formatDiagnostics(diagnostic));

  // Deno.writeFile(bundle, encoder.encode("// deno-fmt-ignore-file\n"));
  // Deno.writeFile(bundle, await output.stderrOutput()), { append: true });

  const output = Deno.run({
    cmd: ["deno", "bundle", main, bundle],
    stderr: "piped",
  });

  console.group("");

  log.debug(decoder.decode(await output.stderrOutput()));

  console.groupEnd();
  log.info("Completed Build.");
  console.timeEnd("Build Time");

  building = false;
  return output;
};
await build();

// @ts-ignore
for await (const event of Deno.watchFs(`${Deno.cwd()}/src`)) {
  if (!building) build(building || event);
}
