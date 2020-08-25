export const start = async () => {
  const output = Deno.run({
    cmd: `deno run --allow-net --allow-run --allow-read --allow-write ${Deno.cwd()}/server/index.ts`.split(
      " "
    ),
    stderr: "piped",
  });

  console.log(new TextDecoder("utf-8").decode(await output.stderrOutput()));
  return output;
};
start();

// for await (const event of Deno.watchFs(`${Deno.cwd()}/server`)) await start();
