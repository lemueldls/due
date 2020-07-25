import log from "./log.ts";
import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

export default app;

const port = 8000;
const hostname = "0.0.0.0";

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/public`,
    index: "index.html",
  });
});

log.info(`Connecting to <http://${hostname === "0.0.0.0" ? "localhost" : hostname}:${port}>...`);

await app.listen({ hostname, port });
